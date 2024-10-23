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
}
