export interface Project {
  _id: string; 
  name: string; 
  description: string; 
  ownerId: string; 
  createdAt: string; 
  updatedAt: string;
  membersCount: number;
}
export interface CreateProjectData {
  name: string;
  description: string;
}