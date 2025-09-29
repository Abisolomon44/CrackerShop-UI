import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from '../../../services/commonservice.service';
import { Branch,Company } from '../../models/common-models/companyMaster';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-branch-master',
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-master.component.html',
  styleUrls: ['./branch-master.component.css']
})
export class BranchMasterComponent implements OnInit {
  companies: Company[] = [];
  branches: Branch[] = [];

  branch: Branch = this.getEmptyBranch();

  constructor(private commonservice: CommonserviceService) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadBranches();
  }

  /** Load companies from API */
  loadCompanies() {
    this.commonservice.getCompanies().subscribe({
      next: res => this.companies = res,
      error: err => console.error('Error fetching companies:', err)
    });
  }

  /** Load branches from API */
  loadBranches() {
    this.commonservice.getBranches().subscribe({
      next: data => this.branches = data,
      error: err => console.error('Error fetching branches:', err)
    });
  }

  /** Get company name by ID */
  getCompanyName(companyID: number): string {
    const company = this.companies.find(c => c.companyID === companyID);
    return company ? company.companyName : '';
  }

  /** Returns a new empty branch object */
  getEmptyBranch(): Branch {
    return {
      branchID: 0,
      companyID: 0,
      branchCode: '',
      branchName: '',
      address: '',
      isActive: true,
      createdByUserID: 0,
      createdSystemName: 'AngularApp',
      createdAt: new Date().toISOString(),
      updatedByUserID: 0,
      updatedSystemName: 'AngularApp',
      updatedAt: new Date().toISOString()
    };
  }

  /** Reset the form */
  resetBranch() {
    this.branch = this.getEmptyBranch();
  }

  /** Save or update branch */
  saveOrDeleteBranch() {
    if (!this.branch.branchCode || !this.branch.branchName || !this.branch.companyID) {
      alert("Company, Branch Code and Branch Name are required!");
      return;
    }

    this.commonservice.saveBranch(this.branch).subscribe({
      next: id => {
        alert(this.branch.branchID > 0 ? "Branch updated!" : "Branch created!");
        this.loadBranches();
        this.resetBranch();
      },
      error: err => {
        console.error('❌ Error saving branch:', err);
        alert("Error saving branch!");
      }
    });
  }

  /** Edit branch */
  editBranch(b: Branch) {
    this.branch = { ...b };
  }

  /** Soft delete branch */
  deleteBranch(b: Branch) {
    if (!confirm(`Are you sure you want to delete ${b.branchName}?`)) return;

    b.isActive = false;
    this.commonservice.saveBranch(b).subscribe({
      next: () => {
        alert("Branch deleted successfully!");
        this.loadBranches();
      },
      error: err => {
        console.error('❌ Error deleting branch:', err);
        alert("Error deleting branch!");
      }
    });
  }


}
