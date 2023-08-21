import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {

  constructor( private authService: AuthService, private router: Router ) {}

  public onLogin(): void {
    this.authService.login('diego@gmail.com', '123654')
      .subscribe( user => {
        this.router.navigate(['/']);
      });
  }
}
