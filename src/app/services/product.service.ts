import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl = "http://localhost:8080/api/products";

  private productCategoryUrl = "http://localhost:8080/api/product-category"

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         categoryId: number): Observable<GetProductResponse> {
    let searchUrl: string = `${this.productUrl}/search/findByCategoryId?id=${categoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetProductResponse>(searchUrl);
  }

  getProductByName(thePage: number,
                   thePageSize: number,
                   name: string): Observable<GetProductResponse> {
    let searchUrl = `${this.productUrl}/search/findByNameContaining?name=${name}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetProductResponse>(searchUrl);
  }

  getProductById(id: number): Observable<Product> {
    let searchUrl = `${this.productUrl}/${id}`
    return this.httpClient.get<Product>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetProductCategoryResponse>(this.productCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetProductResponse>(url).pipe(
      map(response => response._embedded.products)
    )
  }
}

interface GetProductResponse {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  }
}