import { Routes } from '@angular/router';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';

export const routes: Routes = [
    {path: 'checkout', component: CheckoutFormComponent},
    {path: 'category/:id/:categoryName', component: ProductListComponent},
    {path: 'search/:productName', component: ProductListComponent},
    {path: 'products/:productId', component: ProductDetailComponent},
    {path: 'cartDetails', component: CartDetailsComponent},
    {path: 'products', component: ProductListComponent},
    {path: 'category', component: ProductListComponent},
    {path: '', redirectTo: '/products', pathMatch: 'full'},
    {path: '**', redirectTo: '/products', pathMatch: 'full'},
];
