export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'Planned' | 'Active' | 'Completed';
  createdAt: string;
}