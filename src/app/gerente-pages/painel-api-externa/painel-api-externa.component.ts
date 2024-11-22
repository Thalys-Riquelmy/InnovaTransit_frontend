import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonToast, IonButton, IonInput, IonItem, IonCol, IonHeader, IonToolbar, IonButtons, IonSelect, IonSelectOption, IonContent, IonTitle, IonGrid, IonRow, IonMenuButton, IonRadioGroup, IonRadio, IonList, IonModal, IonDatetime, IonDatetimeButton, IonLabel } from "@ionic/angular/standalone";
import { Empresa } from 'src/app/models/empresa';
import { ConfiguracaoService } from 'src/app/services/configuracao-service/configuracao.service';
import { EmpresaService } from 'src/app/services/empresa-service/empresa.service';

@Component({
  selector: 'app-painel-api-externa',
  templateUrl: './painel-api-externa.component.html',
  styleUrls: ['./painel-api-externa.component.scss'],
  imports: [IonLabel, IonDatetimeButton, IonDatetime, IonModal, IonList, IonRadio, IonRadioGroup, IonRow, IonGrid, IonTitle, IonContent, 
    IonToast, IonButton, IonInput, IonItem, IonCol, IonHeader, IonToolbar, IonButtons, IonMenuButton, CommonModule, IonSelect, IonSelectOption, FormsModule,
    ReactiveFormsModule
  ],
  standalone: true,
})
export class PainelApiExternaComponent implements OnInit{

  idEmpresa: number = 0;
  tipoAutomacao: string = '';
  hora: string = '';
  minuto: string = '';
  diaSemana: string = '';
  diaMes: string = '';
  message = '';

  // Propriedades para mensagem de sucesso ou erro
  public mensagem: string = '';
  public status: string = '';
  
  //Injeções
  empresaService = inject (EmpresaService);
  configuracaoService = inject (ConfiguracaoService);
  
  //Lista de Empresas
  empresaSelecionada: Empresa | undefined;
  listaDeEmpresa: Empresa [] = [];

  //Mensagens
  showToast = false; // Variável para controlar o Toast
  toastMessage = ''; // Variável para a mensagem do Toast

  ngOnInit(): void {
    this.listarEmpresas();
    //throw new Error('Method not implemented.');
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

  selecionarEmpresa() {
    // Buscar a empresa com o id selecionado
    this.empresaSelecionada = this.listaDeEmpresa.find(empresa => empresa.id === this.idEmpresa);
  }

  formatarCNPJ(cnpj: string): string {
    // Remover caracteres não numéricos (caso haja algum)
    cnpj = cnpj.replace(/\D/g, '');
  
    // Verificar se o CNPJ tem o número correto de dígitos (14)
    if (cnpj.length === 14) {
      // Formatar o CNPJ como: XX.XXX.XXX/XXXX-XX
      return cnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }
    return cnpj; // Retorna o CNPJ sem formatação se não tiver 14 dígitos
  }

  // Função chamada ao submeter o formulário
  configurarAutomacao() {
    console.log(this.idEmpresa, this.tipoAutomacao, this.hora, this.minuto, this.diaSemana, this.diaMes);
    //return;
    this.configuracaoService.configurarAutomacao(this.idEmpresa, this.tipoAutomacao, this.hora, this.minuto, this.diaSemana, this.diaMes)
      .subscribe(
        (response) => {
          console.log('Automação configurada com sucesso:', response);
          
          this.toastMessage = response.message;
          this.showToast = true;
        },
        (error) => {
          console.error('Erro ao configurar a automação:', error); // Exibe o erro no console
        }
      );
  }

  // Método para chamar o serviço e atualizar os dados
  atualizarDados(idEmpresa: number) {
    this.configuracaoService.atualizarDados(idEmpresa).subscribe(
      response => {
        // Se a chamada for bem-sucedida
        //this.status = 'success';
        //this.mensagem = response.message;
        this.toastMessage = response.message;
        this.showToast = true;
      },
      error => {
        // Se ocorrer algum erro na chamada
        this.status = 'error';
        this.mensagem = 'Erro ao atualizar os dados: ' + error.message;
      }
    );
  }
}
