import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItemService } from '../../services/cart-item.service';
import { Product } from '../../common/product';
import { CartItem } from '../../common/cart-item';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [RouterLink, CommonModule, NgbPaginationModule]
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId!: number;
  currentCategoryName: string = '';
  searchProductName: string = '';
  previousName: string = '';
  thePageNumber: number = 1;
  thePageSize: number = 10;
  pageMaxSize: number = 4;
  pageSize: string = "10";
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartItemService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    if (this.route.snapshot.paramMap.has('productName')) {
      this.searchProductName = this.route.snapshot.paramMap.get('productName')!;
      if (this.previousName !== this.searchProductName) {
        this.thePageNumber = 1;
        this.thePageSize = 10;
        this.pageSize = "10";
      }
      this.previousName = this.searchProductName;
      this.productService.getProductByName(this.thePageNumber - 1, this.thePageSize, this.searchProductName).subscribe(
        data => {
          this.products = data._embedded.products,
          this.thePageNumber = data.page.number + 1,
          this.thePageSize = data.page.size,
          this.theTotalElements = data.page.totalElements
        }
      )
    } else {
      let isIdAvailable: boolean = this.route.snapshot.paramMap.has('id');
      if (isIdAvailable) {
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        this.currentCategoryName = this.route.snapshot.paramMap.get('categoryName')!;
      }
      else {
        this.currentCategoryId = 1;
        this.currentCategoryName = 'Books';
      }
      if (this.previousCategoryId !== this.currentCategoryId) {
        this.thePageNumber = 1;
        this.thePageSize = 10;
        this.pageSize = "10";
      }
      this.previousCategoryId = this.currentCategoryId;
      this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
        data => {
          this.products = data._embedded.products,
          this.thePageNumber = data.page.number + 1,
          this.thePageSize = data.page.size,
          this.theTotalElements = data.page.totalElements
        }
      )
    }
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    let item = new CartItem(product.id, product.name, product.description, product.imageUrl, product.unitPrice, 1);
    this.cartService.addProductToCart(item);
  }
}
