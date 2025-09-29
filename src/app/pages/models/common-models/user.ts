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
