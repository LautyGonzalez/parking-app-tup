import { inject, Injectable } from '@angular/core';
import { Tarifa } from '../interfaces/tarifa';
import { DataAuthService } from './data-auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataTarifasService {
  tarifas: Tarifa[] = [];
  authService = inject(DataAuthService);

  constructor() {}

  async getTarifas(): Promise<Tarifa[]> {
    const res = await fetch('http://localhost:4000/tarifas', {
      headers: {
        authorization: 'Bearer ' + this.authService.usuario?.token
      },
    });
    if (res.status !== 200) {
      console.log("Error");
      return []; // Devuelve un array vacío en caso de error
    } else {
      this.tarifas = await res.json();
      return this.tarifas; // Devuelve las tarifas
    }
  }

  async updateTarifa(idTarifa: string, valorTarifa: number): Promise<void> {
    // Asegúrate de que valorTarifa sea un número y que idTarifa no sea nulo
    if (!idTarifa || valorTarifa === undefined || valorTarifa === null) {
      console.log("ID o valor de tarifa no válidos.");
      return;
    }
  
    const res = await fetch(`http://localhost:4000/tarifas/${idTarifa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.authService.usuario?.token // Asegúrate de que el token sea válido
      },
      body: JSON.stringify({ valor: valorTarifa })
    });
  
    if (!res.ok) {
      const errorText = await res.text(); // Obtiene el mensaje de error
      console.log(`Error al actualizar la tarifa: ${res.status} - ${errorText}`);
      throw new Error(`Error ${res.status}: ${errorText}`); // Lanza un error con información más detallada
    } else {
      console.log("Tarifa actualizada correctamente");
    }
  }
  
}
