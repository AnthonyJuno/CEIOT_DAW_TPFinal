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
                let checked = ((JSON.stringify(disp.state) == "1")? 'checked = "checked"' : "")  //Read state value and set accordingly the checkbox state.
                //construyo la lista de dispositivos para meter en summary de HTML5
                avatar_collection += ` <li href="#!" class="collection-item avatar">`;
                avatar_collection += `<img src="../static/images/${disp.type}.png" alt="" class="circle">`;
                avatar_collection += `<span class="title nombreDisp">${disp.name}</span>
                <a href="#!" class="secondary-content">
                <div class="switch">
                   <label>
                      Off
                      <input type="checkbox" ${checked} id="cb_${disp.id}">
                      <span class="lever"></span>
                      On
                    </label>
                </div>
                </a>
              </li>`;
              // HTML 5 details to hide/expand with details.
              edit_collection += `    <ul class="collection">
                                      <li class="collection-item"><label for ="fname_${disp.id}"> Device Name: </label> <input type="text" id="fname_${disp.id}" name="fname_${disp.id}" value="${disp.name}"></li>
                                      <li class="collection-item"><label for ="fdescription_${disp.id}"> Description: </label> <input type="text" id="fdescription_${disp.id}" name="fdescription_${disp.id}" value="${disp.description}"></li>
                                      <li class="collection-item"><label for ="ftype_${disp.id}"> Type: </label> <input type="text" id="ftype_${disp.id}" name="ftype_${disp.id}" value=${disp.type}></li>
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


                let checkbox = document.getElementById("cb_" + disp.id);
                checkbox.addEventListener("click",this)
                let btn_delete = document.getElementById("btn_delete_" + disp.id);
                btn_delete.addEventListener("click",this)
                let btn_update = document.getElementById("btn_update_" + disp.id);
                btn_update.addEventListener("click",this)
              
                // let fname = document.getElementById("fname_" + disp.id);
                // fname.value = ${disp.name};
                // let fdescription = document.getElementById("fdescription_" + disp.id);
                // fdescription.value = ${disp.name};
                // let ftype = document.getElementById("ftype_" + disp.id);
                // ftype.value = ${disp.name};
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
        if (e.type == "click" && objetoEvento.id.startsWith("cb_")) {

          //  console.log(objetoEvento.id,)
            console.log("Se hizo click para prender o apagar")
            let datos = { "id": objetoEvento.id.substring(3), "state": objetoEvento.checked };
            this.framework.ejecutarRequest("POST","http://localhost:8000/updateState/", this,datos)
            
        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_delete_")) {

            //  console.log(objetoEvento.id,)
              console.log("Se hizo click para borrar el device")
              let datos = { "id": objetoEvento.id.substring(11)};
              this.framework.ejecutarRequest("POST","http://localhost:8000/deleteDevice/", this,datos)
              
        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_update")) {
              console.log("Se hizo click para actualizar el device "+ objetoEvento.id.substring(11))
            // Load all values from document before building update json paramenter (due to TS cast)
              let id = objetoEvento.id.substring(11);
              let fname = (document.getElementById("fname_" + id) as HTMLInputElement).value;
              let fdescription = (document.getElementById("fdescription_" + id) as HTMLInputElement).value;
              let datos = { "id": id, "name": fname, "description": fdescription};
              console.log(datos)
              this.framework.ejecutarRequest("POST","http://localhost:8000/updateDevice/", this,datos)
              
        }else if (e.type == "click" && objetoEvento.id == "btnAddDevice") {       
            console.log("Se hizo click para agregar un device")    
            let fname = (document.getElementById("fnewdevname") as HTMLInputElement).value;
            let fdescription = (document.getElementById("fnewdevdesc") as HTMLInputElement).value;
            let ftype = (document.getElementById("fnewdevtype") as HTMLInputElement).value;
            let fstat = 0;
            let datos = { "name": fname, "description": fdescription, "state" : fstat, "type":ftype};
            console.log(datos)
            
            
            
           // alert("quiero agregar un nuevo device con los datos" + JSON.stringify(datos) );
            this.framework.ejecutarRequest("POST","http://localhost:8000/insertrow/", this,datos)
            
        } else {
                alert("Se hizo algo distinto")
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







