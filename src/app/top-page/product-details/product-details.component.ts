import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ALLERGEN_ICON_PATH } from 'shared/constants/urls.constants';
import { AppProduct } from 'shared/models/app-product';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  private idProduct: string | null = '';
  editProduct$: Observable<any> = new Observable();
  public readonly allergenIconPath = ALLERGEN_ICON_PATH + '/'
  public product = {} as AppProduct;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.editProduct$ = productService.get(this.idProduct);
    this.editProduct$.pipe(take(1)).subscribe((product) => {
      this.product = product;
      // console.log("details", this.product);
    })
  }
}
