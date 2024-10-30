import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DataAuthService } from '../../services/data-auth.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  esAdmin= true;
  mostrarDropdown = false;
  authService = inject(DataAuthService)
  router = inject(Router)

  cerrarSesion(){
    this.authService.usuario = undefined
    localStorage.removeItem("authToken")
    this.router.navigate(['/login'])
  }
}
