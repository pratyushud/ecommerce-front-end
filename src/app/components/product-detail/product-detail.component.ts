import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItemService } from '../../services/cart-item.service';
import { Product } from '../../common/product';
import { CartItem } from '../../common/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [RouterLink, CommonModule]
})
export class ProductDetailComponent implements OnInit {

  productData!: Product;
  id: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartItemService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProductData();
    })
  }

  getProductData() {
    this.id = +this.route.snapshot.paramMap.get('productId')!;
    this.productService.getProductById(this.id).subscribe(data => {
      this.productData = data;
    });
  }
  
  addToCart() {
    let item = new CartItem(this.productData.id, this.productData.name, this.productData.description, this.productData.imageUrl, this.productData.unitPrice, 1);
    this.cartService.addProductToCart(item);
  }

}
