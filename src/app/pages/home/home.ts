import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="text-align: center; padding: 50px 20px;">
      <h1>Лабораторна робота №3: Angular Store</h1>
      <p>Каталог товарів на Standalone компонентах, Signals та Reactive Forms.</p>
      <a routerLink="/products" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #1976d2; color: #fff; text-decoration: none; border-radius: 6px;">
        Перейти до товарів
      </a>
    </div>
  `
})
export class HomeComponent {}