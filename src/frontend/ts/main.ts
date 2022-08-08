declare const M;

class Main implements EventListenerObject, ResponseLister {
    public listaPersonas: Array<Persona> = new Array();
    public etidadesAcciones: Array<Acciones> = new Array();
    public nombre: string;
    public framework: FrameWork = new FrameWork();
    constructor() {
        
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)
 
        // this.listaPersonas.push(new Usuario("Juan", 12, "jPerez"));
        // this.listaPersonas.push(new Administrador("Pedro", 35));
        // this.listaPersonas.push(new Persona("S", 12));
        // this.etidadesAcciones.push(new Usuario("Juan", 12, "jPerez"));
        // this.etidadesAcciones.push(new Administrador("Juan", 12));

        
    }

    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let respuestaString: string = response;
            let respuesta: Array<Device> = JSON.parse(respuestaString);
            let cajaDiv = document.getElementById("caja");
            
            let datosVisuale:string = `<ul class="collection">`
            for (let disp of respuesta) {
                let avatar_collection: string = "";
                let edit_collection: string = "";
                let dimmable:boolean = disp.dimmable; 
                let switch_icon:string = "";
                let state_checked:string = ((JSON.stringify(disp.state) > "1")? 'checked = "checked"' : "")  //Read state value and set accordingly the checkbox state.
                let dimm_checked:string = ((dimmable)? 'checked = "checked"': "") // For update checkbox value
                //Build device list and include in expanding lines provided by HTML5
                avatar_collection += ` <li href="#!" class="collection-item avatar">`;
                avatar_collection += `<img src="../static/images/${disp.type}.png" alt="" class="circle">`;
                avatar_collection += `<span class="title nombreDisp">${disp.name}</span> `
                if (dimmable){                 // if non dimmable use on-off switch, if not use html5 range.
                    switch_icon = `<div class="secondary-content"> <form action="#"> <p class="range-field"> <input type="range" id="rg_${disp.id}" min="0" value="${disp.state}" max="10" /> </p> </form> </div>`
                } else {
                    switch_icon = `<a href="#!" class="secondary-content"> <div class="switch"> <label>  Off  <input type="checkbox" ${state_checked} id="cb_${disp.id}">  <span class="lever"></span>  On </label> </div> </a> `
                };
                avatar_collection += switch_icon;
                avatar_collection += ` </li>`;

              // HTML 5 details to hide/expand with details.
              edit_collection += `    <ul class="collection">
                                      <li class="collection-item"><label for ="fname_${disp.id}"> Device Name: </label> <input type="text" id="fname_${disp.id}" name="fname_${disp.id}" value="${disp.name}"></li>
                                      <li class="collection-item"><label for ="fdescription_${disp.id}"> Description: </label> <input type="text" id="fdescription_${disp.id}" name="fdescription_${disp.id}" value="${disp.description}"></li>
                                      
                                      
                                      <li class="collection-item"><label for ="ftype_${disp.id}"> Type: <label>Select device type </label>
                                        <select class="browser-default" id="ftype_${disp.id}">
                                            <option value="0">Lampara</option> 
                                            <option value="1">Persiana</option> </select>
                                                                            
                                      <li class="collection-item"><label for ="fdimm_${disp.id}"> <label><input type="checkbox"  id="fdimm_${disp.id}" class="filled-in" ${dimm_checked}/><span>Dimmable Compatible</span></label></li>
                                      
                                      </ul>`

              datosVisuale += `<details>`;
              datosVisuale += `<summary>${avatar_collection} </summary>`;
              datosVisuale += edit_collection;
              datosVisuale += ` <button id="btn_update_${disp.id}" class="btn waves-effect waves-light button-view green"><i class="material-icons left">sync</i>Update Device</button> `;
              datosVisuale += ` <button id="btn_delete_${disp.id}" class="btn waves-effect waves-light button-view red"><i class="material-icons left">delete_forever</i>Remove Device</button> `;


              datosVisuale += `</details>`;
            }
            datosVisuale += `</ul>`
            cajaDiv.innerHTML = datosVisuale;

            for (let disp of respuesta) {

                //declare the checkbox or range elements, and only add listeners to the ones active.
                let checkbox = document.getElementById("cb_" + disp.id);   // Non dimmable check box (on - off)
                let range = document.getElementById("rg_" + disp.id); // dimmable range slider
                if (disp.dimmable) {range.addEventListener("click",this)} else{checkbox.addEventListener("click",this)};
               
                let btn_delete = document.getElementById("btn_delete_" + disp.id); // delete button
                btn_delete.addEventListener("click",this);               
                let btn_update = document.getElementById("btn_update_" + disp.id); // uodate button
                btn_update.addEventListener("click",this);
                

  
              

            }
        

          } else {
              alert("Algo salio mal")
          }
    }
    handlerResponseUpdateDevice(status: number, response: string) {
        if (status == 200) {
            alert("Se acutlizo correctamente")
                
        } else {
            alert("Error Actualizar")    
        }
        
    }
    handlerResponseRemoveDevice(status: number, response: string) {
        if (status == 200) {
            alert("Se elimino correctamente")
            
        } else {
            alert("Error Eliminar")    
        }
        
    }

    public handleEvent(e:Event): void {
        let objetoEvento = <HTMLInputElement>e.target;
        console.log("target: " + e.target);
        if (e.type == "click" && objetoEvento.id.startsWith("cb_")) {    // Update Device State (On= 10,  off =0)
           let state:number = 0;
            ((objetoEvento.checked)?  state = 10: 0);

            console.log("Se hizo click para prender o apagar")
            let datos = { "id": objetoEvento.id.substring(3), "state": objetoEvento.checked };
            this.framework.ejecutarRequest("POST","http://localhost:8000/updateState/", this,datos)
            
        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_delete_")) {  // Delete device

            //  console.log(objetoEvento.id,)
              console.log("Se hizo click para borrar el device")
              let datos = { "id": objetoEvento.id.substring(11)};
              this.framework.ejecutarRequest("POST","http://localhost:8000/deleteDevice/", this,datos)
              
        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_update")) {                  // Update Device
              console.log("Se hizo click para actualizar el device "+ objetoEvento.id.substring(11) )
             // Load all values from document before building update json paramenter (due to TS cast)
              let id = objetoEvento.id.substring(11);
              let fname = (document.getElementById("fname_" + id) as HTMLInputElement).value;
              let fdescription = (document.getElementById("fdescription_" + id) as HTMLInputElement).value;
              let fdimmable = (((document.getElementById("fdimm_" + id) as HTMLInputElement).value)? 1: 0);
              let ftype = ((document.getElementById("ftype_" + id) as HTMLSelectElement).selectedIndex);   
              let datos = { "id": id, "name": fname, "type": ftype, "description": fdescription,  "dimmable": fdimmable};
              console.log(datos)
              this.framework.ejecutarRequest("POST","http://localhost:8000/updateDevice/", this,datos)
              
        }else if (e.type == "click" && objetoEvento.id == "btnAddDevice") {                       // Add device
            console.log("Se hizo click para agregar un device")    
            let fname = (document.getElementById("fnewdevname") as HTMLInputElement).value;
            let fdescription = (document.getElementById("fnewdevdesc") as HTMLInputElement).value;
            let ftype = (document.getElementById("fnewdevtype") as HTMLInputElement).value;
            let fdimmable = (((document.getElementById("fnewdevdimm") as HTMLInputElement).value)? 1: 0);
            let fstat = 0;
            let datos = { "name": fname, "description": fdescription, "state" : fstat, "type":ftype, "dimmable": fdimmable};
            console.log(datos)

            this.framework.ejecutarRequest("POST","http://localhost:8000/insertrow/", this,datos)
            
        }else if(e.type == "click" && objetoEvento.id.startsWith("rg_")) {                   // update dimmable devices state value
              let id = objetoEvento.id.substring(3);
              console.log("Se cambio el slider a " + (document.getElementById("rg_" + id) as HTMLInputElement).value)
              let datos = { "id": objetoEvento.id.substring(3), "state": (document.getElementById("rg_" + id) as HTMLInputElement).value };
              this.framework.ejecutarRequest("POST","http://localhost:8000/updateState/", this,datos)
              
        }else {
                alert("Se hizo algo distinto" + e.type)
        }
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)   
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,"");

    
    let main: Main = new Main();
    

    
    let btn = document.getElementById("btnAddDevice");
    btn.addEventListener("click", main);
  

});







