window.addEventListener("load", cargarMaterias)

function cargarMaterias() 
{
    var tabla = document.getElementById("tabla");
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.open("GET", "http://localhost:3000/materias", true);
    peticionHttp.send();
    document.getElementById("divSpinner").hidden = false;
    peticionHttp.onreadystatechange = function () {

        if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
            document.getElementById("divSpinner").hidden = true;
            var materias = JSON.parse(peticionHttp.responseText);
            for (var i = 0; i < materias.length; i++) {
                console.log(materias[i].nombre, materias[i].id);
                //var cuerpo = document.getElementById("tcuerpo");
                var row = document.createElement("tr");
                //cuerpo.appendChild(row);
                tabla.appendChild(row);
                //Para el id
                var tdId = document.createElement("td");
                row.appendChild(tdId);
                var textId = document.createTextNode(materias[i].id);
                tdId.appendChild(textId);
                //Para el nombre
                var tdNombre = document.createElement("td");
                row.appendChild(tdNombre);
                var textNombre = document.createTextNode(materias[i].nombre);
                tdNombre.appendChild(textNombre);
                //Para el cuatrimestre
                var tdCuatrimestre = document.createElement("td");
                row.appendChild(tdCuatrimestre);
                var textCuatrimestre = document.createTextNode(materias[i].cuatrimestre);
                tdCuatrimestre.appendChild(textCuatrimestre);
                //Para la fecha final
                var tdFecha = document.createElement("td");
                row.appendChild(tdFecha);
                var textFecha = document.createTextNode(materias[i].fechaFinal);
                tdFecha.appendChild(textFecha);
                //Para el turno
                var tdTurno = document.createElement("td");
                row.appendChild(tdTurno);
                var textTurno = document.createTextNode(materias[i].turno);
                tdTurno.appendChild(textTurno);

                row.addEventListener("dblclick", editarMateria);
            }
        }
    }

    function editarMateria(e) {
        //Boton cerrar
        document.getElementById("btnCerrar").onclick = function () {
            divMateria.hidden = true;
        }

        var divMateria = document.getElementById("divMateria");
        divMateria.hidden = false;

        var tabla = document.getElementById("tabla");
        var fila = e.target.parentNode;//obtengo fila

        var id = fila.childNodes[0].childNodes[0].nodeValue;
        var nombre = fila.childNodes[1].childNodes[0].nodeValue;
        var cuatrimestre = fila.childNodes[2].childNodes[0].nodeValue;
        var fecha = fila.childNodes[3].childNodes[0].nodeValue;
        var turno = fila.childNodes[4].childNodes[0].nodeValue;

        document.getElementById("txtNombre").value = nombre;
        document.getElementById("dtFecha").value = fecha;

        if (turno == "Mañana") {
            document.getElementById("mañana").checked = true;
        }
        else {
            document.getElementById("noche").checked = true;
        }

        //Boton Modificar
        document.getElementById("btnModificar").onclick = function () {
            let flagNombre = true;
            let flagFecha = true;
            let flagTurno = true;

            if (document.getElementById("txtNombre").value.length <= 6) {

                document.getElementById("txtNombre").style.borderColor = "red";
                flagNombre = false;

            }

            if (!(document.getElementById("mañana").checked || document.getElementById("noche").checked)) {
                flagTurno = false;
            }


            var fechaInput = new Date(document.getElementById("dtFecha").value);
            var fechaActual = new Date();

            if (fechaActual < fechaInput) {
                document.getElementById("dtFecha").style.borderColor = "red";
                flagFecha = false;
            }


            if (flagNombre && flagFecha  && flagTurno) {
                var nombreInput = document.getElementById("txtNombre").value;
                var cuatrimestreInput = document.getElementById("slctCuatrimestre").value;
                var turno="Mañana";

                if(document.getElementById("noche").cheked)
                {
                    turno="Noche";
                }

                var jsonPersona = {"id": id, "nombre": nombreInput, "cuatrimestre": cuatrimestreInput, "fechaFinal": fechaInput, "turno": turno }

                var peticion = new XMLHttpRequest();
                peticion.open("POST", "http://localhost:3000/editar");
                peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                peticion.send(JSON.stringify(jsonPersona));
                document.getElementById("divSpinner").hidden = false;

                peticion.onreadystatechange = function () {

                    if (peticion.status == 200 && peticion.readyState == 4) {
                        document.getElementById("divSpinner").hidden = true;

                        fila.childNodes[0].childNodes[0].nodeValue = id;
                        fila.childNodes[1].childNodes[0].nodeValue = nombreInput;
                        fila.childNodes[2].childNodes[0].nodeValue = cuatrimestreInput;
                        fila.childNodes[3].childNodes[0].nodeValue = fechaInput;
                        fila.childNodes[4].childNodes[0].nodeValue = turno;
                    }
                }
            }

            //Boton Eliminar
            document.getElementById("btnEliminar").onclick = function () {
                var jsonMateria = { "id": id, "nombre": nombre, "cuatrimestre": cuatrimestre, "fechaFinal": fecha, "turno": turno }
                var peticion = new XMLHttpRequest();
                peticion.open("POST", "http://localhost:3000/eliminar");
                peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                peticion.send(JSON.stringify(jsonMateria));
                document.getElementById("divSpinner").hidden = false;

                peticion.onreadystatechange = function () {
                    if (peticion.status == 200 && peticion.readyState == 4) {
                        document.getElementById("divSpinner").hidden = true;
                        tabla.removeChild(fila);

                    }
                }
            }
        }
    }



}