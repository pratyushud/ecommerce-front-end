import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartItemService } from '../../services/cart-item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CheckoutFormComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartItemService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city: [''],
        state: [''],
        pin: ['']
      }),
      cardDetails: this.formBuilder.group({
        cardType:[''],
        name: [''],
        cardNumber: [''],
        cvv: [''],
        expiryMonths: [''],
        expiryYears: ['']
      })
    })

    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
    
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })
  }

  onSubmit(): void {
    console.log(`on submit called`);
    console.log(this.checkoutFormGroup.get('customer')!.value.email);
  }

}
