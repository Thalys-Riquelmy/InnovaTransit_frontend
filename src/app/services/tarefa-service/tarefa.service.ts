/*import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiUrl = 'http://172.18.0.3:8080/api/folha-servico';

  constructor(private http: HttpClient) { }

  iniciarTarefa(id: number, horaInicio: string): Observable<any> {
    const body = {
      id: id,
      horaInicio: horaInicio
    };
    return this.http.post(`${this.apiUrl}/iniciar-tarefa`, body);
  }

  finalizarTarefa(id: number, horaFim: string, hodometroFinal: number, catracaFinal: number): Observable<any> {
    const body = {
      id: id,
      horaFim: horaFim,
      hodometroFinal: hodometroFinal,
      catracaFinal: catracaFinal
    };
    return this.http.post(`${this.apiUrl}/finalizar-tarefa`, body);
  }

  cancelarTarefa(id: number, horaFim: string, motivoCancelamento: string){
    const body = {
      id: id,
      horaFim: horaFim,
      motivoCancelamento: motivoCancelamento
    }
    return this.http.post(`${this.apiUrl}/cancelar-tarefa`, body);
  }

}
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiUrl: string = ''; // Inicializa apiUrl como uma string vazia

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.initApiUrl(); // Chama o método para inicializar a URL da API ao criar o serviço
  }

  // Método para inicializar a URL da API, buscando no IndexedDB
  private async initApiUrl() {
    try {
      // Recupera a URL do servidor (apiUrl) do IndexedDB
      const servidor = await this.storageService.getServidor();

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

  // Método para iniciar a tarefa
  iniciarTarefa(id: number, horaInicio: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.initApiUrl().then(() => {
        const body = {
          id: id,
          horaInicio: horaInicio
        };
        this.http.post(`${this.apiUrl}/iniciar-tarefa`, body)
          .subscribe(
            (response) => observer.next(response),
            (error) => observer.error(error)
          );
      }).catch((error) => {
        console.error('Erro ao inicializar a URL da API:', error);
        observer.error(error);
      });
    });
  }

  // Método para finalizar a tarefa
  finalizarTarefa(id: number, horaFim: string, hodometroFinal: number, catracaFinal: number): Observable<any> {
    return new Observable<any>((observer) => {
      this.initApiUrl().then(() => {
        const body = {
          id: id,
          horaFim: horaFim,
          hodometroFinal: hodometroFinal,
          catracaFinal: catracaFinal
        };
        this.http.post(`${this.apiUrl}/finalizar-tarefa`, body)
          .subscribe(
            (response) => observer.next(response),
            (error) => observer.error(error)
          );
      }).catch((error) => {
        console.error('Erro ao inicializar a URL da API:', error);
        observer.error(error);
      });
    });
  }

  // Método para cancelar a tarefa
  cancelarTarefa(id: number, horaFim: string, motivoCancelamento: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.initApiUrl().then(() => {
        const body = {
          id: id,
          horaFim: horaFim,
          motivoCancelamento: motivoCancelamento
        };
        this.http.post(`${this.apiUrl}/cancelar-tarefa`, body)
          .subscribe(
            (response) => observer.next(response),
            (error) => observer.error(error)
          );
      }).catch((error) => {
        console.error('Erro ao inicializar a URL da API:', error);
        observer.error(error);
      });
    });
  }
}
