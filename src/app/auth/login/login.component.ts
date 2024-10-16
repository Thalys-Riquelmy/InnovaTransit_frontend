import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formGroup: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.formGroup.valid) {
      const { email, senha } = this.formGroup.value;
      this.authService.login(email, senha).subscribe(
        (token) => {
          // Armazena o token no localStorage
          localStorage.setItem('token', token);
          
          // Após armazenar o token, garanta que o token será decodificado corretamente
          const role = this.authService.getRole();
          console.log('Role do usuário:', role); // Exibe a role no console
  
          // Redireciona o usuário baseado na role
          if (role === 'ROLE_GERENTE') {
            this.router.navigate(['/gerente']); // Exemplo de redirecionamento para gerente
          } else if (role === 'ROLE_MOTORISTA') {
            this.router.navigate(['/motorista']); // Exemplo de redirecionamento para motorista
          } else {
            console.warn('Role não reconhecida:', role);
          }
        },
        (error) => {
          // Captura a mensagem de erro enviada pelo servidor
          if (error.status === 401 || error.status === 404) {
            this.errorMessage = error.error; // A mensagem do servidor vem no campo `error`
          } else {
            this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
          }
        }
      );
    }
  }
  
}
