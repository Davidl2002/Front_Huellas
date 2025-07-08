import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) { }

  goToInfo() {
    this.router.navigate(['/info']);
  }

  goToUserInfo() {
    this.router.navigate(['/user-info']);
  }

  goToHome() {
    this.router.navigate(['/']); // Esto redirige a la ruta principal
  }
}
