import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth-guard/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'shared/services/user.service';
import { User } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  constructor(private userService: UserService, private auth: AuthService, router: Router) {
    auth.authState$.pipe(takeUntil(this.destroyed$)).subscribe((user: User | null) => {
      if(user) {
        userService.save(user);
        let returnUrl = localStorage.getItem('returnUrl');
        router.navigateByUrl(returnUrl!);
      }
    });
  }

  async login(){
    this.auth.login();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
