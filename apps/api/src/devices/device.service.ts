import { ConflictException, Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Device, DeviceDocument } from './schemas/device.schema.js';
import { RegisterDeviceDto } from './dto/register-device.dto.js';
import { KeyPackage, KeyPackageDocument} from './schemas/key-package.schema.js';

import { UploadKeyPackageDto } from './dto/upload-key-package.dto.js';
import { randomBytes, createPublicKey, verify as verifySignature, } from 'node:crypto';
import { CompleteDeviceEnrollmentDto } from './dto/complete-device-enrollment.dto.js';

@Injectable()
export class DevicesService {
    constructor(
        @InjectModel(Device.name)
        private readonly deviceModel: Model<DeviceDocument>,

        @InjectModel(KeyPackage.name)
        private readonly keyPackageModel: Model<KeyPackageDocument>,
    ) {}

    async registerDevice(userId: string, dto: RegisterDeviceDto) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new ConflictException('Invalid user');
        }

        const existingDevice = await this.deviceModel.findOne({
            userId: new Types.ObjectId(userId),
            deviceId: dto.deviceId,
        });

        if (existingDevice) {
            if (existingDevice.status === 'revoked') {
                throw new ConflictException( 'This device registration has been revoked' );
            }

            existingDevice.deviceName = dto.deviceName;
            existingDevice.platform = dto.platform;
            existingDevice.lastSeenAt = new Date();

            return existingDevice.save();
        }

        return this.deviceModel.create({
            userId: new Types.ObjectId(userId),
            deviceId: dto.deviceId,
            deviceName: dto.deviceName,
            platform: dto.platform,
            identityPublicKey: null,
            status: 'active',
            encryptionStatus: 'not_configured',
            lastSeenAt: new Date(),
            revokedAt: null,
        });
    }

    async getUserDevices(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new ConflictException('Invalid user');
        }

        return this.deviceModel.find({userId: new Types.ObjectId(userId),}).select(
                'deviceId deviceName platform status createdAt lastSeenAt revokedAt',
            ).sort({ createdAt: -1 }).lean();
    }

    async revokeDevice(userId: string, deviceId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new ConflictException('Invalid user');
        }

        const device = await this.deviceModel.findOne({ userId: new Types.ObjectId(userId), deviceId });

        if (!device) {
            throw new NotFoundException('Device not found');
        }

        if (device.status === 'revoked') {
            return device;
        }

        device.status = 'revoked';
        device.revokedAt = new Date();

        return device.save();
    }

    async uploadKeyPackage( userId: string, deviceId: string, dto: UploadKeyPackageDto ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new ConflictException('Invalid user');
        }

        const device = await this.deviceModel.findOne({
            userId: new Types.ObjectId(userId),
            deviceId,
            status: 'active',
        });

        if (!device) {
            throw new NotFoundException( 'Active device not found' );
        }
        if (device.encryptionStatus !== 'secured') {
            throw new ConflictException( 'Secure this device before uploading KeyPackages');
        }
        const existingPackage = await this.keyPackageModel.findOne({ keyPackageId: dto.keyPackageId });

        if (existingPackage) {
            throw new ConflictException( 'KeyPackage ID already exists' );
        }

        return this.keyPackageModel.create({
            userId: new Types.ObjectId(userId),
            deviceRecordId: device._id,
            keyPackageId: dto.keyPackageId,
            cipherSuite: dto.cipherSuite,
            encodedKeyPackage: dto.encodedKeyPackage,
            status: 'available',
            consumedAt: null,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
    }

    async createEnrollmentChallenge( userId: string, deviceId: string ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user');
        }

        const device = await this.deviceModel.findOne({
            userId: new Types.ObjectId(userId),
            deviceId,
            status: 'active',
        });

        if (!device) {
            throw new NotFoundException('Active device not found');
        }

        if (device.encryptionStatus === 'secured') {
            throw new ConflictException( 'This device is already secured' );
        }

        const challenge = randomBytes(32).toString('base64url');

        device.enrollmentChallenge = challenge;
        device.enrollmentChallengeExpiresAt = new Date( Date.now() + 5 * 60 * 1000 );

        await device.save();

        return {
            deviceId: device.deviceId,
            challenge,
            expiresAt: device.enrollmentChallengeExpiresAt,
        };
    }

    async completeDeviceEnrollment( userId: string, deviceId: string, dto: CompleteDeviceEnrollmentDto ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user');
        }

        const device = await this.deviceModel.findOne({
            userId: new Types.ObjectId(userId),
            deviceId,
            status: 'active',
        });

        if (!device) {
            throw new NotFoundException('Active device not found');
        }

        if ( device.encryptionStatus === 'secured' || !device.enrollmentChallenge || !device.enrollmentChallengeExpiresAt ) {
            throw new BadRequestException( 'No valid enrollment challenge exists' );
        }

        if (device.enrollmentChallengeExpiresAt.getTime() < Date.now()) {
            device.enrollmentChallenge = null;
            device.enrollmentChallengeExpiresAt = null;
            await device.save();

            throw new BadRequestException( 'Enrollment challenge has expired' );
        }

        const publicKeyBytes = Buffer.from(dto.publicKey, 'base64');
        const signatureBytes = Buffer.from(dto.signature, 'base64');

        if ( publicKeyBytes.length !== 32 || signatureBytes.length !== 64 ) {
            throw new BadRequestException( 'Invalid Ed25519 public key or signature' );
        }

        const publicKey = createPublicKey({
            key: Buffer.concat([
                Buffer.from('302a300506032b6570032100', 'hex'),
                publicKeyBytes,
            ]),
            format: 'der',
            type: 'spki',
        });

        const challengeBytes = Buffer.from(device.enrollmentChallenge,'base64url',);
        const isValid = verifySignature(
            null,
            challengeBytes,
            publicKey,
            signatureBytes,
        );

        if (!isValid) {
            throw new BadRequestException( 'Device signature verification failed' );
        }

        device.identityPublicKey = dto.publicKey;
        device.encryptionStatus = 'secured';
        device.enrollmentChallenge = null;
        device.enrollmentChallengeExpiresAt = null;

        return device.save();
    }

    async getAvailableKeyPackages( userId: string, deviceId: string ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user');
        }

        const device = await this.deviceModel.findOne({
            userId: new Types.ObjectId(userId),
            deviceId,
            status: 'active',
            encryptionStatus: 'secured',
        });

        if (!device) {
            throw new NotFoundException( 'Secured device not found' );
        }

        return this.keyPackageModel.find({
                deviceRecordId: device._id,
                status: 'available',
                $or: [
                    { expiresAt: null },
                    { expiresAt: { $gt: new Date() } },
                ],
            }).select('keyPackageId cipherSuite encodedKeyPackage createdAt expiresAt').sort({ createdAt: 1 }).lean();
    }


}