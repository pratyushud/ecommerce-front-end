# Angular Ecommerce Front-End

This project is an Angular-based front-end for an e-commerce application. It demonstrates best practices in Angular development, including reactive forms, service-based architecture, and integration with RESTful APIs.

## Features

- Product listing, search, and filtering
- Product categories
- Shopping cart management
- Checkout form with validation
- Country and state selection with dynamic loading
- Credit card form with dynamic month/year options
- Responsive UI

## Project Structure

```
src/
  app/
    components/
      checkout-form/      # Checkout form component
      search-product/     # Product search component
    services/
      product.service.ts  # Product and category data service
      cart-item.service.ts
      utility.service.ts
      checkout.service.ts
    common/
      country.ts
      state.ts
      ref-code.ts
      custom-validators.ts
      ...
  assets/
  environments/
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Angular CLI (`npm install -g @angular/cli@19.0.0`)

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd angular-ecommerce
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   ng serve
   ```
   The app will be available at `http://localhost:4200/`.

### Notes

- Make sure your backend API is running and accessible for product, category, and checkout endpoints.
- The project uses [ng-bootstrap](https://ng-bootstrap.github.io/) for UI components.

## Key Files

- `src/app/services/product.service.ts`  
  Handles product and category API calls.

- `src/app/components/checkout-form/checkout-form.component.ts`  
  Implements the checkout form with reactive validation and dynamic fields.

- `src/app/components/search-product/search-product.component.html`  
  Provides product search functionality.

## Customization

- Update API endpoints in the services as needed to match your backend.
- Modify form validation rules in `custom-validators.ts` or directly in the component.

## Troubleshooting

- **Dependency errors:** Ensure all `@angular/*` packages are the same version.
- **Form not updating:** Use `valueChanges` observables for reactive updates.
- **Checkbox default state:** Remove `checked` attribute for unchecked by default.

## License

This project is for educational purposes.