export type MlsKeyPackageStatus = 'available' | 'consumed' | 'revoked';
export type MlsGroupMessageType = 'proposal' | 'commit';

export interface DeviceKeyPackage {
    keyPackageId: string;
    userId: string;
    deviceId: string;
    cipherSuite: string;
    encodedKeyPackage: string;
    status: MlsKeyPackageStatus;
    createdAt: string;
    consumedAt: string | null;
}

export interface ProjectMlsGroup {
    projectId: string;
    groupId: string;
    protocolVersion: 'MLS_1.0';
    cipherSuite: string;
    epoch: number;
    createdAt: string;
    updatedAt: string;
}

export interface MlsWelcomeMessage {
    welcomeId: string;
    projectId: string;
    groupId: string;
    senderDeviceId: string;
    recipientDeviceId: string;
    encodedWelcome: string;
    createdAt: string;
    consumedAt: string | null;
}

export interface MlsGroupEvent {
    eventId: string;
    projectId: string;
    groupId: string;
    epoch: number;
    senderDeviceId: string;
    messageType: MlsGroupMessageType;
    encodedMessage: string;
    createdAt: string;
}