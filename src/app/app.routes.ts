import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProductsListComponent } from './pages/products-list/products-list';
import { ProductDetailsComponent } from './pages/product-details/product-details';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: '**', redirectTo: '' }
];