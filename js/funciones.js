// Santiago Pereyra - 245198
window.addEventListener("load", inicio);
let sistema = new Sistema();

function inicio() {
  if (sistema.darDonaciones().length === 0) {
    let tablaDon = document.getElementById("tableDonaciones");
    tablaDon.innerHTML = "SIN DONACIONES";
  }

  document
    .getElementById("buttAgregarDonante")
    .addEventListener("click", agregarDonante);

  document
    .getElementById("buttAgregarDonacion")
    .addEventListener("click", agregarDonacion);

  document
    .getElementById("buttAgregarDonacion")
    .addEventListener("click", drawChart);

  document
    .getElementById("creciente")
    .addEventListener("click", cargarDonacionesCre);

  document
    .getElementById("decreciente")
    .addEventListener("click", cargarDonacionesDecre);
}

function agregarDonante() {
  let formDonante = document.getElementById("formRegistroDonante");
  if (formDonante.reportValidity()) {
    let nombre = document.getElementById("nombre").value;
    let direccion = document.getElementById("direccion").value;
    let telefono = document.getElementById("telefono").value;
    if (!sistema.existeDonante(nombre)) {
      let donante = new Donante(nombre, direccion, telefono);
      sistema.agregarDonante(donante);
      formDonante.reset();
      recargar();
    } else {
      alert("Ya existe un donante con ese nombre registrado en el sistema.");
    }
  }
}

function cargarDonantes() {
  let comboDonante = document.getElementById("donante");
  comboDonante.innerHTML = "";
  let datos = sistema.darTodosDonantes();
  for (let elemento of datos) {
    let opcion = document.createElement("option");
    let nodoTexto = document.createTextNode(elemento);
    opcion.appendChild(nodoTexto);
    comboDonante.appendChild(opcion);
  }
}

function agregarDonacion() {
  let formDonacion = document.getElementById("formRegistroDonacion");
  if (formDonacion.reportValidity()) {
    let donante = document.getElementById("donante").value;
    let modo = document.getElementById("modo").value;
    let monto = parseFloat(document.getElementById("monto").value);
    let comentarios = document.getElementById("comentarios").value;
    let donacion = new Donacion(donante, modo, monto, comentarios);
    sistema.agregarDonacion(donacion);
    formDonacion.reset();
    cargarEstadisticas();
    document.getElementById("piechart").style.display = 'block';
    recargar();
  }
}

function cargarDonacionesDecre() {
  let donaciones = sistema.darDonaciones();
  let tabla = document.getElementById("tableDonaciones");
  tabla.innerHTML = "";
  crearTabla(donaciones);
}

function cargarDonacionesCre() {
  let donaciones = sistema.darDonacionesCreciente();
  let tabla = document.getElementById("tableDonaciones");
  tabla.innerHTML = "";
  crearTabla(donaciones);
}

function crearTabla(donaciones) {
  let resaltarMonto = parseFloat(document.getElementById("monto2").value);
  let resaltarCheck = document.getElementById("filas").checked;
  let tabla = document.getElementById("tableDonaciones");
  tabla.innerHTML = "";
  if (donaciones.length === 0) {
    tabla.innerHTML = "SIN DONACIONES";
  } else {
    let filaDonante = tabla.insertRow();
    let celdaDonante = document.createElement("th");
    celdaDonante.innerHTML = "Donante";
    filaDonante.appendChild(celdaDonante);
    let celdaModo = document.createElement("th");
    celdaModo.innerHTML = "Modo";
    filaDonante.appendChild(celdaModo);
    let celdaMonto = document.createElement("th");
    celdaMonto.innerHTML = "Monto";
    filaDonante.appendChild(celdaMonto);
    let celdaComentario = document.createElement("th");
    celdaComentario.innerHTML = "Comentarios";
    filaDonante.appendChild(celdaComentario);
    let titulos = document.querySelectorAll("th");

    for (let i = 0; i < titulos.length; i++) {
      if (titulos[i].textContent.trim() > "") {
        titulos[i].classList.add("titleTable");
      }
    }

    for (let elemento of donaciones) {
      let fila = tabla.insertRow();
      let celda = fila.insertCell();
      if (resaltarCheck && elemento.monto === resaltarMonto) {
        fila.classList.add("resaltado");
      }
      celda.classList.add("nombreDonantes");
      celda.innerHTML = elemento.donante;
      let celdaModo = fila.insertCell();
      celdaModo.innerHTML = elemento.modo;
      let celdaMonto = fila.insertCell();
      celdaMonto.innerHTML = elemento.monto;
      if (elemento.monto > 1000) {
        celdaMonto.classList.add("mayorMil");
      } else {
        celdaMonto.classList.add("menorMil");
      }
      let celdaComentarios = fila.insertCell();
      celdaComentarios.innerHTML = elemento.comentarios;
    }
  }
}

