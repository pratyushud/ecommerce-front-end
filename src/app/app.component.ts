import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { CartItemStatusComponent } from './components/cart-item-status/cart-item-status.component';
import { LoginStatusComponent } from "./components/login-status/login-status.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCategoryMenu, SearchProductComponent, CartItemStatusComponent, LoginStatusComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected title = 'angular-ecommerce2';
}
