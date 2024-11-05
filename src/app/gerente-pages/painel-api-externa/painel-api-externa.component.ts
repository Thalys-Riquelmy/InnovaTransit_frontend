import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonToast, IonButton, IonInput, IonItem, IonCol, IonHeader, IonToolbar, IonButtons, IonSelect,IonSelectOption, IonContent, IonTitle, IonGrid, IonRow, IonMenuButton, IonRadioGroup, IonRadio, IonList, IonModal, IonDatetime, IonDatetimeButton, IonLabel } from "@ionic/angular/standalone";

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
export class PainelApiExternaComponent {

  frequencia: string = '';
  dataHoraUnica:  string = '';
  horaDiaria:  string = '';
  diaSemana:  string = '';
  horaSemanal:  string = '';
  diaMes: number = 0;
  horaMensal:  string = '';

  constructor() {}

  // Função para enviar dados ao backend
  agendarTarefa() {
    let payload;

    switch (this.frequencia) {
      case 'once':
        payload = { frequency: 'ONCE', dateTime: this.dataHoraUnica };
        break;
      case 'daily':
        payload = { frequency: 'DAILY', dateTime: `1970-01-01T${this.horaDiaria}:00` };
        break;
      case 'weekly':
        payload = { frequency: 'WEEKLY', dateTime: `1970-01-01T${this.horaSemanal}:00`, dayOfWeek: this.diaSemana };
        break;
      case 'monthly':
        payload = { frequency: 'MONTHLY', dateTime: `1970-01-01T${this.horaMensal}:00`, dayOfMonth: this.diaMes };
        break;
    }

    console.log("Payload para enviar:", payload);
    // Aqui você chamaria o serviço que envia esses dados para o backend
  }

}
