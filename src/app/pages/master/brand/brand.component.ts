import { Component, ViewChild } from '@angular/core';
import { MasterService } from '../../../services/master.service';
import { Brand } from '../../models/common-models/master-models/master';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../../services/properties/validation.service';
import { FocusOnKeyDirective } from '../../../directives/focus-on-key.directive';
import { SweetAlertService } from '../../../services/properties/sweet-alert.service';

interface ApiResponse {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [FormsModule, CommonModule, FocusOnKeyDirective],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent {
  brands: Brand[] = [];
  brand: Brand = this.getEmptyBrand();
  duplicateError = false;

  @ViewChild(FocusOnKeyDirective) brandInput!: FocusOnKeyDirective;

  constructor(
    private brandService: MasterService,
    private validationService: ValidationService,
    private swall: SweetAlertService
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
      error: () => this.swall.error('Error', 'Failed to load brands!', () => this.focusBrand()),
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
      this.swall.warning('Validation', 'Brand Name is required!', () => this.focusBrand());
      return false;
    }

    if (this.duplicateError) {
      this.swall.warning('Validation', 'Brand already exists!', () => this.focusBrand());
      return false;
    }

    return true;
  }

  saveOrUpdateBrand(): void {
    if (!this.validateBrand()) return;

    this.brandService.saveBrand(this.brand).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          this.loadBrands();
          this.resetBrand();
          this.swall.success('Success', res.message || 'Brand saved successfully!', () =>
            this.focusBrand()
          );
        } else {
          this.swall.error('Error', res.message || 'Something went wrong!', () =>
            this.focusBrand()
          );
        }
      },
      error: () => this.swall.error('Error', 'Failed to save brand!', () => this.focusBrand()),
    });
  }

  editBrand(b: Brand): void {
    this.brand = { ...b };
    setTimeout(() => this.focusBrand(), 0);
  }

  deleteBrand(b: Brand): void {
    this.swall
      .confirm(`Delete ${b.brandName}?`, 'This will mark the brand as inactive.')
      .then((result) => {
        if (!result.isConfirmed) return;

        const deletedBrand = { ...b, isActive: false };
        this.brandService.saveBrand(deletedBrand).subscribe({
          next: (res: ApiResponse) => {
            if (res.success) {
              this.loadBrands();
              this.swall.success('Deleted!', res.message || 'Brand deleted!', () =>
                this.focusBrand()
              );
            } else {
              this.swall.error('Error', res.message || 'Failed to delete brand!', () =>
                this.focusBrand()
              );
            }
          },
          error: () =>
            this.swall.error('Error', 'Failed to delete brand!', () => this.focusBrand()),
        });
      });
  }

  resetBrand(): void {
    this.brand = this.getEmptyBrand();
    this.duplicateError = false;
    setTimeout(() => this.focusBrand(), 0);
  }

  private focusBrand(): void {
    const el = document.getElementById('brandName') as HTMLInputElement;
    el?.focus();
    el?.select();
  }
}
