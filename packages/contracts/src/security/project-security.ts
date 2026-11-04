export type HistoricalAccessPolicy = 'owner_approval';

export interface ProjectSecuritySettings {
    projectId: string;
    allowHistoricalAccess: boolean;
    requireDeviceApproval: boolean;
    updatedAt: string;
}