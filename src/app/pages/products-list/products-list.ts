import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService, Product } from '../../services/products';

@Component({
  selector: 'app-products-list',
  standalone: true,
  // OnPush change detection strategy for performance optimization
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">
      <h2>Каталог товарів</h2>

      <!-- Форма додавання товару (Reactive Forms) -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #ddd;">
        <h3>Додати новий товар</h3>
        <form [formGroup]="productForm" (ngSubmit)="onAddProduct()">
          <div style="margin-bottom: 10px;">
            <input formControlName="title" placeholder="Назва товару" style="width: 100%; padding: 8px; box-sizing: border-box;" />
            @if (productForm.get('title')?.touched && productForm.get('title')?.invalid) {
              <small style="color: red;">Назва обов'язкова (від 3 символів)</small>
            }
          </div>

          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <input type="number" formControlName="price" placeholder="Ціна (грн)" style="width: 100%; padding: 8px; box-sizing: border-box;" />
              @if (productForm.get('price')?.touched && productForm.get('price')?.invalid) {
                <small style="color: red;">Ціна повинна бути більше 0</small>
              }
            </div>

            <div style="flex: 1;">
              <select formControlName="category" style="width: 100%; padding: 8px; box-sizing: border-box;">
                <option value="">Оберіть категорію</option>
                @for (cat of categories; track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
              @if (productForm.get('category')?.touched && productForm.get('category')?.invalid) {
                <small style="color: red;">Оберіть категорію</small>
              }
            </div>

            <div style="flex: 1;">
              <input type="number" formControlName="stock" placeholder="Кількість на складі" style="width: 100%; padding: 8px; box-sizing: border-box;" />
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <input formControlName="imageUrl" placeholder="Посилання на картинку (URL)" style="width: 100%; padding: 8px; box-sizing: border-box;" />
          </div>

          <!-- Поле для опису товару -->
          <div style="margin-bottom: 10px;">
            <textarea 
              formControlName="description" 
              placeholder="Короткий опис товару..." 
              rows="3" 
              style="width: 100%; padding: 8px; box-sizing: border-box; resize: vertical; font-family: inherit;">
            </textarea>
          </div>

          <button type="submit" [disabled]="productForm.invalid" style="padding: 9px 18px; background: #2e7d32; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Створити товар
          </button>
        </form>
      </div>

      <!-- Фільтр за категорією -->
      <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
        <label><strong>Фільтр за категорією:</strong></label>
        <select (change)="onCategoryChange($event)" style="padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc;">
          <option value="">Всі категорії</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </div>

      <!-- Статус завантаження -->
      @if (loading()) {
        <p>Завантаження каталогу товарів...</p>
      }

      <!-- Сітка карток -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
        @for (p of filteredProducts(); track p.id) {
          <div style="border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.06); background: #fff;">
            @if (p.imageUrl) {
              <img [src]="p.imageUrl" [alt]="p.title" style="width: 100%; height: 180px; object-fit: cover;" />
            }
            <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
              <h4 style="margin: 0 0 10px 0; font-size: 1.1rem;">{{ p.title }}</h4>
              <p style="font-size: 1.25rem; font-weight: bold; color: #1976d2; margin: 0 0 8px 0;">{{ p.price }} грн</p>
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 15px;">
                <span style="background: #eef2f6; color: #333; font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500;">{{ p.category }}</span>
                @if (p.stock) {
                  <small style="color: #666;">В наявності: {{ p.stock }} шт.</small>
                }
              </div>
              <div style="margin-top: auto; display: flex; gap: 10px;">
                <a [routerLink]="['/products', p.id]" style="flex: 1; text-align: center; background: #1976d2; color: #fff; text-decoration: none; padding: 8px 0; border-radius: 4px; font-size: 14px;">Деталі</a>
                <button (click)="onDelete(p.id)" style="background: #d32f2f; color: #fff; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;">Видалити</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  // Inject the ProductsService and FormBuilder for use in the component
  private service = inject(ProductsService);
  private fb = inject(FormBuilder);
  // Define signals for products, selected category && loading state
  products = signal<Product[]>([]);
  selectedCategory = signal<string>('');
  loading = signal<boolean>(false);

  categories = ['Peripherals', 'Displays', 'Audio'];
  // Define a computed signal to filter products based on the selected category
  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    return cat ? this.products().filter(p => p.category === cat) : this.products();
  });
  // Define a reactive form for adding new products with validation rules
  productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    stock: [5],
    imageUrl: [''],
    description: ['']
  });

  ngOnInit() {
    this.loading.set(true);
    // Fetch the list of products from the service && update the products signal
    this.service.list().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  // Event handler for category selection change
  onCategoryChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(val);
  }
  // Event handler for adding a new product
  onAddProduct() {
    if (this.productForm.invalid) return;

    const val = this.productForm.value;
    const newProd: Product = {
      title: val.title!,
      price: Number(val.price),
      category: val.category!,
      stock: Number(val.stock) || 1,
      imageUrl: val.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
      description: val.description || ''
    };

    this.service.create(newProd).subscribe((saved) => {
      this.products.update(list => [...list, saved]);
      this.productForm.reset({ price: 0, title: '', category: '', stock: 5, imageUrl: '', description: '' });
    });
  }
  // Event handler for deleting a product by its ID
  onDelete(id?: string | number) {
    if (!id) return;
    this.service.delete(id).subscribe(() => {
      this.products.update(list => list.filter(p => p.id !== id));
    });
  }
}