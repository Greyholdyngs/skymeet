export type DeviceStatus = 'pending' | 'active' | 'revoked';

export interface DeviceIdentity {
    deviceId: string;
    userId: string;
    deviceName: string;
    platform: 'web' | 'desktop' | 'mobile';
    identityPublicKey: string;
    status: DeviceStatus;
    createdAt: string;
    lastSeenAt: string | null;
    revokedAt: string | null;
}