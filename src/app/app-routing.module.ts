import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InfoComponent } from './info/info.component';
import { UserInfoComponent } from './user-info/user-info.component';

const routes: Routes = [
  { path: '', component: LoginComponent },  // Página principal (login)
  { path: 'sidebar', component: SidebarComponent },  // Ruta para el Sidebar
  { path: 'info', component: InfoComponent },  // Ruta para la info
  { path: 'user-info', component: UserInfoComponent },  // Ruta para la info de usuario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
