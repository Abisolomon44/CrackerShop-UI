import { Component } from '@angular/core';
import { MasterService } from '../../../services/master.service';
import { Brand } from '../../models/common-models/master-models/master';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ValidationService } from '../../../services/properties/validation.service';
import { AutoFocusDirective } from '../../../directives/auto-focus.directive';
import { FocusOnKeyDirective } from '../../../directives/focus-on-key.directive';
interface ApiResponse {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [FormsModule, CommonModule, AutoFocusDirective,FocusOnKeyDirective],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent {
  brands: Brand[] = [];
  brand: Brand = this.getEmptyBrand();
  duplicateError = false;

  constructor(
    private brandService: MasterService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  private getEmptyBrand(): Brand {
    const now = new Date().toISOString();
    return {
      brandID: 0,
      brandName: '',
      description: '',
      isActive: true,
      createdByUserID: 0,
      createdSystemName: 'AngularApp',
      createdAt: now,
      updatedByUserID: 0,
      updatedSystemName: 'AngularApp',
      updatedAt: now,
    };
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (res: Brand[]) => (this.brands = res),
      error: (err) => this.showAlert('Error', 'Failed to load brands!', 'error', err),
    });
  }

  checkDuplicate(): void {
    this.duplicateError = this.validationService.isDuplicate(
      this.brand.brandName,
      this.brands,
      'brandName',
      this.brand.brandID
    );
  }

  private validateBrand(): boolean {
    this.brand.brandName = this.brand.brandName?.trim() || '';
    this.checkDuplicate();

    if (!this.brand.brandName) {
      this.showAlert('Validation', 'Brand Name is required.', 'warning');
      return false;
    }

    if (this.duplicateError) {
      this.showAlert('Validation', 'Brand already exists!', 'warning');
      return false;
    }

    return true;
  }

  saveOrUpdateBrand(): void {
    if (!this.validateBrand()) return;

    this.brandService.saveBrand(this.brand).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          this.showAlert('Success', res.message || 'Brand saved successfully!', 'success');
          this.loadBrands();
          this.resetBrand();
        } else {
          this.showAlert('Error', res.message || 'Something went wrong!', 'error');
        }
      },
      error: (err) => this.showAlert('Error', 'Failed to save brand!', 'error', err),
    });
  }

  editBrand(b: Brand): void {
    this.brand = { ...b };
  }

  deleteBrand(b: Brand): void {
    Swal.fire({
      title: `Delete ${b.brandName}?`,
      text: 'This will mark the brand as inactive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const deletedBrand = { ...b, isActive: false };
      this.brandService.saveBrand(deletedBrand).subscribe({
        next: (res: ApiResponse) => {
          if (res.success) {
            this.showAlert('Deleted!', res.message || 'Brand deleted!', 'success');
            this.loadBrands();
          } else {
            this.showAlert('Error', res.message || 'Failed to delete brand!', 'error');
          }
        },
        error: (err) => this.showAlert('Error', 'Failed to delete brand!', 'error', err),
      });
    });
  }

  resetBrand(): void {
    this.brand = this.getEmptyBrand();
    this.duplicateError = false;
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info', error?: any) {
    if (error) console.error(error);
    Swal.fire(title, text, icon);
  }
}
