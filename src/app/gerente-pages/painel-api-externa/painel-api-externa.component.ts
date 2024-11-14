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
  empresaId: number = 0;
  frequencia: string = 'once'; // Valor padrão
  horaDiaria: string = "";
  diaSemana: string = ""; // Pode ser "monday", "tuesday", etc.
  diaMes: number = 0;

  //Injeções
  empresaService = inject (EmpresaService);

  //Lista de Empresas
  empresaSelecionada: Empresa | undefined;
  listaDeEmpresa: Empresa [] = [];

  //Mensagens
  showToast = false; // Variável para controlar o Toast
  toastMessage = ''; // Variável para a mensagem do Toast

  constructor(private configuracaoService: ConfiguracaoService) {}
  ngOnInit(): void {
    this.listarEmpresas();
    //throw new Error('Method not implemented.');
  }

  enviarConfiguracao() {
    if (!this.frequencia) {
      console.error('Frequência não fornecida');
      return;
    }
  
    let dateTime: string | null = null;
  
    try {
      switch (this.frequencia) {
        case 'once':
          // Agendamento para o momento atual
          dateTime = new Date().toISOString();
          break;
  
        case 'daily':
          if (this.horaDiaria) {
            const [hours, minutes] = this.horaDiaria.split(':').map(Number);
            if (!isNaN(hours) && !isNaN(minutes)) {
              const today = new Date();
              today.setUTCHours(hours, minutes, 0, 0);
              dateTime = today.toISOString();
            } else {
              throw new Error('Hora diária inválida. Certifique-se de que o formato seja HH:mm.');
            }
          } else {
            throw new Error('Hora diária não fornecida.');
          }
          break;
  
        case 'weekly':
          if (this.diaSemana && this.horaDiaria) {
            const [hours, minutes] = this.horaDiaria.split(':').map(Number);
            if (!isNaN(hours) && !isNaN(minutes)) {
              const today = new Date();
              today.setUTCHours(hours, minutes, 0, 0);
  
              const diasSemana: { [key: string]: number } = {
                monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
                friday: 5, saturday: 6, sunday: 0
              };
              const diaSemanaNumber = diasSemana[this.diaSemana];
              if (diaSemanaNumber === undefined) {
                throw new Error('Dia da semana inválido.');
              }
  
              // Calculando o próximo dia da semana desejado
              const diffDays = (diaSemanaNumber + 7 - today.getUTCDay()) % 7;
              today.setUTCDate(today.getUTCDate() + diffDays);
              dateTime = today.toISOString();
            } else {
              throw new Error('Hora diária inválida.');
            }
          } else {
            throw new Error('Dia da semana ou hora diária não fornecidos.');
          }
          break;
  
        case 'monthly':
          if (this.diaMes && this.horaDiaria) {
            const [hours, minutes] = this.horaDiaria.split(':').map(Number);
            if (!isNaN(hours) && !isNaN(minutes) && this.diaMes > 0 && this.diaMes <= 31) {
              const today = new Date();
              today.setUTCDate(this.diaMes);
              today.setUTCHours(hours, minutes, 0, 0);
              dateTime = today.toISOString();
            } else {
              throw new Error('Dia do mês ou hora diária inválida.');
            }
          } else {
            throw new Error('Dia do mês ou hora diária não fornecidos.');
          }
          break;
  
        default:
          throw new Error('Frequência inválida.');
      }
  
      if (!dateTime) {
        throw new Error('Erro ao definir a data e hora para o agendamento.');
      }
  
      const requestBody = { 
        empresaId: this.empresaId,
        dateTime: dateTime,
        frequency: this.frequencia
      };
  
      this.configuracaoService.enviarConfiguracao(requestBody).subscribe(
        response => {
          this.toastMessage = 'Configuração enviada com sucesso!';
          this.showToast = true;
        },
        error => {
          this.toastMessage = 'Erro ao enviar configuração!';
          this.showToast = true;
        }
      );
  
    } catch (error) {
      console.error(error);
    }
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
    this.empresaSelecionada = this.listaDeEmpresa.find(empresa => empresa.id === this.empresaId);
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
  
}
