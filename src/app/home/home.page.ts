import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCol, IonRow, IonButton, IonGrid, IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonLabel, IonCardSubtitle, IonIcon, IonToast } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage-service/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonToast, 
    IonIcon, IonCardSubtitle, IonLabel, IonItem, IonInput, IonCardContent, IonCardHeader, IonCard, IonGrid, IonButton, 
    IonRow, IonCol, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonContent, RouterOutlet, CommonModule, FormsModule
  ],
})
export class HomePage implements OnInit{
  
  urlServidor: string = ''; // Variável para armazenar a URL inserida pelo usuário
  
  //Mensagens
  showToast = false; // Variável para controlar o Toast
  toastMessage = ''; // Variável para a mensagem do Toast

  //Injeções
  storageService = inject (StorageService);
  router = inject (Router);

  // Método chamado quando o componente é inicializado
  async ngOnInit() {
    try {
      // Verificar se já existe uma URL salva no IndexedDB
      const servidor = await this.storageService.getServidor();

      if (servidor && servidor.url_servidor) {
        // Se a URL do servidor já estiver salva, redireciona para a tela de login
        console.log('URL do servidor encontrada:', servidor.url_servidor);
        this.router.navigate(['/auth/login']); // Redireciona para a tela de login
      } else {
        console.log('Nenhuma URL do servidor encontrada');
      }
    } catch (error) {
      console.error('Erro ao verificar a URL do servidor no IndexedDB:', error);
    }
  }

  // Método chamado quando o formulário é enviado
  async onSubmit() {
    if (this.urlServidor) {
      try {
        // Salvar a URL no IndexedDB
        await this.storageService.saveServidor(this.urlServidor);
        this.toastMessage = 'URL do servidor salva com sucesso!';
        this.showToast = true;
        this.router.navigate(['/auth/login']);
      } catch (error) {
        this.toastMessage = 'Erro ao salvar a URL do servidor:', error;
        this.showToast = true;
      }
    } else {
      this.toastMessage = 'URL do servidor é obrigatória';
      this.showToast = true;
      return;
    }
  }   
}
