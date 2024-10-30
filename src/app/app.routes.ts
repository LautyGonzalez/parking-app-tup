import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ParkingStatusComponent } from './pages/parking-status/parking-status.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardContainerComponent } from './pages/dashboard-container/dashboard-container.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { soloPublicoGuard } from './guards/solo-publico.guard';
import { soloAdminGuard } from './guards/solo-admin.guard';
import { soloLogueadoGuard } from './guards/solo-logueado.guard';
import { RegisterComponent } from './pages/register/register.component';
import { PreciosComponent } from './pages/precios/precios.component';

export const routes: Routes = [
  {
    path: "",
    component: DashboardContainerComponent,
    canActivate: [soloLogueadoGuard],
    children:[
      {
          path: "parking-status",
          component: ParkingStatusComponent,
      },
      {
        path: "reportes",
        component: ReportesComponent,
        canActivate: [soloAdminGuard]
      },
      {
        path: "precios",
        component: PreciosComponent,
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [soloPublicoGuard]
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [soloPublicoGuard]
  },
  {
    path: "parking-status",
    component: ParkingStatusComponent,
  },
  
  // {
  //   path: "",
  //   redirectTo: "login",
  //   pathMatch: "full"
  // },
  {
    path: "not-found",
    component: NotFoundComponent
  },
  {
    path: "**",
    redirectTo: "not-found",
    pathMatch: "full"
  }
];
