import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartItemService } from '../../services/cart-item.service';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { RefCode } from '../../common/ref-code';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../common/custom-validators';

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

  constructor(private formBuilder: FormBuilder,
              private cartService: CartItemService,
              private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')])
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
      }),
      cardDetails: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expiryMonth: new FormControl('', [Validators.required]),
        expiryYear: new FormControl(new Date().getFullYear(), [Validators.required])
      })
    })

    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;
    })
    
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })

    this.utilityService.getYears().subscribe(data => {
      this.creditCardYears = data;
    });

    this.reloadMonths();

    this.utilityService.getCountryCodes().subscribe(data => {
      this.countries = data;
      this.checkoutFormGroup.get('shippingAddress')!.get('country')!.setValue(data[0].code);
      this.checkoutFormGroup.get('billingAddress')!.get('country')!.setValue(data[0].code);
      this.reloadStates('shippingAddress');
      this.reloadStates('billingAddress');
    });

  }

  reloadMonths(): void {
    let selectedYear = this.checkoutFormGroup.get('cardDetails')!.value.expiryYear;
    this.utilityService.getMonths().subscribe(data => {
      if (selectedYear == new Date().getFullYear()) {
        data = data.filter(month => month.code >= new Date().getMonth() + 1);
      }
      this.creditCardMonths = data;
      this.checkoutFormGroup.get('cardDetails')!.get('expiryMonth')!.setValue(data[0].code);
    });
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
  get cardType() {  
    return this.checkoutFormGroup.get('cardDetails.cardType') as FormControl;
  }
  get cardName() {
    return this.checkoutFormGroup.get('cardDetails.name') as FormControl;
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('cardDetails.cardNumber') as FormControl;
  }
  get cvv() {
    return this.checkoutFormGroup.get('cardDetails.cvv') as FormControl;
  }
  get expiryMonth() {
    return this.checkoutFormGroup.get('cardDetails.expiryMonth') as FormControl;
  }
  get expiryYear() {
    return this.checkoutFormGroup.get('cardDetails.expiryYear') as FormControl;
  }

}
