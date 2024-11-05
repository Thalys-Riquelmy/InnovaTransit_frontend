import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCol, IonRow, IonButton, IonGrid, IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonLabel, IonCardSubtitle, IonIcon } from '@ionic/angular/standalone';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonIcon, IonCardSubtitle, IonLabel, IonItem, IonInput, IonCardContent, IonCardHeader, IonCard, IonGrid, IonButton, 
    IonRow, IonCol, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonContent, HttpClientModule, ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit{

  //Injeções 
  authService = inject (AuthService);
  router = inject (Router);
  fb = inject (FormBuilder);
  fbRegister = inject (FormBuilder);
  fbPassword = inject (FormBuilder);
  http = inject (HttpClient);

  //Formularios
  formGroup: FormGroup;
  primeiroAcessoForm: FormGroup;
  alteraSenhaForm: FormGroup

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

    this.alteraSenhaForm = this.fbPassword.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  /*ngOnInit(): void {
    this.authService.clearStorage(); // Limpa o localStorage ao carregar a tela de login
  }*/

    ngOnInit(): void {
      // Limpa o localStorage imediatamente ao carregar a tela de login
      
      // Configura um timeout para limpar o localStorage novamente após 10 segundos
      setTimeout(() => {
        //this.authService.clearStorage();
        this.authService.logout();
        console.log("localStorage limpo após 10 segundos!");
      }, 10000); // 10000 milissegundos = 10 segundos
    }
    
  
  async onLogin() {
    if (this.formGroup.valid) {
      const { email, senha } = this.formGroup.value;
      this.authService.login(email, senha).subscribe(
        async (token) => {
          // Armazena o token no localStorage
          console.log("Aqui está o token", token);
          localStorage.setItem('token', token);
          const decoded: any = jwtDecode(token);

          // Armazena o e-mail no localStorage
          localStorage.setItem('email', email);
          console.log('email')
  
          // Verifica se o campo 'trocarSenha' está presente e é verdadeiro
          if (decoded.trocarSenha) {
            this.isChangingPassword = true; // Define como true se precisa trocar a senha
          } else {
            // Após armazenar o token, garanta que o token será decodificado corretamente
            const role = await this.authService.getRole(); // Aguarde a resolução da Promise
            console.log('Role do usuário:', role); // Exibe a role no console
    
            // Redireciona o usuário baseado na role
            if (role === 'ROLE_GERENTE') {
              this.router.navigate(['gerente']); // Exemplo de redirecionamento para gerente
            } else if (role === 'ROLE_MOTORISTA') {
              this.router.navigate(['motorista']); // Exemplo de redirecionamento para motorista
            } else {
              console.warn('Role não reconhecida:', role);
            }
          }       
        },
        (error: any) => {
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
        next: (response: any) => {
          this.mensagem = response;  // Exibe mensagem de sucesso
          this.cancelar();
        },
        error: (error: any) => {
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
    if (this.alteraSenhaForm.valid) {
      const email = this.formGroup.get('email')?.value;
      const senha = this.alteraSenhaForm.get('senha')?.value;
      const confirmaSenha = this.alteraSenhaForm.get('confirmaSenha')?.value;

      console.log(email, senha);
      if (senha === confirmaSenha) {
        // Chame seu serviço para trocar a senha
        this.authService.alterarSenha(email, senha).subscribe({
          next: (response: any) => {
            this.mensagem = 'Senha alterada com sucesso!';
            this.alteraSenhaForm.reset(); // Reseta o formulário após sucesso
            this.cancelar();
          },
          error: (error: any) => {
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


/*
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCol, IonRow, IonButton, IonGrid, IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonLabel, IonCardSubtitle, IonIcon } from '@ionic/angular/standalone';
import { jwtDecode  }from 'jwt-decode'; // Corrigido o nome da função
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonIcon, IonCardSubtitle, IonLabel, IonItem, IonInput, IonCardContent, IonCardHeader, IonCard, IonGrid, IonButton, 
    IonRow, IonCol, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonContent, HttpClientModule, ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {

  // Injeções
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  fbRegister = inject(FormBuilder);
  fbPassword = inject(FormBuilder);
  http = inject(HttpClient);

  // Formularios
  formGroup: FormGroup;
  primeiroAcessoForm: FormGroup;
  alteraSenhaForm: FormGroup;

  errorMessage: string = '';
  mensagem: string = '';
  isChangingPassword: boolean = false;
  isFirstAccess: boolean = false;

  constructor() {
    // Inicialização dos formulários
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.primeiroAcessoForm = this.fbRegister.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.alteraSenhaForm = this.fbPassword.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.authService.clearStorage(); // Limpa o localStorage ao carregar a tela de login
  }

  async onLogin() {
    if (this.formGroup.valid) {
      const { email, senha } = this.formGroup.value;
      this.authService.login(email, senha).subscribe(
        async (token) => {
          // Armazena o token no localStorage
          console.log("Aqui está o token", token);
          localStorage.setItem('token', token);
          
          // Decodifica o token
          const decoded: any = jwtDecode(token);
          
          // Armazena o e-mail no localStorage
          localStorage.setItem('email', email);
          console.log('Email armazenado:', email);
  
          // Verifica se o campo 'trocarSenha' está presente e é verdadeiro
          if (decoded.trocarSenha) {
            this.isChangingPassword = true; // Define como true se precisa trocar a senha
          } else {
            // Obtém a role diretamente do token decodificado
            const role = decoded.role || decoded.authority; // Verifique qual é o campo correto
            console.log('Role do usuário:', role); // Exibe a role no console
  
            // Redireciona o usuário baseado na role
            if (role === 'ROLE_GERENTE') {
              this.router.navigate(['gerente']); // Exemplo de redirecionamento para gerente
            } else if (role === 'ROLE_MOTORISTA') {
              this.router.navigate(['motorista']); // Exemplo de redirecionamento para motorista
            } else {
              console.warn('Role não reconhecida:', role);
            }
          }
        },
        (error: any) => {
          // Captura a mensagem de erro enviada pelo servidor
          if (error.status === 401 || error.status === 404) {
            this.errorMessage = error.error; // A mensagem do servidor vem no campo `error`
          } else {
            this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
          }
          console.error('Erro no login:', error); // Log do erro inesperado
        }
      );
    } else {
      this.errorMessage = 'Por favor, preencha o formulário corretamente.';
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
        next: (response: any) => {
          this.mensagem = response;  // Exibe mensagem de sucesso
          this.cancelar();
        },
        error: (error: any) => {
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
    if (this.alteraSenhaForm.valid) {
      const email = this.formGroup.get('email')?.value;
      const senha = this.alteraSenhaForm.get('senha')?.value;
      const confirmaSenha = this.alteraSenhaForm.get('confirmaSenha')?.value;

      if (senha === confirmaSenha) {
        // Chame o serviço para trocar a senha
        this.authService.alterarSenha(email, senha).subscribe({
          next: (response: any) => {
            this.mensagem = 'Senha alterada com sucesso!';
            this.alteraSenhaForm.reset(); // Reseta o formulário após sucesso
            this.cancelar();
          },
          error: (error: any) => {
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
*/