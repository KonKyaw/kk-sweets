import { Component } from '@angular/core';
import { SOCIAL_ICON_URLS } from 'shared/constants/urls.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  instagram = SOCIAL_ICON_URLS.INSTAGRAM;
  lionMart = SOCIAL_ICON_URLS.LION_MART;
}
