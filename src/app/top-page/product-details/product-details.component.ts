import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  private idProduct: string | null = '';
  editProduct$: Observable<any> = new Observable();
  product: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.editProduct$ = productService.get(this.idProduct);
    this.editProduct$.pipe(take(1)).subscribe((product) => {
      this.product = product;
      console.log("details", this.product);
    })
  }
}
