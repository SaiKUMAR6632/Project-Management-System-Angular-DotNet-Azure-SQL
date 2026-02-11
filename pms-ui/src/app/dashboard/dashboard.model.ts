export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  plannedProjects: number;
  
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  
  taskCompletionPercentage: number;
  projectCompletionPercentage: number;
}