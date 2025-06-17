import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { CartItemService } from '../../services/cart-item.service';

@Component({
  selector: 'app-login-status',
  imports: [RouterLink, CommonModule],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  userName: string = '';
  storage: Storage = sessionStorage

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private oktaAuthStateService: OktaAuthStateService,
    private cartItemService: CartItemService
  ) { }

  ngOnInit() {
    this.oktaAuthStateService.authState$.subscribe(
      (authState) => {
        this.isAuthenticated = authState.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (user) => {
          this.userName = user.name || '';
          this.storage.setItem('loggedInUserEmail', user.email || '');
        }
      ).catch(
        (err) => {
          throw err;
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
    this.cartItemService.clearCart();
  }
}

