// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (await this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']); // redireciona para a tela de login se não autenticado
      return false;
    }
  }
}
