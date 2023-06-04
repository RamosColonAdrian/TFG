export interface UserToZone {
  id: string;
  allowedBy: string;
  createdAt: string;
  updatedAt: string;
  User: User;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  location: string;
  UserToZone: UserToZone[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  User: User[];
  updatedAt: string;
  createdAt: string;
}

export interface User {
  id: string;
  dni?: string;
  name?: string;
  surname?: string;
  birthDate?: string;
  registerDate?: string;
  address?: string;
  email: string;
  hashedPassword: string;
  phone?: string;
  relativeName?: string;
  relativePhone?: string;
  role?: string;
  type?: string;
  picture?: string;
  departmentId?: string;
  Department?: Department;
}

export interface AccessLog{
  id: string;
  userId: string;
  zoneId: string;
  access: boolean;
  createdAt: string;
  updatedAt: string;
  User: User;
  Zone: Zone;
}
