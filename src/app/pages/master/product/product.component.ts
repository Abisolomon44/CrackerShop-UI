import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MasterService } from '../../../services/master.service';
import { ValidationService } from '../../../services/properties/validation.service';
import { SweetAlertService } from '../../../services/properties/sweet-alert.service';
import { CommonserviceService } from '../../../services/commonservice.service';

import { InputDataGridComponent } from '../../components/input-data-grid/input-data-grid.component';
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
  standalone: true,
  imports: [FormsModule, CommonModule, InputDataGridComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  products: Product[] = [];
  newProducts: Product[] = [];
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

  // Columns for InputDataGridComponent
  columns = [
    { field: 'productName', header: 'Product Name', type: 'text' },
    { field: 'productCode', header: 'Product Code', type: 'text' },
    { field: 'categoryID', header: 'Category', type: 'select' },
    { field: 'subCategoryID', header: 'Sub Category', type: 'select' },
    { field: 'brandID', header: 'Brand', type: 'select' },
    { field: 'unitID', header: 'Unit', type: 'select' },
    { field: 'hsnid', header: 'HSN Code', type: 'select' },
    { field: 'taxID', header: 'Tax', type: 'select' },
    { field: 'cessID', header: 'Cess', type: 'select' },
    { field: 'purchaseRate', header: 'Purchase Rate', type: 'number' },
    { field: 'retailPrice', header: 'Retail Price', type: 'number' },
    { field: 'wholesalePrice', header: 'Wholesale Price', type: 'number' },
    { field: 'saleRate', header: 'Sale Rate', type: 'number' },
    { field: 'mrp', header: 'MRP', type: 'number' },
    { field: 'discountAmount', header: 'Discount Amount', type: 'number' },
    { field: 'discountPercentage', header: 'Discount %', type: 'number' },
    { field: 'openingStock', header: 'Opening Stock', type: 'number' },
    { field: 'reorderLevel', header: 'Reorder Level', type: 'number' },
    { field: 'currentStock', header: 'Current Stock', type: 'number' },
    { field: 'barcode', header: 'Barcode', type: 'text' },
    { field: 'isService', header: 'Is Service', type: 'checkbox' },
  ];

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


  onCellValueChanged(event: any) {
    const { row, col, value } = event;
    const field = this.columns[col].field;
  }

  onRowAdded(event: any) {
    const product = this.newProduct();
    this.products.push(product);
  }

  addRowManually() {
    this.onRowAdded(null);
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
      isActive: true,
      createdByUserID: this.commonService.getCurrentUserId(),
      createdSystemName: 'AngularApp',
      createdAt: now,
      updatedByUserID: this.commonService.getCurrentUserId(),
      updatedSystemName: 'AngularApp',
      updatedAt: now,
      color: '',
      size: '',
      weight: 0,
      volume: 0,
      material: '',
      finishType: '',
      shadeCode: '',
      capacity: '',
      modelNumber: '',
      expiryDate: '',
      secondaryUnitID: 0,
      taxType: '',
      isGSTInclusive: false,
      taxableValue: 0,
      cGSTRate: 0,
      cGSTAmount: 0,
      sGSTRate: 0,
      sGSTAmount: 0,
      iGSTRate: 0,
      iGSTAmount: 0,
      cESSRate: 0,
      cESSAmount: 0,
    };
  }

  private focusProduct(targetId: string = 'productName') {
    setTimeout(() => {
      const el = document.getElementById(targetId) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }, 0);
  }

  resetProduct() {
    this.product = this.newProduct();
    this.duplicateError = false;
    this.focusProduct();
  }

  // -----------------------------
  // Load Data
  // -----------------------------
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
    this.commonService.getCompanies().subscribe((res) => (this.companies = res ?? []));
    this.masterService.getCategories().subscribe((res) => (this.categories = res ?? []));
    this.masterService.getSubCategories().subscribe((res) => (this.subCategories = res ?? []));
    this.masterService.getBrands().subscribe((res) => (this.brands = res ?? []));
    this.masterService.getUnits().subscribe((res) => (this.units = res ?? []));
    this.masterService.getHSNCodes().subscribe((res) => (this.hsnCodes = res ?? []));
    this.masterService.getTaxes().subscribe((res) => (this.taxes = res ?? []));
    this.masterService.getCesses().subscribe((res) => (this.cesses = res ?? []));
  }

  // -----------------------------
  // Save / Update
  // -----------------------------
  saveOrUpdateProduct(p: Product) {
    const name = p.productName?.trim().toLowerCase() || '';
    const duplicateError = this.products.some(
      (prod) => prod.productID !== p.productID && prod.productName?.trim().toLowerCase() === name
    );
    if (!p.productName?.trim()) {
      this.swall.warning('Validation', 'Product Name is required!');
      return;
    }
    if (duplicateError) {
      this.swall.warning('Validation', 'Product Name already exists!');
      return;
    }
    if (!p.categoryID) {
      this.swall.warning('Validation', 'Select a Category!');
      return;
    }

    const now = new Date().toISOString();
    if (p.productID && p.productID > 0) {
      p.updatedByUserID = this.commonService.getCurrentUserId();
      p.updatedSystemName = 'AngularApp';
      p.updatedAt = now;
    } else {
      p.createdByUserID = this.commonService.getCurrentUserId();
      p.createdSystemName = 'AngularApp';
      p.createdAt = now;
      p.updatedByUserID = this.commonService.getCurrentUserId();
      p.updatedSystemName = 'AngularApp';
      p.updatedAt = now;
    }

    this.masterService.saveProduct(p).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          this.loadProducts();
          this.swall.success('Success', res.message || 'Product saved!');
        } else {
          this.swall.error('Error', res.message || 'Failed to save product!');
        }
      },
      error: () => this.swall.error('Error', 'Failed to save product!'),
    });
  }

  editProduct(p: Product) {
    this.product = { ...p };
    this.focusProduct();
  }

  deleteProduct(p: Product) {
    this.swall
      .confirm(`Delete ${p.productName}?`, 'This will mark the product as inactive.')
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
              this.swall.success('Deleted!', res.message || 'Product deleted!', () =>
                this.focusProduct()
              );
            } else {
              this.swall.error('Error', res.message || 'Failed to delete!', () =>
                this.focusProduct()
              );
            }
          },
          error: () => this.swall.error('Error', 'Failed to delete product!', () =>
            this.focusProduct()
          ),
        });
      });
  }

  // -----------------------------
  // Dropdown Helpers
  // -----------------------------
  getCategoryName(categoryID: number) {
    return this.categories?.find((c) => c.categoryID === categoryID)?.categoryName || '';
  }
  getSubCategoryName(subCategoryID: number) {
    return this.subCategories?.find((sc) => sc.subCategoryID === subCategoryID)?.subCategoryName || '';
  }
  getBrandName(brandID: number) {
    return this.brands?.find((b) => b.brandID === brandID)?.brandName || '';
  }
  getHSNCode(hsnID: number) {
    return this.hsnCodes?.find((h) => h.hsnid === hsnID)?.hsnCode || '';
  }
  getTaxName(taxID: number) {
    return this.taxes?.find((t) => t.taxID === taxID)?.taxName || '';
  }
  getCessName(cessID: number) {
    return this.cesses?.find((c) => c.cessID === cessID)?.cessName || '';
  }
  getCompanyName(companyID: number) {
    return this.companies?.find((c) => c.companyID === companyID)?.companyName || '';
  }
}
