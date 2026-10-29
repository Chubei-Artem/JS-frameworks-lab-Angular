import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// data interface for a product 
export interface Product {
  id?: string | number;
  title: string;
  category: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient); // Inject HttpClient for making HTTP requests
  private apiUrl = 'http://localhost:3000/products'; // URL of the JSON server
  // Method to get the list of products
  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  // Method to get a single product by its ID
  get(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  // Method to create a new product
  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
  // Method to update an existing product by its ID
  update(id: string | number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  // Method to delete a product by its ID
  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}