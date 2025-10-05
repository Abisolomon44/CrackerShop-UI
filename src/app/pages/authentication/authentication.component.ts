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
  selectedModules: { [key: number]: UserPermission } = {}; // key = moduleID
  selectedModuleID: number | null = null; // for ngModel
  selectedRoleId: number | undefined;
  selectedUserId: number | undefined;

  permissionName = ''; // e.g., "Company"
  route = ''; // e.g., "/default/master/company"

  constructor(private service: CommonserviceService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
     this.loadModules();
  }

  loadRoles() {
    this.service.getRoles().subscribe((res) => (this.roles = res));
  }

  loadUsers() {
    this.service.getUsers().subscribe((res) => (this.users = res));
  }

  loadPermissionsForRole() {
    if (!this.selectedRoleId) return;
    this.service
      .getPermissionsByRole(this.selectedRoleId)
      .subscribe((res) => (this.permissions = res));
  }

  loadPermissionsForUser() {
    if (!this.selectedUserId) return;
    this.service
      .getPermissionsByUser(this.selectedUserId)
      .subscribe((res) => (this.permissions = res));
  }

  savePermission(permission: UserPermission) {
    this.service.savePermission(permission).subscribe((res) => {
      alert('Permission saved successfully.');
      if (this.selectedUserId) this.loadPermissionsForUser();
      else if (this.selectedRoleId) this.loadPermissionsForRole();
    });
  }

  deletePermission(id: number) {
    if (!confirm('Are you sure to delete this permission?')) return;
    this.service.deletePermission(id).subscribe(() => {
      alert('Permission deleted successfully.');
      if (this.selectedUserId) this.loadPermissionsForUser();
      else if (this.selectedRoleId) this.loadPermissionsForRole();
    });
  }

  loadModules() {
    this.service.getAllModules().subscribe(
      (res) => (this.modules = res),
      (err) => console.error('Failed to load modules', err)
    );
  }

  initializeModuleSelections() {
    // For each module, create a UserPermission object placeholder
    this.modules.forEach((mod) => {
      this.selectedModules[mod.moduleID] = {
        id: 0,
        userID: this.selectedUserId || 0,
        roleID: this.selectedRoleId || 0,
        permissionName: mod.label,
        route: mod.route,
        canView: false,
        canAdd: false,
        canEdit: false,
        canDelete: false,
      };
    });
  }

  toggleModulePermission(mod: Module) {
    const perm = this.selectedModules[mod.moduleID];
    if (perm) {
      this.savePermission(perm);
    }
  }
  onModuleChange() {
  if (this.selectedModuleID) {
    const selectedModule = this.modules.find(
      (m) => m.moduleID === this.selectedModuleID
    );
    if (selectedModule) {
      this.permissionName = selectedModule.label;
      this.route = selectedModule.route;
    }
  } else {
    // Clear fields if no module selected
    this.permissionName = '';
    this.route = '';
  }
}

}
