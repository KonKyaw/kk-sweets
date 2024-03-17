import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SupportedLanguagesEnum } from 'shared/constants';
import { AuthService } from 'shared/services/auth-guard/auth.service';
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public readonly supportedLanguagesEnum = SupportedLanguagesEnum;
  get currentLanguage(): string{
    return this.translate.currentLang;
  }

  //to-do: change language being reset every refresh

  constructor(public auth: AuthService, public translate: TranslateService) {
    translate.setDefaultLang('mm');
    translate.use('mm');
  }

  public useLanguage(language: SupportedLanguagesEnum): void {
    this.translate.use(language);
  }

  isActive(language: string): boolean {
    return language === this.currentLanguage;
  }
  
  logout(){
    this.auth.logout();
  }
}