import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { canActivatedGuard, canMatchGuard } from './auth/guards/auth.guard';
import { canMatchPublicGuard } from './auth/guards/public.guard';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canMatch: [ canMatchPublicGuard ]
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule),
    canMatch: [canMatchGuard],
    canActivate: [canActivatedGuard]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'     //redireccionamos a heroes si y solo si el path es vacio (localhost:4200/)
  },
  {
    path: '**',           //redireccionamos a page error si colocamos una url invalida
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
