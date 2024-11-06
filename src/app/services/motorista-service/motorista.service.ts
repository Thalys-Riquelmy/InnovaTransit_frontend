import { Injectable } from '@angular/core';
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
