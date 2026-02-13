import { TaskStatusOfProject } from './task-status.enum';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatusOfProject;
  createdAt: string;
  updatedAt?: string;

  assignedEmployeeId?: string | null;
  assignedEmployeeName?: string;
}
