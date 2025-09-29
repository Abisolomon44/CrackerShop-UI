import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, Branch, Department, Role } from '../pages/models/common-models/companyMaster';
import { User } from '../pages/models/common-models/user';

@Injectable({

  providedIn: 'root'
})
export class CommonserviceService {
  private baseUrl = 'https://localhost:7097/api/Common';

  constructor(private http: HttpClient) { }

  saveCompany(company: Company): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/PostCompanyMaster`, company);
  }
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/GetCompanylist`);
  }

  getCompanyById(companyID: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/GetCompanylistByID/${companyID}`);
  }

  saveBranch(branch: Branch): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/PostBranchMaster`, branch);
  }

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.baseUrl}/GetBranchList`);
  }

  // Department
  saveDepartment(department: Department): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/PostDepartmentMaster`, department);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/GetDepartmentList`);
  }
  // Role
  saveRole(role: Role): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/PostRoleMaster`, role);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/GetRoleList`);
  }
  // === User APIs ===
  saveUser(user: User): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/PostUserMaster`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/GetUserList`);
  }



}
