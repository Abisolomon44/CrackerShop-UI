import { Injectable } from '@angular/core';
import { environment } from '../config';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { Brand, Category, Customer, Cess,Product, Supplier, Tax, Unit, HSN, Service, SubCategory } from './../pages/models/common-models/master-models/master';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private baseUrl = `${environment.apiBaseUrl}/Master`;

  constructor(private http: HttpClient) { }

  // ================= Brand =================
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/Brands`);
  }

  saveBrand(brand: Brand): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Brand`, brand);
  }

  // ================= Category =================
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/Categories`);
  }

  saveCategory(category: Category): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Category`, category);
  }

   // GET all active Cess
  getCesses(): Observable<Cess[]> {
    return this.http.get<Cess[]>(`${this.baseUrl}/Cesses`);
  }

  // POST add/update Cess
  saveCess(cess: Cess): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Cess`, cess);
  }
  // ================= Customer =================
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/Customers`);
  }

  saveCustomer(customer: Customer): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Customer`, customer);
  }

  // ================= Product =================
  getProducts(companyId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/Products/${companyId}`);
  }

  saveProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Product`, product);
  }

  // ================= Supplier =================
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/Suppliers`);
  }

  saveSupplier(supplier: Supplier): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Supplier`, supplier);
  }

  // ================= Tax =================
  getTaxes(): Observable<Tax[]> {
    return this.http.get<Tax[]>(`${this.baseUrl}/Taxes`);
  }

  saveTax(tax: Tax): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Tax`, tax);
  }

  // ================= Unit =================
  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.baseUrl}/Units`);
  }

  saveUnit(unit: Unit): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Unit`, unit);
  }

  // ================= HSN =================
  getHSNCodes(): Observable<HSN[]> {
    return this.http.get<HSN[]>(`${this.baseUrl}/HSNCodes`);
  }

  saveHSNCode(hsn: HSN): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/HSNCode`, hsn);
  }

  // ================= Service =================A
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/Services`);
  }

  saveService(service: Service): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Service`, service);
  }

  // ================= SubCategory =================
  getSubCategories(categoryId?: number): Observable<SubCategory[]> {
    let url = `${this.baseUrl}/SubCategories`;
    if (categoryId) url += `?categoryId=${categoryId}`;
    return this.http.get<SubCategory[]>(url);
  }

  saveSubCategory(subCategory: SubCategory): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/SubCategory`, subCategory);
  }
}
