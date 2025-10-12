import { Component, NgModule } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice.service';
import { Role } from '../models/common-models/companyMaster';
import { User, UserPermission, Module } from '../models/common-models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {
  roles: Role[] = [];
  users: User[] = [];
  permissions: UserPermission[] = [];
  modules: Module[] = [];

  // Track selected modules separately
  selectedModulesMap: { [moduleID: number]: boolean } = {};
  permissionNameMap: { [moduleID: number]: string } = {};

  selectedRoleId: number | undefined;
  selectedUserId: number | undefined;

  constructor(private service: CommonserviceService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
    this.loadModules();
  }

  loadRoles() {
    this.service.getRoles().subscribe(res => (this.roles = res));
  }

  loadUsers() {
    this.service.getUsers().subscribe(res => (this.users = res));
  }

  loadPermissionsForRole() {
    if (!this.selectedRoleId) return;
    this.service.getPermissionsByRole(this.selectedRoleId).subscribe(res => {
      this.permissions = res;
      this.markSelectedModules();
    });
  }

  loadPermissionsForUser() {
    if (!this.selectedUserId) return;
    this.service.getPermissionsByUser(this.selectedUserId).subscribe(res => {
      this.permissions = res;
      this.markSelectedModules();
    });
  }

  loadModules() {
    this.service.getAllModules().subscribe(
      res => {
        this.modules = res;
        res.forEach(m => {
          if (!(m.moduleID in this.selectedModulesMap)) this.selectedModulesMap[m.moduleID] = false;
          if (!(m.moduleID in this.permissionNameMap)) this.permissionNameMap[m.moduleID] = '';
        });
        this.markSelectedModules();
      },
      err => console.error('Failed to load modules', err)
    );
  }

private markSelectedModules() {
  if (!this.permissions.length) return;
  this.modules.forEach(m => {
    const permission = this.permissions.find(p => +p.moduleID === m.moduleID);
    this.selectedModulesMap[m.moduleID] = !!permission;
    this.permissionNameMap[m.moduleID] = permission?.permissionName || '';
  });
}


  savePermission(permission: UserPermission) {
    if (!permission.permissionName || !permission.moduleID) {
      alert('Permission Name is required for each module.');
      return;
    }
    this.service.savePermission(permission).subscribe(() => {
    });
  }

  deletePermission(id: number) {
    if (!confirm('Are you sure to delete this permission?')) return;
    this.service.deletePermission(id).subscribe(() => {
      if (this.selectedUserId) this.loadPermissionsForUser();
      else if (this.selectedRoleId) this.loadPermissionsForRole();
    });
  }

  saveAllSelectedModules() {
  if (!this.selectedUserId && !this.selectedRoleId) {
    alert('Please select a user or role first.');
    return;
  }

  const selectedModuleIDs = Object.keys(this.selectedModulesMap)
    .filter(id => this.selectedModulesMap[+id])
    .map(id => +id);

  if (!selectedModuleIDs.length) {
    alert('Please select at least one module.');
    return;
  }

  const permission: UserPermission = {
    id: 0, // new record
    userID: this.selectedUserId || 0,
    moduleID: selectedModuleIDs.join(','), // comma-separated IDs
    permissionName: 'DefaultPermission', // optional if needed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  this.savePermission(permission);

  alert('Selected modules saved successfully.');
  if (this.selectedUserId) this.loadPermissionsForUser();
  else if (this.selectedRoleId) this.loadPermissionsForRole();
}

  hasSelectedModules(): boolean {
    return Object.values(this.selectedModulesMap).some(v => v);
  }
}
