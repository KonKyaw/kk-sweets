import { Component, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { SupportedLanguagesEnum } from 'shared/constants';
import { AuthService } from 'shared/services/auth-guard/auth.service';
import { UserService } from 'shared/services/user.service';
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy{
  public readonly supportedLanguagesEnum = SupportedLanguagesEnum;
  private readonly destroyed$ = new Subject<void>();
  public isAdmin = false;
  get currentLanguage(): string{
    return this.translate.currentLang;
  }

  //to-do: change language being reset every refresh

  constructor(
    private userService: UserService,
    public auth: AuthService,
    public translate: TranslateService
    ) {
    translate.setDefaultLang('mm');
    translate.use('mm');
    auth.authState$.pipe(takeUntil(this.destroyed$)).subscribe((user: User | null) => {
      if (user) {
        userService.get(user.uid).pipe(takeUntil(this.destroyed$)).subscribe((appUser) => {
          if (appUser.isAdmin) {
            this.isAdmin = true;
          }
        })
      }
    }
    )
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

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}