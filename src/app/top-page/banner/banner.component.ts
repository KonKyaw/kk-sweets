import { Component } from '@angular/core';
import { IMAGE_URLS } from 'shared/constants/urls.constants';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  public readonly pastryChef = IMAGE_URLS.PASTRY_CHEF;
  public readonly bannerColorPc = "https://firebasestorage.googleapis.com/v0/b/dev-kk-sweets.appspot.com/o/Banner-color-1440x450.svg?alt=media&token=ad52284b-3c6e-425b-8898-30ad82d5a52d";
  public readonly bannerWhitePc = "https://firebasestorage.googleapis.com/v0/b/dev-kk-sweets.appspot.com/o/banner-white-pc.svg?alt=media&token=ac8bd00b-ebed-4778-becf-aca4879b17c8";
  public readonly bannerWhiteMobile = "https://firebasestorage.googleapis.com/v0/b/dev-kk-sweets.appspot.com/o/banner-mobile-white.svg?alt=media&token=6b4007f9-e078-4b43-9313-7d4c590dc6c3";
}
