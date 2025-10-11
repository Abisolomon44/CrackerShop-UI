import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { ValidationService } from '../../../services/properties/validation.service';
import { SweetAlertService } from '../../../services/properties/sweet-alert.service';
import { FocusOnKeyDirective } from '../../../directives/focus-on-key.directive';
import { Observable } from 'rxjs';
import { Customer } from '../../models/common-models/master-models/master';

interface ApiResponse { success: boolean; message?: string; }

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  customers: Customer[] = [];
  customer: Customer = this.newCustomer();
  duplicateError = false;

  constructor(
    private readonly masterService: MasterService,
    private readonly validationService: ValidationService,
    private readonly swall: SweetAlertService
  ) {}

  ngOnInit() { this.loadCustomers(); }

  private newCustomer(): Customer {
    const now = new Date().toISOString();
    return {
      customerID: 0,
      customerCode: '',
      customerName: '',
      phone: '',
      alternatePhone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      isActive: true,
      createdByUserID: 0,
      createdSystemName: 'AngularApp',
      createdAt: now,
      updatedByUserID: 0,
      updatedSystemName: 'AngularApp',
      updatedAt: now
    };
  }

  private focusCustomer() {
    setTimeout(() => {
      const el = document.getElementById('customerCode') as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }, 0);
  }

  loadCustomers() {
    this.masterService.getCustomers().subscribe({
      next: res => this.customers = res ?? [],
      error: () => this.swall.error('Error', 'Failed to load customers!', () => this.focusCustomer())
    });
  }

  checkDuplicate() {
    this.duplicateError = this.validationService.isDuplicate(
      this.customer.customerCode, this.customers, 'customerCode', this.customer.customerID
    );
  }

  private validateCustomer(): boolean {
    this.customer.customerCode = this.customer.customerCode?.trim() || '';
    this.customer.customerName = this.customer.customerName?.trim() || '';
    this.checkDuplicate();

    if (!this.customer.customerCode) { 
      this.swall.warning('Validation', 'Customer Code is required!', () => this.focusCustomer()); 
      return false; 
    }
    if (!this.customer.customerName) { 
      this.swall.warning('Validation', 'Customer Name is required!', () => this.focusCustomer()); 
      return false; 
    }
    if (this.duplicateError) { 
      this.swall.warning('Validation', 'Customer Code already exists!', () => this.focusCustomer()); 
      return false; 
    }
    return true;
  }

  saveOrUpdateCustomer() {
    if (!this.validateCustomer()) return;
    this.masterService.saveCustomer(this.customer).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          this.loadCustomers();
          this.resetCustomer();
          this.swall.success('Success', res.message || 'Customer saved successfully!', () => this.focusCustomer());
        } else {
          this.swall.error('Error', res.message || 'Something went wrong!', () => this.focusCustomer());
        }
      },
      error: () => this.swall.error('Error', 'Failed to save customer!', () => this.focusCustomer())
    });
  }

  editCustomer(c: Customer) {
    this.customer = { ...c };
    this.focusCustomer();
  }

  deleteCustomer(c: Customer) {
    this.swall.confirm(`Delete ${c.customerName}?`, 'This will mark the customer as inactive.').then(result => {
      if (!result.isConfirmed) return;
      const deleted: Customer = { ...c, isActive: false };
      this.masterService.saveCustomer(deleted).subscribe({
        next: (res: ApiResponse) => {
          if (res.success) {
            this.loadCustomers();
            this.swall.success('Deleted!', res.message || 'Customer deleted!', () => this.focusCustomer());
          } else {
            this.swall.error('Error', res.message || 'Failed to delete customer!', () => this.focusCustomer());
          }
        },
        error: () => this.swall.error('Error', 'Failed to delete customer!', () => this.focusCustomer())
      });
    });
  }

  resetCustomer() { 
    this.customer = this.newCustomer(); 
    this.duplicateError = false; 
    this.focusCustomer();
  }
}
