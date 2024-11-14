import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonCol, IonContent, IonGrid, IonItem, IonInput, IonRow, IonButton, IonSelectOption, IonSelect, IonTitle, IonButtons, IonToolbar, IonHeader, IonMenuButton, IonToast, IonLabel, IonRadio } from "@ionic/angular/standalone";
import { Empresa } from 'src/app/models/empresa';
import { Gerente } from 'src/app/models/gerente';
import { EmpresaService } from 'src/app/services/empresa-service/empresa.service';
import { GerenteService } from 'src/app/services/gerente-service/gerente.service';

@Component({
  selector: 'app-painel-cadastro-gerente',
  templateUrl: './painel-cadastro-gerente.component.html',
  styleUrls: ['./painel-cadastro-gerente.component.scss'],
  imports: [
    IonRadio, IonLabel, IonToast, IonCol, IonContent, IonGrid, IonItem, IonInput, IonRow, IonButton, IonTitle, IonButtons, 
    IonToolbar, IonHeader, IonMenuButton, CommonModule, FormsModule, ReactiveFormsModule, IonSelectOption, IonSelect
  ],
  standalone: true,
})
export class PainelCadastroGerenteComponent implements OnInit{

  //Mensagens
  showToast = false; 
  toastMessage = ''; 

  //Injeções
  empresaService = inject (EmpresaService);
  gerenteService = inject (GerenteService);

  //Lista de Empresas
  empresaId: number = 0;
  empresaSelecionada: Empresa | undefined;
  listaDeEmpresa: Empresa [] = [];

  gerente: Gerente = {
    nome: '',
    email: '',
  };

  constructor() { }
  ngOnInit(): void {
    this.listarEmpresas();
    //throw new Error('Method not implemented.');
  }

  criarGerente(): void {
    if (!this.gerente.nome || !this.gerente.email || !this.empresaSelecionada) {
      this.toastMessage = 'Por favor, preencha todos os campos!';
      this.showToast = true;
      return;
    }
  
    const novoGerente: Gerente = {
      nome: this.gerente.nome,
      email: this.gerente.email,
      empresa: this.empresaSelecionada,  // Agora estamos passando o objeto 'empresa'
    };
  
    console.log('Enviando gerente:', novoGerente);  // Verificando os dados enviados
  
    this.gerenteService.criarGerente(novoGerente).subscribe(
      (response) => {
        this.toastMessage = 'Gerente criado com sucesso!';
        this.showToast = true;
      },
      (error) => {
        console.error('Erro ao criar gerente:', error);
        this.toastMessage = `Erro ao criar gerente: ${error.message || error.statusText || 'Desconhecido'}`;
        this.showToast = true;
      }
    );
  }  

  listarEmpresas(){
    this.empresaService.listarEmpresas().subscribe({
      next: (response) => {
        this.listaDeEmpresa = response; 
      },
      error: (err) => {
        console.error('Erro ao carregar empresas:', err);
      }
    });
  }

  // Método para lidar com a seleção de uma empresa
  onEmpresaSelecionada(event: any): void {
    const empresaId = event.detail.value; // Acessa o valor selecionado
    this.empresaSelecionada = this.listaDeEmpresa.find(emp => emp.id === empresaId);
    console.log('Empresa selecionada:', this.empresaSelecionada);
  }  

}
