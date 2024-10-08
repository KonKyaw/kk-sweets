import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { AppProduct } from 'shared/models/app-product';
import { ProductService } from 'shared/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy, AfterViewInit {
  // product$: any = new Observable;
  products: AppProduct[] = [];
  filteredProducts: AppProduct[] = [];
  subscription: Subscription = new Subscription();

  displayedColumns: string[] = [
    'order',
    'title',
    // 'brand',
    // 'size',
    'price',
    'category',
    'edit',
    'note',
    'updatedUser',
    'updatedDate',
    'createdUser',
    'createdDate',
  ];
  dataSource = new MatTableDataSource<AppProduct>(this.products);
  // Since the table optimizes for performance, it will not automatically check for changes to the data array.
  // Instead, when objects are added, removed, or moved on the data array, you can trigger an update to the table's rendered rows by calling its renderRows() method.

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.subscription = this.productService
      .getAll()
      .subscribe((products: Array<AppProduct>) => {
        this.filteredProducts = this.products = products;
        this.dataSource = new MatTableDataSource(this.filteredProducts);
        this.dataSource.sort = this.sort; // Initialize sorting after data is loaded.);
        this.dataSource.paginator = this.paginator;
      });
  }

  filter(query: string) {
    this.filteredProducts = query
      ? this.products.filter((p) =>
          p.titleEn.toLowerCase().includes(query.toLowerCase())
        )
      : this.products;
    this.filteredProducts = this.filteredProducts.sort(((a:AppProduct,b:AppProduct) => b.order - a.order));
    this.dataSource = new MatTableDataSource(this.filteredProducts);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