function recargar() {
  cargarDonantes();
  actualOrder();
  montoMayor();
  totalGeneral();
}

function montoMayor(){
  let montoT = document.getElementById("montoMayor");
  montoT.innerHTML='$ '+sistema.montoDonacionMayor();
}

function totalGeneral(){
  let totalG = document.getElementById("totalGeneral");
  totalG.innerHTML='$ '+sistema.montoTotalGeneral();
}

function actualOrder() {
  document.getElementById("decreciente").checked
    ? cargarDonacionesDecre()
    : cargarDonacionesCre();
  let cantTotal = document.getElementById("totalDonaciones");
  cantTotal.innerHTML = sistema.listaDonaciones.length;
  let promedioDonacion = document.getElementById("promedioDonacion");
  promedioDonacion.innerHTML = sistema.promedioDonaciones();
}

function cargarEstadisticas(){
  let donanteMasBlock = document.getElementById("donanteMasBlock");
  let donadorRepetido = document.getElementById("donadorRepetido");
  if (sistema.masVecesDono().indexOf(",") !== -1) {
    donadorRepetido.textContent = "";
    donanteMasBlock.style.display = "block";
    donanteMasBlock.textContent = "Los donantes que más veces donaron son: ";
    donadorRepetido.style.display = "block";
    let textoSplit = sistema.masVecesDono().split(",");
    for (let index = 0; index < textoSplit.length; index++) {
      let donantes = document.createElement("li");
      donantes.textContent = textoSplit[index];
      donadorRepetido.appendChild(donantes);
    }
  } else if (sistema.masVecesDono().length > 0 && !(sistema.masVecesDono().indexOf(",") !== -1)) {
    donadorRepetido.innerHTML='';
    donanteMasBlock.style.display = "block";
    donanteMasBlock.textContent = 'Donante que más veces donó: '+sistema.masVecesDono();
  }
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  let totalDonaciones = sistema.cantidadDonaciones();
  let efectivo = parseFloat(totalDonaciones+sistema.cantidadModo('efectivo')) > 1 ? parseFloat(sistema.cantidadModo('efectivo')) : 0;
  let transferencia = parseFloat(totalDonaciones+sistema.cantidadModo('transferencia')) > 1 ? parseFloat(sistema.cantidadModo('transferencia')) : 0;
  let canje = parseFloat(totalDonaciones+sistema.cantidadModo('canje')) > 1 ? parseFloat(sistema.cantidadModo('canje')) : 0;
  let mercaderia = parseFloat(totalDonaciones+sistema.cantidadModo('mercaderia')) > 1 ? parseFloat(sistema.cantidadModo('mercaderia')) : 0;
  let cheque = parseFloat(totalDonaciones+sistema.cantidadModo('cheque')) > 1 ? parseFloat(sistema.cantidadModo('cheque')) : 0;
  let otros = parseFloat(totalDonaciones+sistema.cantidadModo('otros')) > 1 ? parseFloat(sistema.cantidadModo('otros')) : 0;

  var data = google.visualization.arrayToDataTable([
    ["Task", "Hours per Day"],
    ["Efectivo", efectivo],
    ["Transferencia", transferencia],
    ["Canje", canje],
    ["Mercaderia", mercaderia],
    ["Cheque", cheque],
    ["Otros", otros],
  ]);

  var options = {
    title: "Donaciones por modo",
    backgroundColor: 'transparent',
    width:350,
    height:300,
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );

  chart.draw(data, options);
}
