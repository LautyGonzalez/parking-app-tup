import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DataCocherasService } from '../../services/data-cocheras.service';
import { DataAuthService } from '../../services/data-auth.service';

@Component({
  selector: 'app-parking-status',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterOutlet],
  templateUrl: './parking-status.component.html',
  styleUrl: './parking-status.component.scss',
})

export class ParkingStatusComponent {
  authService = inject(DataAuthService);
  router = inject(Router)

  esAdmin = true;
  
  dataCocherasService = inject(DataCocherasService);

constructor(){
  this.cocheras = this.dataCocherasService.cocheras
}

  titulo = 'Estado Cochera';

  autos: string[] = [
    'assets/autos/Auto1.svg',
    'assets/autos/Auto2.svg',
    'assets/autos/Auto3.svg',
    'assets/autos/Auto4.svg',
    'assets/autos/Auto4.svg',
    'assets/autos/Auto6.svg',
    'assets/autos/Auto7.svg',
  ];

  cocheras: Cochera[] = [
  ];

  actualizarCochera() {
    this.dataCocherasService.actualizarCochera();
  }

  deshabilitarCochera(index:number){
    this.dataCocherasService.deshabilitarCochera(index)
  }

  // habilitarCochera(index:number){
  //   this.dataCocherasService.habilitarCochera(index)
  // }

  agregarAuto(numero:number) {
    Swal
    .fire({
        title: "Ingrese la patente",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
            let nombre = resultado.value;
            this.dataCocherasService.agregarAuto(nombre, numero)
        }
    });
  }

  editarAuto(){
    Swal.fire({
      title: "The Internet?",
      text: "That thing is still around?",
    });
  }

  agregarCochera() {
    Swal.fire({
      title: "Desea agregar un nuevo espacio?",
      showDenyButton: true,
      confirmButtonText: "Agregar nuevo espacio",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var descripcion = "Hardcodeadisimo pa"
        const estacionamientoData = {descripcion}
        const res = await this.dataCocherasService.agregarCochera(estacionamientoData)
        console.log(res)
        if(res?.statusText === "OK") this.router.navigate(['/parking-status']).then(() => {
          Swal.fire("Cochera Agregada!", "", "success");
          console.log(this.dataCocherasService.getCocheras())
        })
      } else if (result.isDenied) {
        Swal.fire("Cochera no agregada", "", "info");
      }
    });
  }

  eliminarCochera(cocheraId: number) {
    Swal.fire({
      title: 'Seguro que quierer borrar el estacionamiento ' + cocheraId + '?',
      text: "No podras revertirlo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      customClass: {
        title: "customModal"
      },
    }).then(async(result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Borrado!',
          text: 'La cochera a sido eliminada',
          icon: 'success',
        });
        this.dataCocherasService.eliminarCocheras(cocheraId)
      }
    });
  }
}

  