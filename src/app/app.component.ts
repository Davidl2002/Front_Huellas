import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  shouldShowSidebar(): boolean {
    // Obtener la ruta activa
    const currentRoute = this.router.url;
    // Verificar si la ruta es la página principal, si es así, no mostrar el sidebar
    return currentRoute !== '/';
  }
}
