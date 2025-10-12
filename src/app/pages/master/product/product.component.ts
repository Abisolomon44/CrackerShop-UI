import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { ValidationService } from '../../../services/properties/validation.service';
import { SweetAlertService } from '../../../services/properties/sweet-alert.service';
import { FocusOnKeyDirective } from '../../../directives/focus-on-key.directive';
import { InputRestrictDirective } from '../../../directives/input-restrict.directive';
import { CommonserviceService } from '../../../services/commonservice.service';
import {
  Product,
  Category,
  SubCategory,
  Brand,
  Unit,
  HSN,
  Tax,
  Cess,
} from '../../models/common-models/master-models/master';
import { Company } from '../../models/common-models/companyMaster';
interface ApiResponse {
  success: boolean;
  message?: string;
}
@Component({
  selector: 'app-product',
  imports: [
    FormsModule,
    CommonModule,
    InputRestrictDirective,
    FocusOnKeyDirective,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  products: Product[] = [];
  product!: Product;
  duplicateError = false;
  companies: Company[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  brands: Brand[] = [];
  units: Unit[] = [];
  hsnCodes: HSN[] = [];
  taxes: Tax[] = [];
  cesses: Cess[] = [];

  constructor(
    private readonly masterService: MasterService,

    private readonly validationService: ValidationService,
    private readonly commonService: CommonserviceService,
    private readonly swall: SweetAlertService
  ) {}

  ngOnInit() {
    this.resetProduct();
    this.loadProducts();
    this.loadDropdowns();
  }

  private newProduct(): Product {
    const now = new Date().toISOString();
    return {
      productID: 0,
      productName: '',
      productCode: '',
      categoryID: 0,
      subCategoryID: 0,
      brandID: 0,
      unitID: 0,
      hsnid: 0,
      taxID: 0,
      cessID: 0,
      purchaseRate: 0,
      retailPrice: 0,
      wholesalePrice: 0,
      saleRate: 0,
      mrp: 0,
      isActive: true,
      createdByUserID: this.commonService.getCurrentUserId(),
      createdSystemName: 'AngularApp',
      createdAt: now,
      updatedByUserID: this.commonService.getCurrentUserId(),
      updatedSystemName: 'AngularApp',
      updatedAt: now,
      discountAmount: 0,
      discountPercentage: 0,
      openingStock: 0,
      reorderLevel: 0,
      currentStock: 0,
      barcode: '',
      isService: false,
      productDescription: '',
      productImage: '',
      companyID: 0,
    };
  }

  private focusProduct(targetId: string = 'productName') {
    setTimeout(() => {
      const el = document.getElementById(targetId) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }, 0);
  }

  loadProducts() {
    this.masterService.getallProducts().subscribe({
      next: (res) => (this.products = res ?? []),
      error: () =>
        this.swall.error('Error', 'Failed to load products!', () =>
          this.focusProduct()
        ),
    });
  }

  loadDropdowns() {
    this.commonService
      .getCompanies()
      .subscribe((res) => (this.companies = res ?? []));
    this.masterService
      .getCategories()
      .subscribe((res) => (this.categories = res ?? []));
    this.masterService
      .getSubCategories()
      .subscribe((res) => (this.subCategories = res ?? []));
    this.masterService
      .getBrands()
      .subscribe((res) => (this.brands = res ?? []));
    this.masterService.getUnits().subscribe((res) => (this.units = res ?? []));
    this.masterService
      .getHSNCodes()
      .subscribe((res) => (this.hsnCodes = res ?? []));
    this.masterService.getTaxes().subscribe((res) => (this.taxes = res ?? []));
    this.masterService
      .getCesses()
      .subscribe((res) => (this.cesses = res ?? []));
  }

  /** Duplicate check */
  checkDuplicate() {
    const name = this.product.productName?.trim().toLowerCase() || '';
    this.duplicateError = this.products.some(
      (p) =>
        p.productID !== this.product.productID &&
        p.productName?.trim().toLowerCase() === name
    );
  }

  private validateProduct(): boolean {
    this.product.productName = this.product.productName?.trim() || '';
    this.checkDuplicate();

    if (!this.product.productName) {
      this.swall.warning('Validation', 'Product Name is required!', () =>
        this.focusProduct()
      );
      return false;
    }

    if (this.duplicateError) {
      this.swall.warning('Validation', 'Product Name already exists!', () =>
        this.focusProduct()
      );
      return false;
    }

    if (!this.product.categoryID) {
      this.swall.warning('Validation', 'Select a Category!', () =>
        this.focusProduct()
      );
      return false;
    }

    return true;
  }

  saveOrUpdateProduct() {
    if (!this.validateProduct()) return;

    const now = new Date().toISOString();
    if (this.product.productID && this.product.productID > 0) {
      this.product.updatedByUserID = this.commonService.getCurrentUserId();
      this.product.updatedSystemName = 'AngularApp';
      this.product.updatedAt = now;
    } else {
      this.product.createdByUserID = this.commonService.getCurrentUserId();
      this.product.createdSystemName = 'AngularApp';
      this.product.createdAt = now;
      this.product.updatedByUserID = this.commonService.getCurrentUserId();
      this.product.updatedSystemName = 'AngularApp';
      this.product.updatedAt = now;
    }

    this.masterService.saveProduct(this.product).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          this.loadProducts();
          this.resetProduct();
          this.swall.success('Success', res.message || 'Product saved!', () =>
            this.focusProduct()
          );
        } else {
          this.swall.error(
            'Error',
            res.message || 'Something went wrong!',
            () => this.focusProduct()
          );
        }
      },
      error: () =>
        this.swall.error('Error', 'Failed to save product!', () =>
          this.focusProduct()
        ),
    });
  }

  editProduct(p: Product) {
    this.product = { ...p };
    this.focusProduct();
  }

  deleteProduct(p: Product) {
    this.swall
      .confirm(
        `Delete ${p.productName}?`,
        'This will mark the product as inactive.'
      )
      .then((result) => {
        if (!result.isConfirmed) return;

        const deleted: Product = {
          ...p,
          isActive: false,
          updatedByUserID: this.commonService.getCurrentUserId(),
          updatedSystemName: 'AngularApp',
          updatedAt: new Date().toISOString(),
        };

        this.masterService.saveProduct(deleted).subscribe({
          next: (res: ApiResponse) => {
            if (res.success) {
              this.loadProducts();
              this.swall.success(
                'Deleted!',
                res.message || 'Product deleted!',
                () => this.focusProduct()
              );
            } else {
              this.swall.error(
                'Error',
                res.message || 'Failed to delete!',
                () => this.focusProduct()
              );
            }
          },
          error: () =>
            this.swall.error('Error', 'Failed to delete product!', () =>
              this.focusProduct()
            ),
        });
      });
  }

  resetProduct() {
    this.product = this.newProduct();
    this.duplicateError = false;
    this.focusProduct();
  }

 getCategoryName(categoryID: number): string {
  return this.categories?.find(c => c.categoryID === categoryID)?.categoryName || '';
}

getSubCategoryName(subCategoryID: number): string {
  return this.subCategories?.find(sc => sc.subCategoryID === subCategoryID)?.subCategoryName || '';
}

getBrandName(brandID: number): string {
  return this.brands?.find(b => b.brandID === brandID)?.brandName || '';
}

getHSNCode(hsnID: number): string {
  return this.hsnCodes?.find(h => h.hsnid === hsnID)?.hsnCode || '';
}

getTaxName(taxID: number): string {
  return this.taxes?.find(t => t.taxID === taxID)?.taxName || '';
}

getCessName(cessID: number): string {
  return this.cesses?.find(c => c.cessID === cessID)?.cessName || '';
}
getCompanyName(companyID: number): string {
  if (!this.companies) return '';
  const company = this.companies.find(c => c.companyID === companyID);
  return company ? company.companyName : '';
}

}
