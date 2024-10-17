import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //Injeções 
  authService = inject (AuthService);
  router = inject (Router);
  fb = inject (FormBuilder);
  fbRegister = inject (FormBuilder);
  fbPassword = inject (FormBuilder);

  //Formularios
  formGroup: FormGroup;
  primeiroAcessoForm: FormGroup;
  AlteraSenhaForm: FormGroup

  errorMessage: string = '';
  mensagem: string = '';
  isChangingPassword: boolean = false;
  isFirstAccess: boolean = false; 

  constructor() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.primeiroAcessoForm = this.fbRegister.group({
      email: ['', [Validators.required, Validators.email]]
    })

    this.AlteraSenhaForm = this.fbPassword.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onLogin() {
    if (this.formGroup.valid) {
      const { email, senha } = this.formGroup.value;
      this.authService.login(email, senha).subscribe(
        (token) => {
          // Armazena o token no localStorage
          localStorage.setItem('token', token);
          const decoded: any = jwtDecode(token);

          // Verifica se o campo 'trocarSenha' está presente e é verdadeiro
          if (decoded.trocarSenha) {
            this.isChangingPassword = true; // Define como true se precisa trocar a senha
          } else {
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

  onFirstAccess() {
    this.isFirstAccess = true; // Define como true ao clicar em "Primeiro Acesso"
    this.isChangingPassword = false; // Esconde a tela de troca de senha, se visível
  }

  enviarEmail() {
    if (this.primeiroAcessoForm.valid) {
      const email = this.primeiroAcessoForm.get('email')?.value;
      this.authService.enviarEmailPrimeiroAcesso(email).subscribe({
        next: (response) => {
          this.mensagem = response;  // Exibe mensagem de sucesso
          this.cancelar();
        },
        error: (error) => {
          this.mensagem = 'Erro ao processar o pedido. Tente novamente.';  // Exibe mensagem de erro
        },
      });
    }
  }

  cancelar() {
    this.isFirstAccess = false; // Volta para a tela de login
    this.isChangingPassword = false; // Assegura que a tela de mudança de senha está oculta
    this.formGroup.reset(); // Reseta o formulário de login
    this.primeiroAcessoForm.reset(); // Reseta o formulário de primeiro acesso
  }

  // Método para alterar a senha
  alterarSenha() {
    if (this.AlteraSenhaForm.valid) {
      const email = this.formGroup.get('email')?.value;
      const senha = this.AlteraSenhaForm.get('senha')?.value;
      const confirmaSenha = this.AlteraSenhaForm.get('confirmaSenha')?.value;

      console.log(email, senha);
      if (senha === confirmaSenha) {
        // Chame seu serviço para trocar a senha
        this.authService.alterarSenha(email, senha).subscribe({
          next: (response) => {
            this.mensagem = 'Senha alterada com sucesso!';
            this.AlteraSenhaForm.reset(); // Reseta o formulário após sucesso
            this.cancelar();
          },
          error: (error) => {
            this.mensagem = 'Erro ao alterar a senha. Tente novamente.';  // Exibe mensagem de erro
          }
        });
      } else {
        this.mensagem = 'As senhas não correspondem. Por favor, tente novamente.'; // Mensagem de erro se as senhas não coincidirem
      }
    } else {
      this.mensagem = 'Por favor, preencha o formulário corretamente.'; // Mensagem de erro se o formulário não for válido
    }
  }
}
