import { Component } from '@angular/core';
import { ProductService } from 'shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AppProduct } from 'shared/models/app-product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: Array<AppProduct> = [];
  filteredProducts: any[] = []; //cannot use interface cos doesn't have key
  // products$: Observable<any> = new Observable
  category: string | null = '';

  constructor(route: ActivatedRoute, productService: ProductService) {
    productService.getAll().subscribe((products: Array<AppProduct>) => {
      this.products = products;
      // this.products$ = productService.getAll(); //to-do: add until destroyed

      //needs refactoring with switchMap
      //Dealing with Multiple Asynchronous Operations
      route.queryParamMap.subscribe((params) => {
        this.category = params.get('category');

        if (this.category) {
          this.category = this.category.toLowerCase();
        }

        this.filteredProducts = this.category
          ? this.products.filter(
              (p) => p.category.toLowerCase() === this.category
            )
          : this.products;
        this.filteredProducts = this.filteredProducts.sort(((a:AppProduct,b:AppProduct) => a.order - b.order));
      });
    });
  }
}
