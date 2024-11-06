import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private apiUrl = 'http://172.18.0.3:8080/api/veiculo';

  constructor(private http: HttpClient) { }

}
