// Santiago Pereyra - 245198
class Donante {
  constructor(nombre, direccion, telefono, cantidad = 0) {
    this.nombre = nombre;
    this.direccion = direccion;
    this.telefono = telefono;
    this.cantidad = cantidad;
  }
  toString() {
    return this.nombre + " (" + this.direccion + ", " + this.telefono + ")";
  }
}

class Donacion {
  constructor(donante, modo, monto, comentarios = "") {
    this.donante = donante;
    this.modo = modo;
    this.monto = monto;
    this.comentarios = comentarios;
  }

  ordenarDonacionesDecre(otro) {
    let dif = otro.monto - this.monto;
    if (dif === 0) {
      dif = otro.donante.localeCompare(this.donante);
    }
    return dif;
  }

  ordenarDonacionesCreciente(otro) {
    let dif = this.monto - otro.monto;
    if (dif === 0) {
      dif = this.donante.localeCompare(otro.donante);
    }
    return dif;
  }
}

class Sistema {
  constructor() {
    this.listaDonantes = [];
    this.listaDonaciones = [];
  }

  agregarDonante(unElemento) {
    this.listaDonantes.push(unElemento);
    this.listaDonantes.sort();
  }

  darTodosDonantes() {
    return this.listaDonantes;
  }

  existeDonante(nombre) {
    let existe = false;
    let nombreLower = nombre.toLowerCase();
    for (let i = 0; i < this.listaDonantes.length && !existe; i++) {
      if (this.listaDonantes[i].nombre.toLowerCase() == nombreLower) {
        existe = true;
      }
    }
    return existe;
  }

  agregarDonacion(unElemento) {
    this.listaDonaciones.push(unElemento);
  }

  darDonaciones() {
    this.listaDonaciones.sort(function (a, b) {
      return a.ordenarDonacionesDecre(b);
    });
    return this.listaDonaciones;
  }

  darDonacionesCreciente() {
    this.listaDonaciones.sort(function (a, b) {
      return a.ordenarDonacionesCreciente(b);
    });
    return this.listaDonaciones;
  }

  promedioDonaciones() {
    if (this.listaDonaciones.length > 0) {
      let suma = 0;
      for (let i = 0; i < this.listaDonaciones.length; i++) {
        suma += this.listaDonaciones[i].monto;
      }
      return parseInt(suma / parseInt(this.listaDonaciones.length));
    }
    return 0;
  }

  cantidadDonaciones() {
    return this.listaDonaciones.length;
  }

  cantidadModo(modo = "efectivo") {
    let cantidad = 0;
    for (let i = 0; i < this.listaDonaciones.length; i++) {
      if (this.listaDonaciones[i].modo.toLowerCase() == modo.toLowerCase()) {
        cantidad++;
      }
    }
    return cantidad;
  }
  montoDonacionMayor() {
    if (!this.darDonaciones().length > 0) {
      return 0;
    }
    return this.darDonaciones()[0].monto;
  }

  montoTotalGeneral() {
    let cantidad = 0;
    for (let i = 0; i < this.listaDonaciones.length; i++) {
      cantidad += this.listaDonaciones[i].monto;
    }
    return cantidad;
  }
  masVecesDono() {
    if (this.listaDonaciones.length == 0) {
      return "";
    }
    let map = {};
    let masVeces = this.listaDonaciones[0],
      maxCount = 1;
    for (let i = 0; i < this.listaDonaciones.length; i++) {
      let el = this.listaDonaciones[i];
      if (map[el.donante] == null) {
        map[el.donante] = 1;
      } else {
        map[el.donante]++;
      }
      if (map[el.donante] > maxCount) {
        masVeces = el;
        maxCount = map[el.donante];
      }
    }
    let ordenable = Object.entries(map).sort((a, b) => b - a);
    let result = false;
    let resultado = [];
    if (ordenable.length > 1 && ordenable[0][1]==maxCount) {
      for (let i = 0; i < ordenable.length - 1; i++) {
        if (ordenable[i][1] === ordenable[i + 1][1]) {
          let posicionCortarNombreUno = ordenable[i][0].search(/\(/g);
          let donadorUno = ordenable[i][0].substr(0, posicionCortarNombreUno);
          let posicionCortarNombreDos = ordenable[i + 1][0].search(/\(/g);
          let donadorDos = ordenable[i + 1][0].substr(
            0,
            posicionCortarNombreDos
          );
          if (!resultado.includes(donadorUno.trim())) {
            resultado.push(donadorUno.trim());
          }
          if (!resultado.includes(donadorDos.trim())) {
            resultado.push(donadorDos.trim());
          }
          result = true;
        }
      }
      if (result) {
        return resultado.toString();
      }
    }

    let cortar = masVeces.donante.search(/\(/g);
    let recorta = masVeces.donante.substr(0, cortar);
    return recorta.trim();
  }
}
