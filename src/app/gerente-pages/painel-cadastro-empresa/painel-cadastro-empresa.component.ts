import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTitle, IonHeader, IonToolbar, IonButtons , IonMenuButton, IonContent, IonGrid, IonCol, IonRow, IonItem, IonInput, IonButton, IonToast } from "@ionic/angular/standalone";
import { Empresa } from 'src/app/models/empresa';
import { EmpresaService } from 'src/app/services/empresa-service/empresa.service';

@Component({
  selector: 'app-painel-cadastro-empresa',
  templateUrl: './painel-cadastro-empresa.component.html',
  styleUrls: ['./painel-cadastro-empresa.component.scss'],
  imports: [IonToast, IonButton, IonInput, IonItem, IonRow, IonCol, IonGrid, IonContent, IonButtons, 
    IonTitle, IonHeader, IonToolbar, IonMenuButton, IonButtons, CommonModule, FormsModule
  ],
  standalone: true,
})
export class PainelCadastroEmpresaComponent{
  nomeEmpresa: string = '';
  cnpjEmpresa: string = '';
  //Mensagens
  showToast = false; // Variável para controlar o Toast
  toastMessage = ''; // Variável para a mensagem do Toast

  constructor(private empresaService: EmpresaService) { }

  cadastrarEmpresa() {
    const novaEmpresa: Empresa = {
      nome: this.nomeEmpresa,
      cnpj: this.cnpjEmpresa,
      urlBusca: "",  // Ou algum valor padrão
      apiKey: ""     // Ou algum valor padrão
    };
    

    this.empresaService.criarEmpresa(novaEmpresa).subscribe({
      next: (empresaCriada) => {
        this.toastMessage = 'Empresa criada com sucesso!';
        this.showToast = true;
      },
      error: (erro) => {
        this.toastMessage = 'Erro ao criar empresa!';
        this.showToast = true;
      }
    });
  }

}
