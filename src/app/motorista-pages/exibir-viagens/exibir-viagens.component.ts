import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonHeader, IonTitle, IonMenu, IonToolbar, IonContent, IonButtons, IonMenuButton, IonIcon, IonButton, IonItem, IonList, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonGrid, IonCol, IonRow, IonInput, IonRouterLink, IonApp, IonLabel, IonRefresherContent, IonRefresher } from "@ionic/angular/standalone";
import { FolhaServico } from 'src/app/models/folha-servico';
import { Motorista } from 'src/app/models/motorista';
import { Tarefa } from 'src/app/models/tarefa';
import { AuthService } from 'src/app/services/auth.service';
import { FolhaServicoService } from 'src/app/services/folha-servico-service/folha-servico.service';
import { MotoristaService } from 'src/app/services/motorista-service/motorista.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-exibir-viagens',
  templateUrl: './exibir-viagens.component.html',
  styleUrls: ['./exibir-viagens.component.scss'],
  imports: [IonRefresher, IonRefresherContent, IonLabel, IonApp, IonRouterLink, IonInput, IonRow, IonCol, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonButton, IonIcon, 
    IonHeader, IonTitle, IonMenu, IonContent, IonToolbar, IonButtons, IonMenuButton, ReactiveFormsModule, RouterLink, CommonModule, RouterOutlet
  ],
  standalone: true
})
export class ExibirViagensComponent {
  //Injeções
  fb = inject (FormBuilder);
  motoristaService = inject (MotoristaService);
  authService = inject (AuthService);
  folhaServicoService = inject (FolhaServicoService);

  //Formularios
  formGroup: FormGroup;

  //Outros
  motorista: Motorista | null = null; // Corrigido
  folhaServico: FolhaServico | null = null;
  dataServico: string = this.formatarData(new Date());
  listaDeTarefas : Tarefa [] = [];
  email = "";

  constructor() {
    this.formGroup = this.fb.group({
      //Motorista
      nome: [''],
      matricula: [0],
      //Veiculo
      veiculo: ['', [Validators.required]],
      numeroVeiculo: 0,
      hodometro: 0,
      catraca: 0,
      //Folha-Serviço
      id: [''],
      observacao: [''],
      dataServico: [''],
      horaInicial: [''],
      horaFinal: [''],
      horarioInicial: [''],
      horarioFinal: [''],
      finalizada: false,
      //Tarefas
      idTarefa : 0,
      evento: [''],
      horarioFim: [''],
      horarioInicio: [''],
      horaFim: [''],
      horaInicio: [''],
      motivoCancelamento: [''],
      hodometroInicial: [''],
      hodometroFinal: [''],
      catracaInicial: [''],
      catracaFinal: [''],
      cancelado: false,                                          
      //
      folhaServico: [''],
      tarefa: [''],
      codigo: ['']
    });
    // Recupera o email do localStorage e o atribui à variável email
    this.email = localStorage.getItem('email') || ''; // Pega o email ou define como vazio
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
          this.listaDeTarefas = data.tarefas;
          console.log(this.listaDeTarefas)
          this.formGroup.patchValue({
            id: data.id,
            observacao: data.observacao,
            dataServico: data.dataServico,
            horaInicial: data.horaInicial,
            horaFinal: data.horaFinal,
            horarioInicial: data.horarioInicial,
            horarioFinal: data.horarioFinal,
            finalizada: data.finalizada,
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
  
  gerarPDF() {
    const doc = new jsPDF();
    // Título
    doc.setFontSize(16); // Tamanho do título
    const title = 'Relatório de Folha de Serviço';
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2; // Centraliza o título
    doc.text(title, titleX, 15);
  
    // Definindo o tamanho da fonte para as informações do motorista
    doc.setFontSize(10); // Tamanho da fonte menor para as informações
  
    // Subtítulo com informações do motorista e folha de serviço
    const veiculo = `Veículo: ${this.formGroup.get('numeroVeiculo')?.value}`;
    const horaInicial = `Hora Inicial: ${this.formGroup.get('horaInicial')?.value}`;
    const horaFinal = `Hora Final: ${this.formGroup.get('horaFinal')?.value}`;
    const matricula = `Matrícula: ${this.formGroup.get('matricula')?.value}`;
    const folhaServico = `Folha Serviço: ${this.formGroup.get('id')?.value}`;
    const nome = `Nome: ${this.formGroup.get('nome')?.value}`;
  
    // Ajustando o espaçamento entre as informações
    const lineHeight = 5; // Espaçamento reduzido entre as linhas
    doc.text(veiculo, 14, 25);
    doc.text(horaInicial, 100, 25);  // Posiciona na mesma linha
    doc.text(horaFinal, 14, 30); // Nova linha
    doc.text(matricula, 100, 30); // Nova linha
    doc.text(folhaServico, 14, 35); // Nova linha
    doc.text(nome, 100, 35); // Nova linha
  
    // Tabela de Tarefas
    const head = [['Evento', 'Início Programado', 'Fim Programado', 'Início Real', 'Fim Real']];
    const body = this.listaDeTarefas.map(tarefa => [
      tarefa.evento,
      tarefa.horarioInicio,
      tarefa.horarioFim,
      tarefa.horaInicio,
      tarefa.horaFim
    ]);
  
    (doc as any).autoTable({
      head: head,
      body: body,
      startY: 45,  // Posição inicial da tabela ajustada para o novo espaçamento
      styles: { fontSize: 10 },  // Fonte para a tabela
      headStyles: { fillColor: [22, 160, 133] },  // Estilo do cabeçalho
      margin: { top: 10 }  // Margem da tabela
    });
  
    // Adicionando Assinatura Eletrônica no rodapé
    const footerY = doc.internal.pageSize.getHeight() - 20; // Posição do rodapé a 20mm do fundo
    doc.setFontSize(10); // Tamanho da fonte aumentado para o rodapé
    const assinaturaText = 'Assinatura Eletrônica';
    const assinaturaWidth = doc.getTextWidth(assinaturaText);
    const assinaturaX = (pageWidth - assinaturaWidth) / 2; // Centraliza a assinatura
    doc.text(assinaturaText, assinaturaX, footerY);
  
    // Centraliza o nome do usuário no rodapé
    const nomeUsuario = this.formGroup.get('nome')?.value; // Nome do usuário
    const nomeWidth = doc.getTextWidth(nomeUsuario);
    const nomeX = (pageWidth - nomeWidth) / 2; // Centraliza o nome do usuário
    doc.text(nomeUsuario, nomeX, footerY + 5); // Nome na linha de baixo
  
    // Salvar PDF
    doc.save('Folha_Serviço.pdf');
  }

  handleRefresh(event: CustomEvent) {
    this.buscarMotoristaPorEmail();
    this.buscarFolha();
    setTimeout(() => {
      // Qualquer chamada de carregamento de dados pode ser colocada aqui
      event.detail.complete();  // Completa a ação de refresh
    }, 2000);
  }  
  
}
