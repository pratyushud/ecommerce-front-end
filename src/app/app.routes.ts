import { Router, Routes } from '@angular/router';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { LoginComponent } from './components/login/login.component';
import { MembersComponent } from './components/members/members.component';
import { OktaAuth } from '@okta/okta-auth-js';
import { Injector } from '@angular/core';


export const routes: Routes = [
    {path: 'members', component: MembersComponent, canActivate: [OktaAuthGuard], data: { onAuthRequired: sendToLoginPage }},
    {path: 'login/callback', component: OktaCallbackComponent},
    {path: 'login', component: LoginComponent},
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

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
    const router = injector.get(Router);
    router.navigate(['/login']);
}