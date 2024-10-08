import { DatePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'shared/services/auth-guard/auth.service';
import { CategoryService } from 'shared/services/category.service';
import { DeleteImageService } from 'shared/services/delete-image.service';
import { ProductService } from 'shared/services/product.service';
import { UploadImageService } from 'shared/services/upload-image.service';
import { TranslateService } from '@ngx-translate/core';
import { IProductCategory } from 'shared/models/product-category.model';
import { MainAllergensEnum, SubAllergensEnum } from 'shared/constants';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})

export class ProductFormComponent implements OnDestroy {
  brands$: Observable<any> = new Observable();
  productCategories$: Observable<IProductCategory[]> = new Observable();
  sizes$: Observable<any> = new Observable();
  editProduct$: Observable<any> = new Observable();
  private idProduct: string | null = '';
  public isEdit: boolean = false;
  public downloadUrl: any = null; //to-do: refactor type
  public readonly mainAllergensEnum = MainAllergensEnum;
  public readonly subAllergensEnum = SubAllergensEnum;
  private userName = '';
  private readonly destroyed$ = new Subject<void>();
  private countProducts = 0;
  imgFile: any;
  imageInput = document.createElement('div') as HTMLInputElement;
  // private urlPattern = /^(https?|http?|ftp):\/\/[^\s/$.?#].[^\s]*\.(jpg|jpeg|png|gif|bmp)$/;

  productForm = new FormGroup({
    titleEn: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100)
    ]),
    titleMm: new FormControl<string>('', [
      Validators.minLength(4), // to-do: add error for html
      Validators.maxLength(100)
    ]),
    titleJa: new FormControl<string>('', [
      Validators.minLength(4),
      Validators.maxLength(100)
    ]),
    descriptionEn: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(1500)
    ]),
    descriptionMm: new FormControl<string>('', [
      Validators.maxLength(1500)
    ]),
    descriptionJa: new FormControl<string>('', [
      Validators.maxLength(1500)
    ]),
    price: new FormControl<number>(0, [
      Validators.min(0)
    ]),
    category: new FormControl<string>('', [Validators.required]),
    allergenInfo: new FormControl<MainAllergensEnum[] | SubAllergensEnum[]>([], []),
    dataUrl: new FormControl<string>('', [
      // Validators.pattern(this.urlPattern)
    ]),
    downloadUrl: new FormControl<string>('', [
    ]),
    note: new FormControl<string>('', []),
    order: new FormControl<number>(0, [])
  });

  constructor(
    private auth: AuthService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private uploadImageService: UploadImageService,
    private deleteImageService: DeleteImageService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    public translate: TranslateService
  ) {
    this.productCategories$ = this.categoryService.getAll();
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.editProduct$ = productService.get(this.idProduct);
    this.isEdit = false;
    if (this.idProduct && this.idProduct != 'new') {
      // debugger;
      this.isEdit = true;
      this.editProduct$.pipe(takeUntil(this.destroyed$)).subscribe((product) => {
        this.productForm.setValue({
          titleEn: product.titleEn || '',
          titleMm: product.titleMm || '',
          titleJa: product.titleJa || '',
          descriptionEn: product.descriptionEn || '',
          descriptionMm: product.descriptionMm || '',
          descriptionJa: product.descriptionJa || '',
          price: product.price || 0,
          category: product.category || '',
          allergenInfo: product.allergenInfo || [],
          dataUrl: product.dataUrl || '',
          downloadUrl: product.downloadUrl || '',
          note: product.note || '',
          order: product.order || 999
        });
      });
    } else {
      productService.getAll().subscribe(products => {
        this.countProducts = products.length; //to-do: refactor as productService method (1 time read, without streaming obeservable)
        this.productForm.patchValue({
          order: this.countProducts + 1
        });
      })
    }

    auth.authState$.pipe(takeUntil(this.destroyed$)).subscribe((user: User | null) => {
      if (user?.displayName) {
        this.userName = user.displayName;
      }
    });
  }

  //needed for ngIf etc..
  get titleEn() {
    return this.productForm.get('titleEn');
  }
  get descriptionEn() {
    return this.productForm.get('descriptionEn');
  }
  get price() {
    return this.productForm.get('price');
  }
  get category() {
    return this.productForm.get('category');
  }
  get dataUrl() {
    return this.productForm.get('dataUrl');
  }

  async onSubmit(product: any) {
    const currDateTime = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );

    if (this.idProduct && this.idProduct != 'new') {
      product.updatedDate = currDateTime;
      product.updatedUser = this.userName;

      if (this.imageInput.files) {
        if (this.isEdit = true && product.downloadUrl) {
          this.deleteImageService.deleteImage(product.downloadUrl);
        }
        const downloadUrl = await this.uploadImage(this.imageInput, this.idProduct);
        product.downloadUrl = downloadUrl;
        console.log("UrlResult- editProduct", downloadUrl);
      }

      this.editProduct$.pipe(takeUntil(this.destroyed$)).subscribe((Data) => {
        product.createdDate = Data.createdDate;
        product.createdUser = Data.createdUser;
        this.productService.update(product, this.idProduct!);
        this.router.navigate(['/dashboard']);
        // debugger;
        console.log("edited"); // double-check if still looping (solved by takeUntil)
      });
    } else {
      product.createdDate = product.updatedDate = currDateTime;
      product.createdUser = product.updatedUser = this.userName;
      const key = this.productService.create(product);
      if (this.imageInput.files) {
        const downloadUrl = await this.uploadImage(this.imageInput, key);
        product.downloadUrl = downloadUrl;
        console.log("UrlResult- newProduct", downloadUrl);
        this.productService.update(product, key);
      }
      console.log("submitted", key);
      this.router.navigate(['/dashboard']);
    }
  }

  uploadImage(imageInput: HTMLInputElement, productKey: string): Promise<any> {
    // upload to storage
    this.downloadUrl =  this.uploadImageService.uploadImage(imageInput, productKey);
    return new Promise((resolve) => {
      if(this.downloadUrl) {
        resolve(this.downloadUrl);
      }
    });
  }

  onImageChange(imageInput: HTMLInputElement) {
    this.imageInput = imageInput;
    const reader = new FileReader();
    if (imageInput.files && imageInput.files.length) {
      const imgfile = imageInput.files[0];
      reader.readAsDataURL(imgfile);
      reader.onload = async () => {
        await this.resizeImage(reader.result as string).then((resolve: any) => {
          this.imgFile = resolve;
          this.downloadUrl = true;
          this.productForm.patchValue({
            dataUrl: resolve,
          });
        });
      };
    }
  }

  resizeImage(dataURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 400, 400);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = dataURL;
    });
  }

  delete() {
    if (
      confirm('Are you sure you want to delete this product?') &&
      this.idProduct
    ) {
      if (this.productForm.controls.downloadUrl.value) {
        this.deleteImageService.deleteImage(this.productForm.controls.downloadUrl.value);
      }
      this.productService.delete(this.idProduct);
      this.router.navigate(['/dashboard']);
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
