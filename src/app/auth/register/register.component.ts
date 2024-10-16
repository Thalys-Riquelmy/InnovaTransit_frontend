import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject (AuthService);
  router = inject (Router);

  primeiroAcessoForm: FormGroup;
  mensagem: string = '';

  constructor(private fb: FormBuilder, ) {
    // Inicializa o formulário com o campo email
    this.primeiroAcessoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  enviarEmail() {
    if (this.primeiroAcessoForm.valid) {
      const email = this.primeiroAcessoForm.get('email')?.value;
      this.authService.enviarEmailPrimeiroAcesso(email).subscribe({
        next: (response) => {
          this.mensagem = response;  // Exibe mensagem de sucesso
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.mensagem = 'Erro ao processar o pedido. Tente novamente.';  // Exibe mensagem de erro
        },
      });
    }
  }
}
