import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild(InputDataGridComponent) grid!: InputDataGridComponent;

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

  // -----------------------------
  // Grid Column Definitions
  // -----------------------------
  columns = [
    { field: 'sno', header: 'S.NO', type: 'text', width: '60px' },
    { field: 'barcode', header: 'BARCODE', type: 'text' },
    { field: 'productCode', header: 'PRODUCT CODE', type: 'text' },
    { field: 'productName', header: 'PRODUCT NAME', type: 'text' },
    { field: 'categoryID', header: 'CATEGORY', type: 'select' },
    { field: 'subCategoryID', header: 'SUB CATEGORY', type: 'select' },
    { field: 'brandID', header: 'BRAND', type: 'select' },
    { field: 'unitID', header: 'UNIT', type: 'select' },
    { field: 'hsnid', header: 'HSN CODE', type: 'select' },
    { field: 'taxID', header: 'TAX', type: 'select' },
    { field: 'cessID', header: 'CESS', type: 'select' },
    { field: 'purchaseRate', header: 'PURCHASE RATE', type: 'number' },
    { field: 'mrp', header: 'MRP', type: 'number' },
    { field: 'retailPrice', header: 'RETAIL PRICE', type: 'number' },
    { field: 'wholesalePrice', header: 'WHOLESALE PRICE', type: 'number' },
    { field: 'saleRate', header: 'SALE RATE', type: 'number' },
    { field: 'discountPercentage', header: 'DISCOUNT %', type: 'number' },
    { field: 'discountAmount', header: 'DISCOUNT AMOUNT', type: 'number' },
    { field: 'openingStock', header: 'OPENING STOCK', type: 'number' },
    { field: 'reorderLevel', header: 'REORDER LEVEL', type: 'number' },
    { field: 'currentStock', header: 'CURRENT STOCK', type: 'number' },
  ];

  constructor(
    private readonly masterService: MasterService,
    private readonly validationService: ValidationService,
    private readonly commonService: CommonserviceService,
    private readonly swall: SweetAlertService
  ) {}

  // -----------------------------
  // Lifecycle
  // -----------------------------
  ngOnInit(): void {
    this.resetProduct();
    this.loadDropdowns();
    this.loadProducts();
  }


  ngAfterViewInit(): void {
  // 🔹 Try repeatedly until grid is ready and DOM is rendered
  const focusInterval = setInterval(() => {
    if (this.grid && this.products.length > 0) {
      this.focusGridCell();
      clearInterval(focusInterval);
    }
  }, 150);
}

private focusGridCell(): void {
  setTimeout(() => {
    try {
      // 👇 If no products, create one first
      if (this.products.length === 0) {
        this.products.push(this.newProduct());
      }

      // 👇 Wait a bit to ensure DOM ready
      requestAnimationFrame(() => {
        if (this.grid && typeof this.grid.focusCell === 'function') {
          this.grid.focusCell(0, 3); // ✅ Focus first row, 4th column
        }

        // 👇 Fallback: focus input inside manually
        const firstCell = document.querySelector(
          'table tbody tr:first-child td:nth-child(4)'
        ) as HTMLElement | null;
        if (firstCell) firstCell.focus();
      });
    } catch (err) {
      console.warn('Focus failed:', err);
    }
  }, 300);
}

private tryFocusGrid(): void {
  setTimeout(() => {
    if (this.grid) {
      if (this.products.length === 0) {
        // 👇 No products? Create one automatically
        this.products.push(this.newProduct());
      }
      // 👇 Focus first row, column index 3 (4th column)
      this.grid.focusCell(0, 3);
    }
  }, 400);
}

  // -----------------------------
  // Grid Events
  // -----------------------------
  onCellValueChanged(event: any): void {
    const { row, col, value } = event;
    const field = this.columns[col].field;
    this.products[row][field] = value;
  }

  onRowAdded(event: any): void {
    const newRow = this.newProduct();
    this.products.push(newRow);
    this.tryFocusGrid();
  }

  addRowManually(): void {
    this.onRowAdded(null);
  }

  // -----------------------------
  // Product Model
  // -----------------------------
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

  resetProduct(): void {
    this.product = this.newProduct();
    this.duplicateError = false;
    this.focusProduct();
  }

  private focusProduct(targetId: string = 'productName'): void {
    setTimeout(() => {
      const el = document.getElementById(targetId) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }, 0);
  }

  // -----------------------------
  // Load Data
  // -----------------------------
  loadProducts(): void {
    this.masterService.getallProducts().subscribe({
      next: (res) => {
        this.products = res ?? [];

        // 🔹 If no products found, create one empty row
        if (this.products.length === 0) {
          const blank = this.newProduct();
          this.products.push(blank);
        }

        // 🔹 Always focus first cell
        this.tryFocusGrid();
      },
      error: () =>
        this.swall.error('Error', 'Failed to load products!', () =>
          this.focusProduct()
        ),
    });
  }

  loadDropdowns(): void {
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
  // Save / Update / Delete
  // -----------------------------
  saveOrUpdateProduct(p: Product): void {
    const name = p.productName?.trim().toLowerCase() || '';
    const duplicate = this.products.some(
      (prod) => prod.productID !== p.productID && prod.productName?.trim().toLowerCase() === name
    );

    if (!p.productName?.trim()) {
      this.swall.warning('Validation', 'Product Name is required!');
      return;
    }
    if (duplicate) {
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

  deleteProduct(p: Product): void {
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
          error: () =>
            this.swall.error('Error', 'Failed to delete product!', () =>
              this.focusProduct()
            ),
        });
      });
  }

  // -----------------------------
  // Lookup Helpers
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

  // -----------------------------
  // Toolbar Actions
  // -----------------------------
  addNewProduct(): void {
    this.onRowAdded(null);
  }

  editProduct(): void {
    console.log('Edit Product');
  }

  reloadProducts(): void {
    this.loadProducts();
  }

  exportToExcel(): void {
    console.log('Export to Excel');
  }
}
