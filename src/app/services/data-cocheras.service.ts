import { inject, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Cochera } from '../interfaces/cochera';
import { DataAuthService } from './data-auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento'

@Injectable({
  providedIn: 'root'
})
export class DataCocherasService {
  cocheras: Cochera[] = [];
  authService = inject(DataAuthService);

  constructor(){
    this.getCocheras()
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

  // dataCocherasService = inject(DataCocherasService)

  // constructor(){
  //   this.getCocheras()
  // }

  // async getCocheras(){
  //   const res = await fetch('http://localhost:4000/cocheras',{
  //     headers: {
  //       authorization:'Bearer '+this.authService.usuario?.token
  //     },
  //   })
  //   if(res.status !== 200) return;
  //   const resJson:Cochera[] = await res.json();
  //   this.cocheras = resJson;
  // }

  actualizarCochera() {
    this.cocheras = [];
  }

  ultimoNumero = this.cocheras[this.cocheras.length-1]?.numero || 0;
  // agregarCochera() {
  //   this.cocheras.push({
  //     img: this.AutoRandom(),
  //     numero: this.ultimoNumero + 1,
  //     disponible: true,
  //     ingreso: '-',
  //     acciones: '-',
  //   });
  // this.ultimoNumero++;
  
  // }

  async agregarCochera(estacionamientoData: Estacionamiento) {
    const cochera = {"descripcion": "Agregada por web api"}
    const res = await fetch('http://localhost:4000/cocheras',{
      method: 'POST',
      headers: {
        'Content-type':'application/json',
        authorization:'Bearer '+this.authService.usuario?.token
      },
      body: JSON.stringify(cochera)
    })

    if(res.status !== 200) return;
    await this.getCocheras()
    console.log(res)
    return res
  }

  async getCocheras(){
    const res = await fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + this.authService.usuario?.token
      }
    });
    
    if(res.status !== 200) return;
    const resJson:Cochera[] = await res.json()
    this.cocheras = resJson
    console.log(this.cocheras)
}




  agregarAuto(nombre:string, numero:number) { //ESTA FUNCION TENDRIA QUE SER AGREGAR AUTO NO COCHERA
    if(this.cocheras[numero]){
      this.cocheras[numero].ingreso = nombre
      this.cocheras[numero].disponible = false
    }
  //   this.cocheras.push({
  //     img: this.AutoRandom(),
  //     numero: this.ultimoNumero + 1,
  //     disponible: true,
  //     ingreso: nombre,
  //     acciones: '-',
  //   });
  // this.ultimoNumero++;
  }

  // deshabilitarCochera(numero:number){
  //   this.cocheras.deshabilitarCochera(numero)
  // }

  async eliminarCocheras(index: number) {
    const res = await fetch(`http://localhost:4000/cocheras/${index}` ,{
      method: 'DELETE',
      headers: {
        'Content-type':'application/json',
        authorization:'Bearer '+this.authService.usuario?.token
      }
    })

    if(res.status !== 200){
      console.log('Error en la eliminacion de la cochera')
    } else {
      console.log("cochera eliminada")
      this.getCocheras()
    }

  }

  deshabilitarCochera(index:number){
    this.cocheras[index].disponible = true;
  }



  AutoRandom() {
    const imgRandom = Math.floor(Math.random() * this.autos.length);
    console.log(imgRandom);
    return this.autos[imgRandom];
  }

}
  