var M;

class Main implements EventListenerObject, HttpResponse {
    // public listaPersonas: Array<Persona> = new Array();
    // public etidadesAcciones: Array<Acciones> = new Array();
    // public nombre: string;
    public framework: FrameWork = new FrameWork();
    constructor() {
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/listdevices", this)
    }

    private validateInput(datos): boolean {

        if (datos.name != "") {
            return (true)
        };

        return (false)
    }

    private buildAddDevModal():string {
        return (`<div class="modal-content">
        <h4>Añadir dispositivo</h4>
        <div class="row">
          <form class="col s12">
              <div class="row">
              <div class="input-field col s6">
                  <input type="text" id="fnewdevname" name="fnewdevname" value="" placeholder= "nombre">
                  <label for ="fnewdevname"> Nombre de dispositivo: </label>
              </div>
              <div class="input-field col s6">
              <input type="text" id="fnewdevdesc" name="fnewdevdesc" value="" placeholder="Description">
                  <label for ="fnewdevdesc"> Description: </label>
              </div>
              </div>  
      </div>
      <div class="row">
            <div class="col s4">
                <label for ="fnewdevtype"> 
                <select class="icons" id="fnewdevtype">
                    <option value="0" data-icon="../static/images/0.png">Lampara</option> 
                    <option value="1" data-icon="../static/images/1.png">Persiana</option> 
               </select>
               <label>Select device type </label>
           </div>  
      <div class="input-field col s4">                                   
          <label for = "fnewdevdimm"> 
          <input type="checkbox"  id="fnewdevdimm" class="filled-in" />
          <span>Compatible con regulable</span></label>
      </div> 
      </div>
      <div class="modal-footer">
      <button id="btnAddDevice" class="btn waves-effect waves-light button-view green"><i class="material-icons left">add_box</i>Añadir dispositivo</button>
      </div>
    </div>`)
    };
    private build_type_list (type:number):string{
        let list_types:string = "";
        let type_names = ["Lampara", "Persiana"]    //Here I could query the DB for all List types
        for (var i in type_names) {
            let j = parseInt(i);
            let selected = (( j = type )? "selected": "");
            list_types += `<option ${selected} value="${i}" data-icon="../static/images/${i}.png">`+ type_names[i] +`</option>`
        }
        return(list_types)
    };
    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let respuestaString: string = response;
            let respuesta: Array<Device> = JSON.parse(respuestaString);
            let cajaDiv = document.getElementById("caja");
            let datosVisuale: string = `<ul class="collection" >`
            for (let disp of respuesta) {
                let avatar_collection: string = "";
                let edit_collection: string = "";
                let dimmable: boolean = disp.dimmable;
                let switch_icon: string = "";
                let type_options: string = this.build_type_list(disp.type);
                let state_checked: string = ((JSON.stringify(disp.state) > "1") ? 'checked = "checked"' : "")  //Lea el valor del estado y establezca en consecuencia el estado de la casilla de verificación.
                let dimm_checked: string = ((dimmable) ? 'checked = "checked"' : "") // Para actualizar el valor de la casilla de verificación
                // definir el tipo para seleccionar opciones desplegables

                

                // Construya la lista de dispositivos e inclúyala en las líneas de expansión proporcionadas por HTML5
                avatar_collection += ` <li href="#!" class="collection-item avatar z-depth-3" style=  >`;
                avatar_collection += `<img src="../static/images/${disp.type}.png" alt="" class="circle">`;
                avatar_collection += `<span class="title nombreDisp">${disp.name}</span> `
                if (dimmable) {                 // if non dimmable use on-off switch, if not use html5 range.
                    switch_icon = `<div class="secondary-content"> <form action="#"> <p class="range-field"> <input type="range" id="rg_${disp.id}" min="0" value="${disp.state}" max="10" /> </p> </form> </div>`
                } else {
                    switch_icon = `<a href="#!" class="secondary-content"> <div class="switch"> <label>  Off  <input type="checkbox" ${state_checked} id="cb_${disp.id}">  <span class="lever"></span>  On </label> </div> </a> `
                };
                avatar_collection += switch_icon;
                avatar_collection += ` </li>`;

                // Detalles de HTML 5 para ocultar/expandir con detalles.
                edit_collection += `  <div class="row">
                                        <form class="col s12">
                                            <div class="row">
                                            <br/>
                                            <div class="input-field col s6">
                                                <input type="text" id="fname_${disp.id}" name="fname_${disp.id}" value="${disp.name}" placeholder= "${disp.name}">
                                                <label for ="fname_${disp.id}"> Nombre del dispositivo: </label>
                                            </div>
                                            <div class="input-field col s6">
                                            <input type="text" id="fdescription_${disp.id}" name="fdescription_${disp.id}" value="${disp.description}" placeholder="${disp.description}">
                                                <label for ="fdescription_${disp.id}"> Description: </label>
                                            </div>
                                            </div>  
                                    </div>
                                    <div class="row">
                                          <div class="col s4">
                                              <label for ="ftype_${disp.id}"> 
                                              <select class="icons" id="ftype_${disp.id}">
                                                ${type_options}
                                             </select>
                                             <label>Select device type </label>
                                         </div>  
                                    <div class="input-field col s4">                                   
                                        <label for = "fdimm_${disp.id}"> 
                                        <input type="checkbox"  id="fdimm_${disp.id}" class="filled-in" ${dimm_checked}/>
                                        <span>Compatible con regulable</span></label>
                                    </div> `



                datosVisuale += `<details>`;
                datosVisuale += `<summary>${avatar_collection} </summary>`;
                datosVisuale += edit_collection;
                //Actualizar y eliminar botones de dispositivos
                datosVisuale += ` <div class=" right-align"> <button id="btn_update_${disp.id}" class="btn waves-effect waves-light button-view  color="teal"><i class="material-icons left">sync</i>Actualizar</button> `;
                datosVisuale += ` <button id="btn_delete_${disp.id}" class="btn waves-effect waves-light button-view red"><i class="material-icons left">delete_forever</i>Eliminar</button> </div> </div> `;


                datosVisuale += `</details>`;

            }

