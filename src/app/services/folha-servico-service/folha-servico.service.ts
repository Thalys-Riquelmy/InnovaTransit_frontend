/*import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, pipe, tap } from 'rxjs';
import { FolhaServico } from 'src/app/models/folha-servico';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FolhaServicoService {
  storageService = inject (StorageService);

  private apiUrl = 'http://172.18.0.3:8080/api/folha-servico'; // URL da sua API

  constructor(private http: HttpClient) {  }

  // Método para listar folha de serviço por uma data específica
  listarFolhaServicoPorData(dataServico: string): Observable<FolhaServico[]> {
    const params = new HttpParams().set('data', dataServico); // Define o parâmetro "data"
    return this.http.get<FolhaServico[]>(`${this.apiUrl}/por-data`, { params });
  }

  // Método para buscar folha de serviço por matrícula e data
  buscarFolhaServico(matricula: number, dataServico: string): Observable<FolhaServico> {
  const params = new HttpParams()
    .set('matricula', matricula.toString())
    .set('dataServico', dataServico);

  return this.http.get<FolhaServico>(`${this.apiUrl}/obter-por-matricula-e-data`, { params })
    .pipe(
      tap(async (folhaServico) => {
        // Salva as tarefas associadas e a folha de serviço com apenas os IDs das tarefas no IndexedDB
        await this.storageService.saveFolhaServicoComTarefas(folhaServico, folhaServico.tarefas);
      })
    );
  }

  finalizarFolhaDeServico(id: number, horaFim: string){
    const body = {
      id: id,
      horaFim: horaFim
    }
    return this.http.post(`${this.apiUrl}/finalizar`, body);
  }

  // Método para iniciar a folha de serviço
  iniciarFolhaDeServico(id: number, horaInicial: string): Observable<any> {
    // Criar o corpo da requisição
    const body = {
      id: id,
      horaInicial: horaInicial  // Formato de tempo ISO (hh:mm:ss)
    };
    // Fazer a requisição POST ao backend com o corpo
    return this.http.post(`${this.apiUrl}/iniciar`, body);
  } 
}
*/

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { FolhaServico } from 'src/app/models/folha-servico';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FolhaServicoService {
  private apiUrl: string = ''; // Inicializa apiUrl como uma string vazia
  private storageService = inject(StorageService);

  constructor(private http: HttpClient) {
    this.initApiUrl(); // Chama o método para inicializar a URL da API ao criar o serviço
  }

  // Método para inicializar a URL da API, buscando no IndexedDB
  private async initApiUrl() {
    try {
      // Recupera a URL do servidor (apiUrl) do IndexedDB
      const servidor = await this.storageService.getServidor();
      console.log('Servidor recuperado:', servidor); 

      if (servidor && servidor.url_servidor) {
        this.apiUrl = `${servidor.url_servidor}/folha-servico`; // Define a URL completa da API
        console.log('API URL definida para:', this.apiUrl);
      } else {
        // Caso não tenha a URL salva, define um valor padrão
        this.apiUrl = 'http://default-server.com/api/folha-servico';
        console.log('Nenhuma URL encontrada, usando a URL padrão:', this.apiUrl);
      }
    } catch (error) {
      console.error('Erro ao buscar a URL da API no IndexedDB:', error);
      // Define uma URL padrão em caso de erro
      this.apiUrl = 'http://default-server.com/api/folha-servico';
    }
  }

  // Método para listar folha de serviço por uma data específica
  listarFolhaServicoPorData(dataServico: string): Observable<FolhaServico[]> {
    const params = new HttpParams().set('data', dataServico); // Define o parâmetro "data"
    return this.http.get<FolhaServico[]>(`${this.apiUrl}/por-data`, { params });
  }

  // Método para buscar folha de serviço por matrícula e data
  buscarFolhaServico(matricula: number, dataServico: string): Observable<FolhaServico> {
    const params = new HttpParams()
      .set('matricula', matricula.toString())
      .set('dataServico', dataServico);

    return this.http.get<FolhaServico>(`${this.apiUrl}/obter-por-matricula-e-data`, { params })
      .pipe(
        tap(async (folhaServico) => {
          // Salva as tarefas associadas e a folha de serviço com apenas os IDs das tarefas no IndexedDB
          await this.storageService.saveFolhaServicoComTarefas(folhaServico, folhaServico.tarefas);
        })
      );
  }

  // Método para retornar a URL do servidor
  getUrlServidor(): string {
    return this.apiUrl;
  }

  // Método para finalizar a folha de serviço
  finalizarFolhaDeServico(id: number, horaFim: string): Observable<any> {
    const body = {
      id: id,
      horaFim: horaFim
    };
    return this.http.post(`${this.apiUrl}/finalizar`, body);
  }

  // Método para iniciar a folha de serviço
  iniciarFolhaDeServico(id: number, horaInicial: string): Observable<any> {
    const body = {
      id: id,
      horaInicial: horaInicial  // Formato de tempo ISO (hh:mm:ss)
    };
    return this.http.post(`${this.apiUrl}/iniciar`, body);
  }
}
