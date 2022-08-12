declare const M;

class Main implements EventListenerObject, ResponseLister {
    // public listaPersonas: Array<Persona> = new Array();
    // public etidadesAcciones: Array<Acciones> = new Array();
    // public nombre: string;
    public framework: FrameWork = new FrameWork();
    constructor() {
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)
    }

    private validateInput(datos): boolean {

        if (datos.name != "") {
            return (true)
        };

        return (false)
    }
    private buildAddDevModal():string {
        return (`<div class="modal-content">
        <h4>Add Device</h4>
        <div class="row">
          <form class="col s12">
              <div class="row">
              <div class="input-field col s6">
                  <input type="text" id="fnewdevname" name="fnewdevname" value="" placeholder= "Device Name">
                  <label for ="fnewdevname"> Device Name: </label>
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
          <span> Dimmable Compatible</span></label>
      </div> 
      </div>
      <div class="modal-footer">
      <button id="btnAddDevice" class="btn waves-effect waves-light button-view green"><i class="material-icons left">add_box</i>Add Device</button>
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
            console.log("PAGINACION: " + Math.ceil(respuesta.length / 10));
            let datosVisuale: string = `<ul class="collection" >`
            for (let disp of respuesta) {
                let avatar_collection: string = "";
                let edit_collection: string = "";
                let dimmable: boolean = disp.dimmable;
                let switch_icon: string = "";
                let type_options: string = this.build_type_list(disp.type);
                let state_checked: string = ((JSON.stringify(disp.state) > "1") ? 'checked = "checked"' : "")  //Read state value and set accordingly the checkbox state.
                let dimm_checked: string = ((dimmable) ? 'checked = "checked"' : "") // For update checkbox value
                // define the type for select drop down options

                //Build device list and include in expanding lines provided by HTML5
                avatar_collection += ` <li href="#!" class="collection-item avatar z-depth-3">`;
                avatar_collection += `<img src="../static/images/${disp.type}.png" alt="" class="circle">`;
                avatar_collection += `<span class="title nombreDisp">${disp.name}</span> `
                if (dimmable) {                 // if non dimmable use on-off switch, if not use html5 range.
                    switch_icon = `<div class="secondary-content"> <form action="#"> <p class="range-field"> <input type="range" id="rg_${disp.id}" min="0" value="${disp.state}" max="10" /> </p> </form> </div>`
                } else {
                    switch_icon = `<a href="#!" class="secondary-content"> <div class="switch"> <label>  Off  <input type="checkbox" ${state_checked} id="cb_${disp.id}">  <span class="lever"></span>  On </label> </div> </a> `
                };
                avatar_collection += switch_icon;
                avatar_collection += ` </li>`;

                // HTML 5 details to hide/expand with details.
                edit_collection += `  <div class="row">
                                        <form class="col s12">
                                            <div class="row">
                                            <div class="input-field col s6">
                                                <input type="text" id="fname_${disp.id}" name="fname_${disp.id}" value="${disp.name}" placeholder= "${disp.name}">
                                                <label for ="fname_${disp.id}"> Device Name: </label>
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
                                        <span> Dimmable Compatible</span></label>
                                    </div> `



                datosVisuale += `<details>`;
                datosVisuale += `<summary>${avatar_collection} </summary>`;
                datosVisuale += edit_collection;
                //Update and remove devices buttons
                datosVisuale += ` <div class=" right-align"> <button id="btn_update_${disp.id}" class="btn waves-effect waves-light button-view  color="teal"><i class="material-icons left">sync</i>Update Device</button> `;
                datosVisuale += ` <button id="btn_delete_${disp.id}" class="btn waves-effect waves-light button-view red"><i class="material-icons left">delete_forever</i>Remove Device</button> </div> </div> `;


                datosVisuale += `</details>`;

            }

            datosVisuale += `</ul>`
            cajaDiv.innerHTML = datosVisuale;
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, "");

            M.updateTextFields();
            for (let disp of respuesta) {

                //declare the checkbox or range elements, and only add listeners to the ones active.
                let checkbox = document.getElementById("cb_" + disp.id);   // Non dimmable check box (on - off)
                let range = document.getElementById("rg_" + disp.id); // dimmable range slider
                if (disp.dimmable) { range.addEventListener("click", this) } else { checkbox.addEventListener("click", this) };

                let btn_delete = document.getElementById("btn_delete_" + disp.id); // delete button
                btn_delete.addEventListener("click", this);
                let btn_update = document.getElementById("btn_update_" + disp.id); // update button
                btn_update.addEventListener("click", this);

            }


        } else {
            alert("Algo salio mal")
        }
    }
    handlerResponseUpdateDevice(status: number, response: string) {
        if (status == 200) {
            M.toast({ html: 'Device updated succesfuly' })
           
        } else {
            M.toast({ html: 'Error while updating' })
        }
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)
    }

    handlerResponseAddDevice(status: number, response: string) {
        if (status == 200) {
            M.toast({ html: 'Device Added succesfuly' })

        } else {
            M.toast({ html: 'Error while updating' })
        }
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)
    }

    handlerResponseRemoveDevice(status: number, response: string) {
        if (status == 200) {
            M.toast({ html: 'Device removed' })

        } else {
            alert("Error Eliminar")
        }

    }

    public handleEvent(e: Event): void {
        let objetoEvento = <HTMLInputElement>e.target;
        console.log("target: " + e.target);
        if (e.type == "click" && objetoEvento.id.startsWith("cb_")) {    // Update Device State (On= 10,  off =0)
            let state: number = 0;
            ((objetoEvento.checked) ? state = 10 : 0);
            console.log("Se hizo click para prender o apagar")
            let datos = { "id": objetoEvento.id.substring(3), "state": objetoEvento.checked };
            this.framework.ejecutarRequest("POST", "http://localhost:8000/updateState/", this, datos)

        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_delete_")) {  // Delete device

            //  console.log(objetoEvento.id,)
            console.log("Se hizo click para borrar el device")
            let datos = { "id": objetoEvento.id.substring(11) };
            this.framework.ejecutarRequest("POST", "http://localhost:8000/deleteDevice/", this, datos)

        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_update")) {                  // Update Device
            console.log("Se hizo click para actualizar el device " + objetoEvento.id.substring(11))
            let datos = {} as any;
            datos.id = objetoEvento.id.substring(11);
            datos.name = (document.getElementById("fname_" + datos.id) as HTMLInputElement).value;
            datos.description = (document.getElementById("fdescription_" + datos.id) as HTMLInputElement).value;
            datos.dimmable = (((document.getElementById("fdimm_" + datos.id) as HTMLInputElement).checked) ? 1 : 0);
            datos.type = ((document.getElementById("ftype_" + datos.id) as HTMLSelectElement).selectedIndex);
            if (this.validateInput(datos)) {
                this.framework.ejecutarRequest("POST", "http://localhost:8000/updateDevice/", this, datos)
              //  M.toast({ html: 'Device updated succesfuly' })
            } else {
                M.toast({ html: 'Error, name cannot be empty' })
            }
            //console.log(datos)


        } else if (e.type == "click" && objetoEvento.id == "btnAddDevice") {                       // Add device
            console.log("Se hizo click para agregar un device")
            let fname = (document.getElementById("fnewdevname") as HTMLInputElement).value;
            let fdescription = (document.getElementById("fnewdevdesc") as HTMLInputElement).value;
            let ftype = (document.getElementById("fnewdevtype") as HTMLInputElement).value;
            let fdimmable = (((document.getElementById("fnewdevdimm") as HTMLInputElement).value) ? 1 : 0);
            let fstat = 0;
            let datos = { "name": fname, "description": fdescription, "state": fstat, "type": ftype, "dimmable": fdimmable };
            console.log(datos)
            if (this.validateInput(datos)) {
                this.framework.ejecutarRequest("POST", "http://localhost:8000/insertRow/", this, datos);
                ((document.getElementsByClassName("modal-content")[0] as HTMLModElement).style).display = "none";
            } else {
                M.toast({ html: 'Error, name cannot be empty' })
            }
           
        }  else if (e.type == "click" && objetoEvento.id == "btn_Add_Device") {                       // Add device
            console.log("Se hizo click para agregar un device")
            let add_device_modal = document.getElementById("modal_add_device")
            add_device_modal.innerHTML = this.buildAddDevModal();
            var elems1 = document.querySelectorAll('.modal');
            var instances_modal = M.Modal.init(elems1, "");
            let btn2 = document.getElementById("btnAddDevice");
            btn2.addEventListener("click", this);
        
        } else if (e.type == "click" && objetoEvento.id.startsWith("rg_")) {                   // update dimmable devices state value
            let id = objetoEvento.id.substring(3);
            console.log("Se cambio el slider a " + (document.getElementById("rg_" + id) as HTMLInputElement).value)
            let datos = { "id": objetoEvento.id.substring(3), "state": (document.getElementById("rg_" + id) as HTMLInputElement).value };
            this.framework.ejecutarRequest("POST", "http://localhost:8000/updateState/", this, datos)

        } else {
            M.toast({ html: "Se hizo algo distinto en " + e.type + " " + objetoEvento.id })
        }
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    var instances_select = M.FormSelect.init(elems, "");
    M.updateTextFields();
    let main: Main = new Main();

    var elems2 = document.querySelectorAll('.fixed-action-btn');
    var instances_float = M.FloatingActionButton.init(elems2, { direction: 'top', hoverEnabled: true });

    let btn = document.getElementById("btn_Add_Device");
    btn.addEventListener("click", main);

});