            datosVisuale += `</ul>`
            cajaDiv.innerHTML = datosVisuale;
            for (let disp of respuesta) {
                let divEquipo = document.createElement("div");
                
              }
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, "");
            var elems2 = document.querySelectorAll('.fixed-action-btn');
            var instances_float = M.FloatingActionButton.init(elems2, { direction: 'top', hoverEnabled: true });
            M.updateTextFields();
            for (let disp of respuesta) {

                // declara la casilla de verificación o los elementos de rango, y solo agrega oyentes a los activos.
                let checkbox = document.getElementById("cb_" + disp.id);   // Casilla de verificación no regulable (on - off)
                let range = document.getElementById("rg_" + disp.id); // control deslizante de rango regulable
                if (disp.dimmable) { range.addEventListener("click", this) } else { checkbox.addEventListener("click", this) };

                let btn_delete = document.getElementById("btn_delete_" + disp.id); 
                // boton eliminar
                btn_delete.addEventListener("click", this);
                let btn_update = document.getElementById("btn_update_" + disp.id); // boton actualizar
                btn_update.addEventListener("click", this);

            }


        } else {
            alert("Failed to load devices")
        }
    }
    handlerResponseUpdateDevice(status: number, response: string) {
        if (status == 200) {
            M.toast({ html: 'Device updated succesfuly' })
           
        } else {
            M.toast({ html: 'Error while updating' })
        }
      
    }

    handlerResponseAddDevice(status: number, response: string) {
        if (status == 200) {
            M.toast({ html: 'Device Added succesfuly' })

        } else {
            M.toast({ html: 'Error while updating' })
        }
       
    }

    handlerResponseRemoveDevice(status: number, response: string) {
        if (status == 200) {
            M.toast({ html: 'Dispositivo eliminado' })

        } else {
            M.toast({ html: 'Error while deleting device' })
        }

    }

    public handleEvent(e: Event): void {
        let objetoEvento = <HTMLElement>e.target;
        console.log("target: " + e.target);
        
        if (e.type == "click" && objetoEvento.id.startsWith("cb_")) {    // Actualizar estado del dispositivo (Encendido = 10, apagado = 0)
            let state: number = 0;
            ((((objetoEvento) as HTMLInputElement).checked) ? state = 10 : 0);
            console.log("Se hizo click para prender o apagar")
            let datos = { "id": objetoEvento.id.substring(3), "state": state };
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/updateState/", this, datos)

        } else if (e.type == "click" && objetoEvento.id.startsWith("btnLogin")) {
           // Ocultar el bloque inicialmente
            var row = document.getElementById("row");
            var bloque = document.getElementById("bloque");
            // Obtener referencia al botón de inicio de sesión
            var btnLogin = document.getElementById("btnLogin") as HTMLButtonElement;
            btnLogin.addEventListener("click", function(e) {
            var iUser = <HTMLInputElement>document.getElementById("iUser") as HTMLInputElement;
            var iPass = <HTMLInputElement>document.getElementById("iPass") as HTMLInputElement;
            var username: string = iUser.value;
            var password: string = iPass.value;

            if (username && password) {
                // Realizar la solicitud POST al backend
                fetch("http://localhost:8000/usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: username,
                    contraseña: password
                })
                })
                .then(response => response.json())
                .then(data => {
                // Mostrar el mensaje de bienvenida y mostrar el contenido si el inicio de sesión es correcto
                if (data.message === "Inicio de sesión correcto") {
                    alert("Bienvenido " + username);
                    // Mostrar el contenido de la página
                    
                    bloque.classList.add("hide");
                    row.classList.remove("hide");
                } else {
                    alert("Inicio de sesión incorrecto");
                }
                })
                .catch(error => {
                console.error("Error:", error);
                });
            }
            });
  
        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_delete_")) {// Eliminar dispositivo

            
            console.log("Se hizo click para borrar el device")
            let datos = { "id": objetoEvento.id.substring(11) };
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/deleteDevice/", this, datos)

        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_update")) {// Actualizar dispositivo
            console.log("Se hizo click para actualizar el device " + objetoEvento.id.substring(11))
            let datos = {} as any;
            datos.id = objetoEvento.id.substring(11);
            datos.name = (document.getElementById("fname_" + datos.id) as HTMLInputElement).value;
            datos.description = (document.getElementById("fdescription_" + datos.id) as HTMLInputElement).value;
            datos.dimmable = (((document.getElementById("fdimm_" + datos.id) as HTMLInputElement).checked) ? 1 : 0);
            datos.type = ((document.getElementById("ftype_" + datos.id) as HTMLSelectElement).selectedIndex);
            if (this.validateInput(datos)) {
                this.framework.ejecutarBackEnd("POST", "http://localhost:8000/updateDevice/", this, datos)
              
            } else {
                M.toast({ html: 'Error, name cannot be empty' })
            }
            


        } else if (e.type == "click" && objetoEvento.id == "btnAddDevice") { // Añadir dispositivo
            console.log("Se hizo click para agregar un device")
            let fname = (document.getElementById("fnewdevname") as HTMLInputElement).value;
            let fdescription = (document.getElementById("fnewdevdesc") as HTMLInputElement).value;
            let ftype = (document.getElementById("fnewdevtype") as HTMLInputElement).value;
            let fdimmable = (((document.getElementById("fnewdevdimm") as HTMLInputElement).value) ? 1 : 0);
            let fstat = 0;
            let datos = { "name": fname, "description": fdescription, "state": fstat, "type": ftype, "dimmable": fdimmable };
            console.log(datos)
            if (this.validateInput(datos)) {
                this.framework.ejecutarBackEnd("POST", "http://localhost:8000/insertDevice/", this, datos);
                ((document.getElementsByClassName("modal-content")[0] as HTMLModElement).style).display = "none";
            } else {
                M.toast({ html: 'Error, name cannot be empty' })
            }
           
        }  else if (e.type == "click" && objetoEvento.id == "btn_Add_Device") {// Añadir dispositivo
            console.log("Se hizo click para agregar un device")
            let add_device_modal = document.getElementById("modal_add_device")
            add_device_modal.innerHTML = this.buildAddDevModal();
            var elems1 = document.querySelectorAll('.modal');
            var instances_modal = M.Modal.init(elems1, "");
            let btn2 = document.getElementById("btnAddDevice");
            btn2.addEventListener("click", this);
        
        } else if (e.type == "click" && objetoEvento.id.startsWith("rg_")) {  // actualizar el valor de estado de los dispositivos regulables
            let id = objetoEvento.id.substring(3);
            console.log("Se cambio el slider a " + (document.getElementById("rg_" + id) as HTMLInputElement).value)
            let datos = { "id": objetoEvento.id.substring(3), "state": (document.getElementById("rg_" + id) as HTMLInputElement).value };
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/updateState/", this, datos)

        } else {
            M.toast({ html: "Se hizo algo distinto en " + e.type + " " + objetoEvento.id })
        }
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/listdevices", this)
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    var instances_select = M.FormSelect.init(elems, "");
    M.updateTextFields();
    let main: Main = new Main();

    var elems2 = document.querySelectorAll('.fixed-action-btn');
    var instances_float = M.FloatingActionButton.init(elems2, { direction: 'top', hoverEnabled: true });
    var btnLogin = document.getElementById("btnLogin");
    btnLogin.addEventListener("click", main);

    let btn = document.getElementById("btn_Add_Device");
    btn.addEventListener("click", main);

});







