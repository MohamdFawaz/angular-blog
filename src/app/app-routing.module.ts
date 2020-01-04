import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ShowPostComponent } from './show-post/show-post.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
// Run ShowPostComponent

const routes: Routes = [
  {path: '' , component: ShowPostComponent, canActivate: [AuthGuard] }, // Show ShowPostComponent on url directory /
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
