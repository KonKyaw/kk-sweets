import { Component, Input } from '@angular/core';
import { AppProduct } from 'shared/models/app-product';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input('product') product: any | AppProduct = {
    title: '',
    price: 0,
    category: '',
    dataUrl: '',
  };
  @Input('showActions') showActions = true; // refactor showActions
  // @Input('inputBrand') inputBrand: string | null = '';
  // @Input('inputSize') inputSize: string | null = '';
}
