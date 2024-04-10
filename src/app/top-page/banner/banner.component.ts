import { Component } from '@angular/core';
import { IMAGE_URLS } from 'shared/constants/urls.constants';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  public readonly bannerPc = IMAGE_URLS.BANNER_PC;
  public readonly bannerMobile = IMAGE_URLS.BANNER_MOBILE;
}
