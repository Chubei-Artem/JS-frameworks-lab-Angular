import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../services/products';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="max-width: 650px; margin: 30px auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background: #fff;">
      <a routerLink="/products" style="color: #1976d2; text-decoration: none; font-weight: 500;">&larr; Назад до каталогу</a>

      @if (loading()) {
        <p style="margin-top: 20px;">Завантаження інформації про товар...</p>
      }

      @if (error()) {
        <p style="color: red; margin-top: 20px;">{{ error() }}</p>
      }

      @if (product(); as p) {
        <div style="margin-top: 20px;">
          @if (p.imageUrl) {
            <img [src]="p.imageUrl" [alt]="p.title" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />
          }
          <h2 style="margin: 0 0 10px 0;">{{ p.title }}</h2>
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
            <span style="background: #eef2f6; padding: 4px 10px; border-radius: 4px; font-weight: 500; font-size: 13px;">{{ p.category }}</span>
            @if (p.stock) {
              <span style="color: #2e7d32; font-size: 14px; font-weight: bold;">В наявності: {{ p.stock }} шт.</span>
            }
          </div>
          <p style="font-size: 1.6rem; font-weight: bold; color: #1976d2; margin: 15px 0;">{{ p.price }} грн</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="line-height: 1.6; color: #444;">{{ p.description || 'Опис товару відсутній.' }}</p>
        </div>
      }
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  @Input() id!: string;

  private service = inject(ProductsService);
  // Define signals for product data, loading state && error message
  product = signal<Product | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit() {
    if (this.id) {
      this.loading.set(true);
      this.service.get(this.id).subscribe({
        next: (data) => {
          this.product.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Не вдалося завантажити товар');
          this.loading.set(false);
        }
      });
    }
  }
}