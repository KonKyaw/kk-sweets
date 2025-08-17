import { Component, ViewChild } from '@angular/core';
import { ProductService } from 'shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AppProduct } from 'shared/models/app-product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(route: ActivatedRoute, productService: ProductService) {
    productService.getAll().subscribe((products: Array<AppProduct>) => {
      this.products = products;
      // this.products$ = productService.getAll(); //to-do: add until destroyed

      //needs refactoring with switchMap
      //Dealing with Multiple Asynchronous Operations
      
      route.queryParamMap.subscribe((params) => {
        this.category = params.get('category');

        // Filter & sort
        this.filteredProducts = this.products
          .filter((p) => p.isActive === true)
          .filter((p) => !this.category || p.category.toLowerCase() === this.category.toLowerCase())
          .sort((a: AppProduct, b: AppProduct) => a.order - b.order);

        // Pass filtered array into dataSource
        this.dataSource.data = this.filteredProducts;
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
