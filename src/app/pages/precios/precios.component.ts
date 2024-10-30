import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTarifasService } from '../../services/data-tarifa.service';
import { Tarifa } from '../../interfaces/tarifa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.scss'
})
export class PreciosComponent {
  dataTarifaService = inject(DataTarifasService)
  tarifas: Tarifa[] = []

  async ngOnInit() {
    this.tarifas = await this.dataTarifaService.getTarifas();
  }

  async editarTarifa(idTarifa: string) {
    const { value: precioTarifa } = await Swal.fire({
      title: "Editar Tarifa",
      input: 'text',
      inputLabel: 'Ingrese el nuevo valor de la tarifa',
      inputPlaceholder: 'Ejemplo: 110',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("Por favor, ingrese un valor válido");
          return;
        }
        // Asegúrate de convertir el valor a número
        const parsedValue = parseFloat(inputValue);
        if (isNaN(parsedValue)) {
          Swal.showValidationMessage("El valor ingresado debe ser un número.");
          return;
        }
        return parsedValue; // Devuelve el nuevo valor como número
      }
    });
  
    if (precioTarifa) {
      await this.dataTarifaService.updateTarifa(idTarifa, precioTarifa); // Envía el idTarifa y el precioTarifa al actualizar
    }
  }
  
}
