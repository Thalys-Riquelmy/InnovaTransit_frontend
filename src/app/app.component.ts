import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonItem, IonHeader, IonToolbar, IonMenu, IonTitle, IonContent, IonList } from '@ionic/angular/standalone';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor'; // Ajuste o caminho conforme necessário
import { Storage } from '@ionic/storage-angular'; // Importa o serviço de Storage do Ionic
import { SyncService } from './services/storage-service/sync.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonList, IonContent, IonTitle, IonToolbar, IonHeader, IonItem, CommonModule, IonApp, IonMenu, IonRouterOutlet, RouterLink, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppComponent implements OnInit{

  isMotorista: boolean = false;
  isGerente: boolean = false;

  private syncService = inject(SyncService);
  private router = inject (Router);

  constructor(private storage: Storage) {
    this.initStorage(); // Inicializa o armazenamento do Ionic
  }

  // Método para inicializar o Storage
  private async initStorage() {
    await this.storage.create(); // Cria a instância do storage
  }

  ngOnInit() {
    // Verifica a URL atual para definir qual menu mostrar
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.isMotorista = currentUrl.startsWith('/motorista');
      this.isGerente = currentUrl.startsWith('/gerente');
    });
  }

}
