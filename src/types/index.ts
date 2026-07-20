export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
  HR = "HR",
}

export enum StatusType {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  AWAY = "AWAY",
  MEETING = "MEETING",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
  OFFLINE = "OFFLINE",
}

export enum Priority {
  NORMAL = "NORMAL",
  IMPORTANT = "IMPORTANT",
  CRITICAL = "CRITICAL",
}

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  department: string | null;
  designation: string | null;
  phone: string | null;
  googleEnabled: boolean;
  passwordEnabled: boolean;
  lastLoginMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
  status?: Status;
  notifications?: Notification[];
  projects?: Project[];
}

export interface Status {
  id: string;
  userId: string;
  status: StatusType;
  statusMessage: string | null;
  loginTime: Date | null;
  logoutTime: Date | null;
  lastSeen: Date | null;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  managerId: string | null;
  manager?: User;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: Priority;
  pinned: boolean;
  scheduledAt: Date | null;
  createdById: string;
  createdBy?: User;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  members?: User[];
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  details: string | null;
  createdAt: Date;
}

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  department: string | null;
  designation: string | null;
}
