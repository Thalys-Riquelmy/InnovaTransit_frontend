import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, from, mergeMap, Observable, tap, throwError } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get('token')).pipe(
      mergeMap((token) => {
        // Verifica se um token foi armazenado
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`, // Formato correto do cabeçalho
            },
          });
        }

        // Log da requisição antes de enviá-la
        console.log('Requisição enviada:', request.method, request.url, request.headers.get('Authorization'));

        return next.handle(request).pipe(
          // Log da resposta
          tap(event => {
            console.log('Resposta recebida:', event);
          }),
          catchError((error) => {
            console.error('Erro no interceptor', error);
            // Adiciona mais detalhes sobre o erro
            if (error.status === 0) {
              console.error('Erro de rede ou CORS');
            } else if (error.status === 401) {
              console.error('Erro de autenticação: Token inválido ou expirado.');
            } else {
              console.error(`Erro ${error.status}: ${error.message}`);
            }
            return throwError(error); // Lança o erro para tratamento posterior
          })
        );
      })
    );
  }
}
