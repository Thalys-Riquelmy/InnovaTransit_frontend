import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'url-servico',
    pathMatch: 'full',
  },
  {
    path: 'auth/login', component: LoginComponent
  },
  {
    path: 'url-servico', component: HomePage
  },
  {
    path: 'gerente', loadChildren: () => import('./gerente-pages/gerente-pages-routing.module').then((m) => m.GerentePagesRoutingModule)
  },
  {
    path: 'motorista', loadChildren: () => import ('./motorista-pages/motorista-pages-routing.module').then((m) => m.MotoristaPagesRoutingModule)
  }
];
