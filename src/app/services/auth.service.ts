/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) {
    this.initStorage();
  }

  // Método para inicializar o Storage
  public async initStorage() {
    await this.storage.create();
  }

  // Método de login ajustado para armazenar token, role e email
  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, {}, { responseType: 'text' })
      .pipe(
        tap(async (token: string) => {
          console.log('Token recebido:', token); // Adiciona log do token
          await this.storage.set('token', token); // Armazena o token
          await this.storage.set('email', email); // Armazena o email

          const decoded: any = jwtDecode(token); // Decodifica o token para acessar as roles
          console.log('Token decodificado:', decoded); // Adiciona log do token decodificado

          const roles = decoded.authorities || []; // Altera para decoded.roles se necessário
          if (roles.length > 0) {
            await this.storage.set('role', roles[0]); // Armazena a primeira role encontrada
          } else {
            await this.storage.set('role', ''); // Armazena uma string vazia se não houver role
          }
        }),
        catchError((error) => {
          console.error('Login falhou', error);
          return throwError(error); // Retorna o erro
        })
      );
  }

  async getRole(): Promise<string> {
    const role = await this.storage.get('role');
    console.log('Role recuperada:', role);
    return role || 'Nenhuma role encontrada';
  }

  async getEmail(): Promise<string> {
    const email = await this.storage.get('email');
    console.log('Email recuperado:', email);
    return email || 'Nenhum email encontrado';
  }

  async logout() {
    await this.storage.remove('token');
    await this.storage.remove('role');
    await this.storage.remove('email'); // Remove o email do armazenamento
    this.router.navigate(['/auth/login']);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get('token');
    return !!token;
  }

  enviarEmailPrimeiroAcesso(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/primeiro-acesso?email=${encodeURIComponent(email)}`, {}, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Falha ao enviar email de primeiro acesso', error);
          return throwError(error);
        })
      );
  }

  alterarSenha(email: string, senha: string): Observable<any> {
    const url = `${this.apiUrl}/auth/altera-senha`;
    const body = { email, senha };

    return this.http.post(url, body, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Erro ao alterar a senha', error);
          return throwError(error);
        })
      );
  }
}


*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) {
    this.initStorage();
  }

  // Método para inicializar o Storage
  public async initStorage() {
    await this.storage.create();
  }

  // Método para limpar o localStorage ao carregar a tela de login
  /*public async clearStorage() {
    await this.storage.clear(); // Limpa todo o storage
    console.log('Storage limpo ao carregar a tela de login');
  }*/

  public async clearStorage() {
    try {
      // Recupera a role antes de limpar o storage
      const role = await this.storage.get('role');
  
      // Limpa o storage, mas preserva a role
      await this.storage.clear();
  
      // Se uma role foi encontrada, restaura no storage
      if (role) {
        await this.storage.set('role', role);
        console.log('Role preservada:', role);
      }
  
      console.log('Storage limpo, exceto a role.');
    } catch (error) {
      console.error('Erro ao limpar o storage e preservar a role:', error);
    }
  }
    
  // Método de login ajustado para armazenar token, role e email
  login(email: string, senha: string): Observable<any> {
    console.log('Login - Email:', email, 'Senha:', senha); // Log do email e senha

    const url = `${this.apiUrl}/auth/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;

    return this.http.post(url, null, { responseType: 'text' })
      .pipe(
        tap(async (token: string) => {
          console.log('Token recebido:', token);
          await this.storage.set('token', token); // Armazena o token
          await this.storage.set('email', email); // Armazena o email

          const decoded: any = jwtDecode(token);
          console.log('Token decodificado:', decoded);

          const authorities = decoded.authorities || []; // Acessa o campo authorities

          // Verifica se authorities não está vazio
          if (authorities.length > 0) {
            const role = authorities[0]; // Acessa a primeira role
            console.log('Role encontrada:', role);
            await this.storage.set('role', role); // Armazena a role
          } else {
            console.log('Nenhuma role encontrada no token.');
            await this.storage.set('role', ''); // Armazena uma string vazia se não houver role
          }
        }),
        catchError((error) => {
          console.error('Login falhou', error);
          return throwError(error);
        })
      );
  }

  async getRole(): Promise<string> {
    const role = await this.storage.get('role');
    console.log('Role recuperada:', role);
    return role || 'Nenhuma role encontrada';
  }

  async getEmail(): Promise<string> {
    const email = await this.storage.get('email');
    console.log('Email recuperado:', email);
    return email || 'Nenhum email encontrado';
  }

  async logout() {
    await this.storage.remove('token');
    await this.storage.remove('role');
    await this.storage.remove('email'); // Remove o email do armazenamento
    this.router.navigate(['/auth/login']);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get('token');
    return !!token;
  }

  enviarEmailPrimeiroAcesso(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/primeiro-acesso?email=${encodeURIComponent(email)}`, {}, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Falha ao enviar email de primeiro acesso', error);
          return throwError(error);
        })
      );
  }

  alterarSenha(email: string, senha: string): Observable<any> {
    const url = `${this.apiUrl}/auth/altera-senha`;
    const body = { email, senha };

    return this.http.post(url, body, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Erro ao alterar a senha', error);
          return throwError(error);
        })
      );
  }
}
