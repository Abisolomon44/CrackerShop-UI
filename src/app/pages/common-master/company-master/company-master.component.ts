import { Component } from '@angular/core';
import { Company } from '../../models/common-models/companyMaster'
import { CommonserviceService } from '../../../services/commonservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-company-master',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent {
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;

  companies: Company[] = [];
  company: Company = {} as Company;
  constructor(private commonservice: CommonserviceService) { }
  ngOnInit(): void {
    this.loadCompanies();
  }

  async saveOrDeleteCompany() {
  if (!this.company.companyName ) {
    alert("Company Name and Code are required!");
    return;
  }

  if (this.selectedLogoFile) {
    this.company.companyLogo = await this.fileToByteArray(this.selectedLogoFile);
  }
  if (this.selectedImageFile) {
    this.company.companyImage = await this.fileToByteArray(this.selectedImageFile);
  }

  this.commonservice.saveCompany(this.company).subscribe({
    next: id => {
      alert(this.company.companyID > 0 ? "Company updated!" : "Company created!");
      this.loadCompanies();
      this.resetForm();
      this.selectedLogoFile = null;
      this.selectedImageFile = null;
    },
    error: err => {
      console.error('❌ Error saving company:', err);
      alert("Error saving company!");
    }
  });
}

  editCompany(c: Company) {
    this.company = { ...c }; // populate form for editing
  }

  deleteCompany(c: Company) {
    if (!confirm(`Are you sure you want to delete ${c.companyName}?`)) {
      return;
    }

    c.isActive = false; // soft delete
    this.commonservice.saveCompany(c).subscribe({
      next: id => {
        console.log('🗑️ Company deleted (soft delete), ID:', id);
        alert("Company deleted successfully!");
        this.loadCompanies();
      },
      error: err => {
        console.error('❌ Error deleting company:', err);
        alert("Error deleting company.");
      }
    });
  }

  loadCompanies() {
    this.commonservice.getCompanies().subscribe({
      next: res => this.companies = res,
      error: err => console.error(err)
    });
  }
  resetForm() {
    this.company = {
      companyID: 0,
      companyCode: '',
      companyName: '',
      phone: '',
      alternatePhone: '',
      email: '',
      website: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      gstNumber: '',
      panNumber: '',
      cinNumber: '',
      bankName: '',
      bankAccountNumber: '',
      ifscCode: '',
      companyLogo: null,
      companyImage: null,
      isActive: true,
      createdByUserID: 0,
      createdSystemName: 'AngularApp'
    };
  }
  onFileSelected(event: any, type: 'logo' | 'image') {
    const file: File = event.target.files[0];
    if (file) {
      if (type === 'logo') this.selectedLogoFile = file;
      else this.selectedImageFile = file;
    }
  }
private fileToByteArray(file: File): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result.split(',')[1]; // remove data:image/...;base64,
      const byteArray = Array.from(atob(base64), c => c.charCodeAt(0));
      resolve(byteArray);
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}


}
