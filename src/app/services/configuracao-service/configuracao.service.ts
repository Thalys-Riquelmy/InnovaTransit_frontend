import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  private apiUrl: string = ''; // Inicializa apiUrl como uma string vazia
  private storageService = inject(StorageService);

  constructor(private http: HttpClient) {
    this.initApiUrl(); // Chama o método para inicializar a URL da API ao criar o serviço
  }

  // Método para inicializar a URL da API, buscando no IndexedDB
  private async initApiUrl() {
    try {
      const servidor = await this.storageService.getServidor();
      if (servidor && servidor.url_servidor) {
        this.apiUrl = `${servidor.url_servidor}/scheduler/schedule-task`; // A URL agora é configurada com o endpoint correto
      } else {
        this.apiUrl = 'http://default-server.com/api/scheduler/schedule-task';
      }
    } catch (error) {
      console.error('Erro ao buscar a URL da API no IndexedDB:', error);
      this.apiUrl = 'http://default-server.com/api/scheduler/schedule-task';
    }
  }

  // Método para enviar a configuração para o backend
  enviarConfiguracao(config: any): Observable<any> {
    return this.http.post(this.apiUrl, config);
  }
}
