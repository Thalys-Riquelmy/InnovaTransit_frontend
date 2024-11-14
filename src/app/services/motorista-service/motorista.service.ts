/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Motorista } from 'src/app/models/motorista';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private apiUrl = 'http://172.18.0.3:8080/api/motorista'; // Altere a URL para a URL da sua API

  constructor(private http: HttpClient) {}

  buscarMotoristaPorEmail(email: string): Observable<Motorista> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Motorista>(`${this.apiUrl}/por-email`, { params });
  }
}
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Motorista } from 'src/app/models/motorista';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private apiUrl: string = ''; // Inicializa apiUrl como uma string vazia

  constructor(private http: HttpClient, private storageService: StorageService) {}

  // Método para buscar a URL da API no IndexedDB
  private async initApiUrl() {
    try {
      // Recupera a URL do servidor (apiUrl) do IndexedDB
      const servidor = await this.storageService.getServidor();
      if (servidor && servidor.url_servidor) {
        this.apiUrl = `${servidor.url_servidor}/motorista`; // Define a URL completa da API
        console.log('API URL definida para:', this.apiUrl);
      } else {
        // Caso não tenha a URL salva, define um valor padrão
        this.apiUrl = 'http://default-server.com/api/motorista';
        console.log('Nenhuma URL encontrada, usando a URL padrão:', this.apiUrl);
      }
    } catch (error) {
      console.error('Erro ao buscar a URL da API no IndexedDB:', error);
      // Define uma URL padrão em caso de erro
      this.apiUrl = 'http://default-server.com/api/motorista';
    }
  }

  // Método para buscar motorista por email
  buscarMotoristaPorEmail(email: string): Observable<Motorista> {
    // Chama initApiUrl para garantir que a URL seja carregada antes de fazer a requisição
    return new Observable<Motorista>((observer) => {
      this.initApiUrl().then(() => {
        const params = new HttpParams().set('email', email); // Define o parâmetro "email"
        this.http.get<Motorista>(`${this.apiUrl}/por-email`, { params })
          .subscribe(
            (motorista) => observer.next(motorista),
            (error) => observer.error(error)
          );
      }).catch((error) => {
        console.error('Erro ao inicializar a URL da API:', error);
        observer.error(error);
      });
    });
  }
}
