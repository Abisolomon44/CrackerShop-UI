export interface User {
  userID: number;
  companyID: number;
  branchID: number;
  departmentID: number;
  roleID: number;
  userName: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdByUserID: number;
  createdSystemName: string;
  createdAt: Date;
  updatedByUserID: number;
  updatedSystemName: string;
  updatedAt: Date;
}
export interface UserPermission {
  id: number;
  userID?: number;
  roleID: number;
  permissionName: string;
  route: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface Module {
  moduleID: number;
  label: string;
  route: string;
  icon: string | null;
  isActive: boolean;
}