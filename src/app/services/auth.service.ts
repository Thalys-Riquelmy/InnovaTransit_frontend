import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router) {}

  // Método de login ajustado para enviar dados como parâmetros de consulta na URL
  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, {}, { responseType: 'text' }) // Especificar que a resposta é texto
      .pipe(
        catchError((error) => {
          console.error('Login falhou', error);
          return throwError(error); // Retorna o erro
        })
      );
  } 

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        
        // Verificar se 'authorities' existe e é um array
        if (decoded.authorities && Array.isArray(decoded.authorities)) {
          return decoded.authorities[0] || ''; // Retorna a primeira autoridade
        } else {
          console.warn('O token não contém o campo "authorities" esperado.');
          return ''; // Retorna uma string vazia se não houver autoridades
        }
      } catch (error) {
        console.error('Erro ao decodificar o token', error);
        return ''; // Retorna uma string vazia em caso de erro
      }
    }
    return ''; // Retorna uma string vazia se não houver token
  }

  // Envia email para o primeiro acesso
  enviarEmailPrimeiroAcesso(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/primeiro-acesso?email=${encodeURIComponent(email)}`, {}, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Falha ao enviar email de primeiro acesso', error);
          return throwError(error);
        })
      );
  }    

  // Método para alterar a senha
  alterarSenha(email: string, senha: string): Observable<any> {
    const url = `${this.apiUrl}/auth/altera-senha`;
    const body = { email, senha }; // Cria um objeto com email e senha

    return this.http.post(url, body, { responseType: 'text' }) // Requisição PUT com corpo
      .pipe(
        catchError((error) => {
          console.error('Erro ao alterar a senha', error);
          return throwError(error); // Retorna o erro
        })
      );
  }
}
