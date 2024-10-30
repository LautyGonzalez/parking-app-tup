import { inject, Injectable } from '@angular/core';
import { Cochera } from '../interfaces/cochera';
import { DataAuthService } from './data-auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root',
})
export class DataCocherasService {
  cocheras: Cochera[] = [];
  estacionamientos: Estacionamiento[] = [];
  authService = inject(DataAuthService);
  private cocheraImages: Map<number, string> = new Map();

  constructor() {
    this.loadData();
  }

  autos: string[] = [
    'assets/autos/Auto1.svg',
    'assets/autos/Auto2.svg',
    'assets/autos/Auto3.svg',
    'assets/autos/Auto4.svg',
    'assets/autos/Auto4.svg',
    'assets/autos/Auto6.svg',
    'assets/autos/Auto7.svg',
  ];

  async loadData() {
    await this.getEstacionamientos();

    await this.getCocheras();

    this.asociarEstacionamientosConCocheras();
  }

  async getCocheras() {
    const res = await fetch('http://localhost:4000/cocheras', {
      headers: {
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
    });
    if (res.status !== 200) return;
    const resJson: Cochera[] = await res.json();
    this.cocheras = resJson;
    this.cocheras = resJson.map((cochera) => {
      const existingCochera = this.cocheras.find(c => c.id === cochera.id);
      const estacionamiento = this.estacionamientos.find(e => e.idCochera === cochera.id);
      
      return {
        ...cochera,
        img: this.getOrCreateImage(cochera.id),
        estacionamiento: estacionamiento || existingCochera?.estacionamiento,
        deshabilitada: estacionamiento ? 1 : 0
      };
    });
  }

  async getEstacionamientos() {
    const res = await fetch('http://localhost:4000/estacionamientos', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: Estacionamiento[] = await res.json();
    this.estacionamientos = resJson;
    console.log(this.estacionamientos);
  }

  private getOrCreateImage(cocheraId: number): string {
    // Si la cochera ya tiene una imagen asignada, la devuelve
    if (this.cocheraImages.has(cocheraId)) {
      return this.cocheraImages.get(cocheraId)!;
    }
    // Si no tiene imagen, crea una nueva y la guarda
    const newImage = this.AutoRandom();
    this.cocheraImages.set(cocheraId, newImage);
    return newImage;
  }

  asociarEstacionamientosConCocheras() {
    this.cocheras = this.cocheras.map((cochera) => {
      const estacionamiento = this.estacionamientos.find(
        (e) => e.idCochera === cochera.id
      );

      // Mantener imagen existente si ya está ocupada
      const img = this.getOrCreateImage(cochera.id);

      // Asegurarse de no cambiar el estado deshabilitado si ya está ocupado
      const deshabilitada = estacionamiento ? 1 : 0;

      return {
        ...cochera,
        estacionamiento,
        img,
        deshabilitada,
      };
    });

    console.log(this.cocheras);
  }

  ultimoNumero = this.cocheras[this.cocheras.length - 1]?.id || 0;
  //ultimoNumero = this.cocheras.length === 0 ? 0 : this.cocheras[this.cocheras.length-1].numero;

  async agregarCochera() {
    const cochera = { descripcion: 'Agregada por WebApi' };
    const res = await fetch('http://localhost:4000/cocheras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
      body: JSON.stringify(cochera),
    });
    if (res.status !== 200) {
      console.log('Error en la creacion de una nueva cochera');
    } else {
      console.log('Creacion de cochera exitosa');
      const currentEstacionamientos = [...this.estacionamientos];
    
    // Obtenemos solo las cocheras nuevas
    await this.getCocheras();
    
    // Restauramos los estacionamientos
    this.estacionamientos = currentEstacionamientos;
    
    // Reasociamos todo
    this.asociarEstacionamientosConCocheras();
    }
  }

  async borrarFila(index: number) {
    const res = await fetch(`http://localhost:4000/cocheras/${index}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
    });
    if (res.status !== 200) {
      console.log('Error en la eliminacion de la cochera');
    } else {
      console.log('Cochera eliminada con exito');
      this.loadData();
    }
  }

  async deshabilitarCochera(idCochera: number) {
    const res = await fetch(
      'http://localhost:4000/cocheras/' + idCochera + '/disable',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      }
    );
    if (res.status !== 200) {
      console.log('Error en la Deshabilitacion de la cochera');
    } else {
      console.log('Cochera Deshabilitada con exito');
      this.loadData();
    }
  }

  habilitarCochera(index: number) {
    this.cocheras[index].deshabilitada = 0;
  }

  async abrirEstacionamiento(
    patente: string,
    idUsuarioIngreso: string,
    idCochera: number,
    index: number
  ) {
    const img = this.getOrCreateImage(idCochera);
    const body = { patente, idUsuarioIngreso, idCochera, img };
    const res = await fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      console.log('Error en abrir estacionamiento');
    } else {
      console.log('Creacion de estacionamiento exitoso');
      this.cocheras[index].deshabilitada = 1;
      this.loadData();
    }
  }

  async cerrarEstacionamiento(patente: string, idUsuarioEgreso: string) {
    const body = { patente, idUsuarioEgreso };
    const res = await fetch('http://localhost:4000/estacionamientos/cerrar', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      console.log('Error en el cerrado del estacionamiento');
    } else {
      console.log('Cerrado del estacionamiento exitoso');
      console.log(res);
      this.loadData();
    }
  }

  AutoRandom() {
    const imgRandom = Math.floor(Math.random() * this.autos.length);
    console.log('Imagen seleccionada:', this.autos[imgRandom]);
    return this.autos[imgRandom];
  }
}
