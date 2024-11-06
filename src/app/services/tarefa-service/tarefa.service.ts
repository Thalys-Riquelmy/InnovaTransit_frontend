import { Injectable } from '@angular/core';
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
