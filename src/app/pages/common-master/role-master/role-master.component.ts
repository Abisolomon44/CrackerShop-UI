import { Component } from '@angular/core';

import { Company, Branch, Department, Role } from '../../models/common-models/companyMaster';
import { CommonserviceService } from '../../../services/commonservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-role-master',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent {



  roles: Role[] = [];
  role: Role = this.getEmptyRole();

  constructor(private commonservice: CommonserviceService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  getEmptyRole(): Role {
    return {
      roleID: 0,
      roleCode: '',
      roleName: '',
      isActive: true,
      createdByUserID: 0,
      createdSystemName: '',
      createdAt: new Date().toISOString(),
      updatedByUserID: 0,
      updatedSystemName: '',
      updatedAt: new Date().toISOString()
    };
  }

  loadRoles() {
    this.commonservice.getRoles().subscribe({
      next: res => this.roles = res,
      error: err => {
        console.error(" Error loading roles:", err);
        alert("Error loading role list.");
      }
    });
  }

  saveOrUpdateRole() {
    if (!this.role.roleName ) {
      alert("Role Name and Code are required!");
      return;
    }

    this.commonservice.saveRole(this.role).subscribe({
      next: id => {
        alert(this.role.roleID > 0 ? "Role updated!" : "Role created!");
        this.loadRoles();
        this.resetForm();
      },
      error: err => {
        console.error(" Error saving role:", err);
        alert("Error saving role!");
      }
    });
  }

  editRole(r: Role) {
    this.role = { ...r }; // fill form for editing
  }

  deleteRole(r: Role) {
    if (!confirm(`Are you sure you want to delete ${r.roleName}?`)) {
      return;
    }

    r.isActive = false; // soft delete
    this.commonservice.saveRole(r).subscribe({
      next: id => {
        console.log("🗑️ Role deleted (soft delete), ID:", id);
        alert("Role deleted successfully!");
        this.loadRoles();
      },
      error: err => {
        console.error("❌ Error deleting role:", err);
        alert("Error deleting role.");
      }
    });
  }

  resetForm() {
    this.role = this.getEmptyRole();
  }









}
