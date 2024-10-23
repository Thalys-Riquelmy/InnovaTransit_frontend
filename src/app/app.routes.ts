import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/login', component: LoginComponent
  },
  {
    path: 'gerente', loadChildren: () => import('./gerente-pages/gerente-pages-routing.module').then((m) => m.GerentePagesRoutingModule)
  },
  {
    path: 'motorista', loadChildren: () => import ('./motorista-pages/motorista-pages-routing.module').then((m) => m.MotoristaPagesRoutingModule)
  }
];
