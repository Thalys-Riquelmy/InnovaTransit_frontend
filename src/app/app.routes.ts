import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component'; 
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
    { path: 'auth/login', component: LoginComponent },
    {
      path: 'motorista',
      loadChildren: () => import('./motorista-pages/motorista-pages.module').then(m => m.MotoristaPagesModule),
      canActivate: [AuthGuard], // Protege a rota com o AuthGuard
    },
    {
      path: 'gerente',
      loadChildren: () => import('./gerente-pages/gerente-pages.module').then(m => m.GerentePagesModule),
      canActivate: [AuthGuard],
    },
    { path: '**', redirectTo: 'auth/login' } // Redireciona qualquer outra rota para login
  ];
  
  export default routes;
  