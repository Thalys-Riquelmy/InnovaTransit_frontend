import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCol, IonRow, IonButton, IonGrid, IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonLabel, IonCardSubtitle, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonCardSubtitle, IonLabel, IonItem, IonInput, IonCardContent, IonCardHeader, IonCard, IonGrid, IonButton, 
    IonRow, IonCol, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonContent, RouterOutlet
  ],
})
export class HomePage {
  constructor() {}
}
