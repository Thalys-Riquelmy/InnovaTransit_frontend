import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonHeader, IonTitle, IonMenu, IonToolbar, IonContent, IonButtons, IonMenuButton, IonIcon, IonButton, IonItem, IonList, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonGrid, IonCol, IonRow, IonInput, IonRouterLink, IonApp, IonFab, IonFabButton, IonToast } from "@ionic/angular/standalone";
import { MotoristaService } from 'src/app/services/motorista-service/motorista.service';
import { Motorista } from 'src/app/models/motorista';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';
import { FolhaServico } from 'src/app/models/folha-servico';


@Component({
  selector: 'app-iniciar-jornada',
  templateUrl: './iniciar-jornada.component.html',
  styleUrls: ['./iniciar-jornada.component.scss'],
  imports: [IonToast, IonFabButton, IonFab, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, 
    IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet
  ],
  standalone: true
})
export class IniciarJornadaComponent {

  //Injeções
  fb = inject (FormBuilder);
  motoristaService = inject (MotoristaService);
  folhaServicoService = inject (FolhaServicoService);
  router = inject (Router);
  //Formularios
  formGroup: FormGroup;
  //Outros
  email = '';
  motorista: Motorista | null = null; 
  folhaServico: FolhaServico | null = null;
  dataServico: string = this.formatarData(new Date());
  //Mensagens
  showToast = false; // Variável para controlar o Toast
  toastMessage = ''; // Variável para a mensagem do Toast

  constructor() { 
    this.formGroup = this.fb.group({
      //Motorista
      nome: [''],
      matricula: 0,
      //Veiculo
      numeroVeiculo: 0,
      hodometro: 0,
      catraca: 0,
      //Folha-Serviço
      horaInicial: [''],
      horaFinal: [''],
      horarioInicial: [''],
      horarioFinal: [''],
      id: [''],
    });
    this.email = localStorage.getItem('email') || ''; 
    console.log('Email recuperado do localStorage:', this.email); // Console log para verificar o email
    this.buscarMotoristaPorEmail();
    setTimeout(() => {
      console.log('Executando ação após 2 segundos'); 
      this.buscarFolha();
    }, 500);
  }

  buscarMotoristaPorEmail() {
    this.motoristaService.buscarMotoristaPorEmail(this.email).subscribe({
      next: (data) => {
        this.motorista = data; // Armazena o motorista encontrado
        // Preenche os campos do formulário com os dados do motorista
      this.formGroup.patchValue({
        nome: data.nome,
        matricula: data.matricula,
      });
        console.log('Motorista encontrado:', this.motorista);
      },
      error: (err) => {
        console.error('Erro ao buscar motorista:', err);
      }
    });
  }

  // Método para formatar a data no formato 'YYYY-MM-DD'
  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  buscarFolha() {
    if (this.motorista?.matricula !== undefined && this.dataServico) {
      this.folhaServicoService.buscarFolhaServico(this.motorista.matricula, this.dataServico).subscribe(
        (data: FolhaServico) => {
          this.folhaServico = data;
          this.formGroup.patchValue({
            id: data.id,
            horaInicial: data.horaInicial,
            horaFinal: data.horaFinal,
            horarioInicial: data.horarioInicial,
            horarioFinal: data.horarioFinal,
            numeroVeiculo: data.veiculo.numeroVeiculo,
            hodometro: data.veiculo.hodometro,
            catraca: data.veiculo.catraca,
          });

        },
        (error) => {
          console.error('Erro ao buscar folha de serviço:', error);
          this.folhaServico = null; // ou algum tratamento adicional
        }
      );
    } else {
      console.error('Matricula ou dataServico não estão definidos.');
      // Aqui você pode adicionar um tratamento para quando a matrícula ou dataServico não estiverem definidos
    }
  }
  
  iniciarJornada() {
    const agora = new Date();
    const horas = agora.toTimeString().split(' ')[0]; // Extrai a hora no formato 'HH:mm:ss'
    this.formGroup.get('horaInicial')?.patchValue(horas);
    console.log(horas);
  
    // Verifica se a folha de serviço está preenchida
    if (this.formGroup.value.id) {
      this.folhaServicoService.iniciarFolhaDeServico(this.formGroup.value.id, horas).subscribe({
        next: (response) => {
          this.toastMessage = 'Jornada iniciada com sucesso!';
          this.showToast = true;
          this.router.navigate(['/motorista/finalizar-tarefa']);
        },
        error: (error) => {
          console.error('Erro ao iniciar folha de serviço', error);
        }
      });
    } else {
      console.error('ID da folha de serviço não encontrado.');
    }
  }

  finalizarJornada() {
    const agora = new Date();
    const horas = agora.toTimeString().split(' ')[0]; // Extrai a hora no formato 'HH:mm:ss'
    this.formGroup.get('horaFinal')?.patchValue(horas);
    console.log(horas);
  
    // Verifica se a folha de serviço está preenchida
    if (this.formGroup.value.id) {
      this.folhaServicoService.finalizarFolhaDeServico(this.formGroup.value.id, horas).subscribe({
        next: (response) => {
          this.toastMessage = 'Jornada finalizada com sucesso!';
          this.showToast = true;
        },
        error: (error) => {
          console.error('Erro ao finalizar folha de serviço', error);
        }
      });
    } else {
      console.error('ID da folha de serviço não encontrado.');
    }
  }  

}
