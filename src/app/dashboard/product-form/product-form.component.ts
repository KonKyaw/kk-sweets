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

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})

export class ProductFormComponent implements OnDestroy {
  brands$: Observable<any> = new Observable();
  categories$: Observable<any> = new Observable();
  sizes$: Observable<any> = new Observable();
  editProduct$: Observable<any> = new Observable();
  private idProduct: string | null = '';
  public isEdit: boolean = false;
  public downloadUrl: any = null;
  private user: any;
  private readonly destroyed$ = new Subject<void>();
  imgFile: any;
  imageInput = document.createElement('div') as HTMLInputElement;
  // private urlPattern = /^(https?|http?|ftp):\/\/[^\s/$.?#].[^\s]*\.(jpg|jpeg|png|gif|bmp)$/;

  productForm = new FormGroup({
    titleEn: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(40),
    ]),
    titleMm: new FormControl<string>('', [
      Validators.minLength(4),
      Validators.maxLength(40),
    ]),
    titleJa: new FormControl<string>('', [
      Validators.minLength(4),
      Validators.maxLength(40),
    ]),
    descriptionEn: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(500),  // adjust later
    ]),
    descriptionMm: new FormControl<string>('', [
      Validators.maxLength(500),  // adjust later
    ]),
    descriptionJa: new FormControl<string>('', [
      Validators.maxLength(500),  // adjust later
    ]),
    price: new FormControl<number>(0, [
      Validators.min(0),
    ]),
    category: new FormControl<string>('', [Validators.required]),
    dataUrl: new FormControl<string>('', [
      // Validators.pattern(this.urlPattern)
    ]),
    downloadUrl: new FormControl<string>('', [
    ]),
    note: new FormControl<string>('', []),
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
    this.categories$ = this.categoryService.getAll();
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.editProduct$ = productService.get(this.idProduct);
    this.isEdit = false;
    if (this.idProduct && this.idProduct != 'new') {
      debugger;
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
          dataUrl: product.dataUrl || '',
          downloadUrl: product.downloadUrl || '',
          note: product.note || '',
        });
      });
    }

    auth.authState$.pipe(takeUntil(this.destroyed$)).subscribe((user: User | null) => {
      if (user) {
        this.user = user.displayName;
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

    if (this.isEdit = true && product.downloadUrl) {
        this.deleteImageService.deleteImage(product.downloadUrl);
    }
    // need delay before upload?

    // need to await this before update or create
    // todo: change metadata name
    if (this.imageInput.files) {
      debugger;
      const downloadUrl = await this.uploadImage(this.imageInput);
      product.downloadUrl = downloadUrl;
      console.log("UrlResult", downloadUrl);
    }
    
    if (this.idProduct && this.idProduct != 'new') {
      product.updatedDate = currDateTime;
      product.updatedUser = "kkTest";
      // product.updatedUser = this.user;
      this.editProduct$.pipe(takeUntil(this.destroyed$)).subscribe((Data) => {
        product.createdDate = Data.createdDate;
        product.createdUser = Data.createdUser;
        this.productService.update(product, this.idProduct!);
        this.router.navigate(['/dashboard']);
        debugger;
        console.log("edited"); // double-check if still looping (solved by takeUntil)
      });
    } else {
      product.createdDate = product.updatedDate = currDateTime;
      product.createdUser = product.updatedUser = "kkTest";
      this.productService.create(product);
      console.log("submitted");
      this.router.navigate(['/dashboard']);
    }
  }

  uploadImage(imageInput: HTMLInputElement): Promise<any> {
   // upload to storage
   this.downloadUrl =  this.uploadImageService.uploadImage(imageInput)
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