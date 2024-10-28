import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FolhaServico } from 'src/app/models/folha-servico';

@Injectable({
  providedIn: 'root'
})
export class FolhaServicoService {
  private apiUrl = 'http://localhost:8080/api/folha-servico'; // URL da sua API

  constructor(private http: HttpClient) { }

  // Método para buscar folha de serviço por matrícula e data
  buscarFolhaServico(matricula: number, dataServico: string): Observable<FolhaServico> {
    const params = new HttpParams()
      .set('matricula', matricula.toString())
      .set('dataServico', dataServico);

    return this.http.get<FolhaServico>(`${this.apiUrl}/obter-por-matricula-e-data`, { params });
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

  finalizarFolhaDeServico(id: number, horaFim: string){
    const body = {
      id: id,
      horaFim: horaFim
    }
    return this.http.post(`${this.apiUrl}/finalizar`, body);
  }
}
