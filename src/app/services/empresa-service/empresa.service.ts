import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../storage-service/storage.service';
import { Observable, from } from 'rxjs';
import { Empresa } from 'src/app/models/empresa';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
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
        this.apiUrl = `${servidor.url_servidor}/empresa`;
      } else {
        this.apiUrl = 'http://default-server.com/api/empresa';
      }
    } catch (error) {
      console.error('Erro ao buscar a URL da API no IndexedDB:', error);
      this.apiUrl = 'http://default-server.com/api/empresa';
    }
  }

  private getApiUrl(): Observable<string> {
    if (this.apiUrl) {
      return from([this.apiUrl]);
    } else {
      return from(this.initApiUrl().then(() => this.apiUrl));
    }
  }

  listarEmpresas(): Observable<Empresa[]> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.get<Empresa[]>(apiUrl))
    );
  }

  obterEmpresaPorId(id: number): Observable<Empresa> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.get<Empresa>(`${apiUrl}/${id}`))
    );
  }

  criarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.post<Empresa>(apiUrl, empresa))
    );
  }

  atualizarEmpresa(id: number, empresa: Empresa): Observable<Empresa> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.put<Empresa>(`${apiUrl}/${id}`, empresa))
    );
  }

  deletarEmpresa(id: number): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.delete<void>(`${apiUrl}/${id}`))
    );
  }
}
