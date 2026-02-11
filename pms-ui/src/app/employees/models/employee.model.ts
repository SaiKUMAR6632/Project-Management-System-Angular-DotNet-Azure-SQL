export interface Employee {
  id: string;
  fullName: string;
  email: string;
  designation: string;
  department: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}