import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor'; // Ajuste o caminho conforme necessário
import { Storage } from '@ionic/storage-angular'; // Importa o serviço de Storage do Ionic

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppComponent {
  constructor(private storage: Storage) {
    this.initStorage(); // Inicializa o armazenamento do Ionic
  }

  // Método para inicializar o Storage
  private async initStorage() {
    await this.storage.create(); // Cria a instância do storage
  }
}
