import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryService } from 'shared/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent {
  categories$: Observable<any> = new Observable
  @Input('category') category: string | null = '';
  
  constructor(categoryService: CategoryService){
    this.categories$ = categoryService.getAll();
  }
}
