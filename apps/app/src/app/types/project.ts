export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  membersCount: number;
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
}