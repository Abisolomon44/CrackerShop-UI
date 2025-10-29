import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  GridReadyEvent,
  GridApi
} from 'ag-grid-community';

// ✅ Register modules
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-sales-entry',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './sales-entry.component.html',
  styleUrls: ['./sales-entry.component.css']
})
export class SalesEntryComponent {
  private gridApi!: GridApi;

  // 🧱 Default column settings
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  };

  // 🧾 Column definitions
  columnDefs: ColDef[] = [
    {
      headerName: 'Select',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 80,
      pinned: 'left'
    },
    { headerName: 'Product ID', field: 'productId', editable: false, width: 120 },
    { headerName: 'Product Name', field: 'productName', width: 180 },
    { headerName: 'Category', field: 'category', width: 150 },
    { headerName: 'Quantity', field: 'quantity', type: 'numericColumn', width: 120 },
    { headerName: 'Price', field: 'price', type: 'numericColumn', width: 120 },
    {
      headerName: 'Total',
      field: 'total',
      valueGetter: params => (params.data?.quantity || 0) * (params.data?.price || 0),
      width: 140,
      editable: false,
      cellStyle: { backgroundColor: '#f8f9fa', fontWeight: '600' }
    },
    { headerName: 'Date', field: 'date', editable: false, width: 160 },
  ];

  // 📊 Sample data
  rowData = Array.from({ length: 10 }).map((_, i) => ({
    productId: i + 1,
    productName: `Product ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Toys', 'Food'][i % 4],
    quantity: Math.floor(Math.random() * 10) + 1,
    price: Math.floor(Math.random() * 100) + 10,
    date: new Date(2025, 9, i + 1).toLocaleDateString(),
  }));

  pagination = true;
  paginationPageSize = 5;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  addRow() {
    const newRow = {
      productId: this.rowData.length + 1,
      productName: 'New Product',
      category: 'General',
      quantity: 1,
      price: 0,
      date: new Date().toLocaleDateString(),
    };
    this.gridApi.applyTransaction({ add: [newRow] });
  }

  deleteSelected() {
    const selected = this.gridApi.getSelectedRows();
    this.gridApi.applyTransaction({ remove: selected });
  }
}
