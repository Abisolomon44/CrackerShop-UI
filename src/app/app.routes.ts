import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login';
import { DefaultLayoutComponent } from './pages/container/default-layout/default-layout.component';
import { CompanyMasterComponent } from './pages/common-master/company-master';
import { BranchMasterComponent } from './pages/common-master/branch-master/branch-master.component';
import { DepartmentMasterComponent } from './pages/common-master/department-master';
import { RoleMasterComponent } from './pages/common-master/role-master';
import { UsermasterComponent } from './authentication/usermaster/usermaster.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'default',
    component: DefaultLayoutComponent,
    children: [
      { path: 'master/company', component: CompanyMasterComponent },
      { path: 'master/branch', component: BranchMasterComponent },
      { path: 'master/department', component: DepartmentMasterComponent },
      { path: 'master/role', component: RoleMasterComponent },
      { path: 'master/user', component: UsermasterComponent },
      { path: '', redirectTo: 'master/company', pathMatch: 'full' }
    ]
  },
 {
    path: 'user',
    component: DefaultLayoutComponent,
    children: [
      { path: 'master/accesscontrol', component: AuthenticationComponent },
      { path: '', redirectTo: 'master/accesscontrol', pathMatch: 'full' }
    ]
  }







];
