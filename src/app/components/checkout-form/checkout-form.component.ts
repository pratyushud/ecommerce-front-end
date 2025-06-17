import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartItemService } from '../../services/cart-item.service';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { RefCode } from '../../common/ref-code';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../common/custom-validators';
import { CheckoutService } from '../../services/checkout.service';
import { Address } from '../../common/address';
import { Customer } from '../../common/customer';
import { OrderItem } from '../../common/order-item';
import { Order } from '../../common/order';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

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
  creditCardMonths: RefCode[] = [];
  creditCardYears: RefCode[] = [];
  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];
  billingAddressSameAsShipping: boolean = false;
  sessionStorage: Storage = sessionStorage;
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartItemService,
              private utilityService: UtilityService,
              private checkoutService: CheckoutService,
              private route: Router
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        email: new FormControl(this.sessionStorage.getItem('loggedInUserEmail') || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2,6}$')])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2,6}$')])
      })
    })

    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
    
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })

    this.utilityService.getCountryCodes().subscribe(data => {
      this.countries = data;
      this.checkoutFormGroup.get('shippingAddress')!.get('country')!.setValue(data[0].code);
      this.checkoutFormGroup.get('billingAddress')!.get('country')!.setValue(data[0].code);
      this.reloadStates('shippingAddress');
      this.reloadStates('billingAddress');
    });

    this.setupStripePaymentForm();

  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount("#card-element");

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    })
  }

  reloadStates(addressType: string): void {
    const formGroup = this.checkoutFormGroup.get(addressType);
    let countryCode =formGroup!.value.country;
    this.utilityService.getStateCodes(countryCode).subscribe(data => {
      this[addressType == 'shippingAddress'?'shippingStates':'billingStates'] = data;
      formGroup!.get('state')!.setValue(data[0].id);
    });
  }

  onShippingAddressSameAsBillingChange(event: Event): void {
    let element = event.target as HTMLInputElement;
    if (element.checked) {
      const shippingAddress = this.checkoutFormGroup.get('shippingAddress')!.value;
      this.checkoutFormGroup.get('billingAddress')!.setValue(shippingAddress);      
      this.reloadStates('billingAddress');
      this.checkoutFormGroup.get('billingAddress')!.get('state')!.setValue(shippingAddress.state);      
    } else {
      this.checkoutFormGroup.get('billingAddress')!.reset();
      this.checkoutFormGroup.get('billingAddress')!.get('country')!.setValue(this.countries[0].code);
      this.reloadStates('billingAddress');
    }
    
  }

  onSubmit(): void {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let formValues = this.checkoutFormGroup.value;
    let shippingAddress: Address = new Address(formValues.shippingAddress.street, formValues.shippingAddress.city,
      formValues.shippingAddress.state, formValues.shippingAddress.country, formValues.shippingAddress.pin);
    let billingAddress: Address = new Address(formValues.billingAddress.street, formValues.billingAddress.city,
      formValues.billingAddress.state, formValues.billingAddress.country, formValues.billingAddress.pin);
    let customer: Customer = new Customer(
      formValues.customer.firstName,
      formValues.customer.lastName,
      formValues.customer.email
    );
    let orderItems: OrderItem[] = this.cartService.cartItems.map(item => {
      return new OrderItem( item.quantity, item.unitPrice, item.id, item.imageUrl)
    });
    this.isDisabled = true;
    let order: Order = new Order(this.totalPrice, this.totalQuantity);

    // payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';

    //perform payment
    this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe((intentResp) => {
      this.stripe.confirmCardPayment(intentResp.client_secret, {
        payment_method: {
          card: this.cardElement
        }
      }, { handleActions: false })
      .then((result: any) => {
        if (result.error) {
          alert('There was an error: ' + result.error.message);
          this.isDisabled = false;
        } else {
          this.checkoutService.placeOrder(order, customer, shippingAddress, billingAddress, orderItems).subscribe({
            next: data => {
              console.log('Order placed successfully', data);
              alert('Order placed successfully with tracking number: ' + data.orderTrackingNumber);
              this.resetForm();
              this.isDisabled = false;
              this.route.navigateByUrl('/products');
            },
            error: err => {
              this.isDisabled = false;
              console.error('Error placing order', err);
              alert('There was an error placing your order. Please try again later.');
            }
          });
        }
      })
    })
  }

  resetForm(): void {
    this.checkoutFormGroup.reset();
    this.cartService.clearCart();
    this.reloadStates('shippingAddress');
    this.reloadStates('billingAddress');
    this.billingAddressSameAsShipping = false;
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName') as FormControl;
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName') as FormControl;
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email') as FormControl;
  }
  get shippingStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street') as FormControl;
  }
  get shippingCity() {
    return this.checkoutFormGroup.get('shippingAddress.city') as FormControl;
  }
  get shippingState() {
    return this.checkoutFormGroup.get('shippingAddress.state') as FormControl;
  }
  get shippingCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country') as FormControl;
  }
  get shippingPin() {
    return this.checkoutFormGroup.get('shippingAddress.pin') as FormControl;
  }
  get billingStreet() {
    return this.checkoutFormGroup.get('billingAddress.street') as FormControl;
  }
  get billingCity() {
    return this.checkoutFormGroup.get('billingAddress.city') as FormControl;
  }
  get billingState() {
    return this.checkoutFormGroup.get('billingAddress.state') as FormControl;
  }
  get billingCountry() {
    return this.checkoutFormGroup.get('billingAddress.country') as FormControl;
  }
  get billingPin() {
    return this.checkoutFormGroup.get('billingAddress.pin') as FormControl;
  }

}
