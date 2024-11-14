import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../storage-service/storage.service';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Gerente } from 'src/app/models/gerente';

@Injectable({
  providedIn: 'root'
})
export class GerenteService {
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
        this.apiUrl = `${servidor.url_servidor}/gerente`;
      } else {
        this.apiUrl = 'http://default-server.com/api/gerente';
      }
    } catch (error) {
      console.error('Erro ao buscar a URL da API no IndexedDB:', error);
      this.apiUrl = 'http://default-server.com/api/gerente';
    }
  }

  private getApiUrl(): Observable<string> {
    if (this.apiUrl) {
      return from([this.apiUrl]);
    } else {
      return from(this.initApiUrl().then(() => this.apiUrl));
    }
  }

  listarGerentes(): Observable<Gerente[]> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.get<Gerente[]>(apiUrl))
    );
  }

  obterGerentePorId(id: number): Observable<Gerente> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.get<Gerente>(`${apiUrl}/${id}`))
    );
  }

  criarGerente(gerente: Gerente): Observable<Gerente> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.post<Gerente>(`${apiUrl}/salvar`, gerente)) 
    );
  }  

  atualizarGerente(id: number, gerente: Gerente): Observable<Gerente> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.put<Gerente>(`${apiUrl}/${id}`, gerente))
    );
  }

  deletarGerente(id: number): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.delete<void>(`${apiUrl}/${id}`))
    );
  }
}
