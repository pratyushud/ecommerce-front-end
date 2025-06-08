import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getProductsWithName(name: string):void {
    this.router.navigateByUrl(`search/${name}`);
  }

}
