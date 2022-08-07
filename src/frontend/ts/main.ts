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
                let lista: string = "";
                let checked = ((JSON.stringify(disp.state) == "1")? 'checked = "checked"' : "")  //Read state value and set accordingly the checkbox state.
                datosVisuale += `<details>`;
                
                lista += ` <li href="#!" class="collection-item avatar">`;
                lista += `<img src="../static/images/${disp.type}.png" alt="" class="circle">`;
               // datosVisuale += `<a class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">delete_forever</i></a>`
                lista += `<span class="title nombreDisp">${disp.name}</span>
                <p>${disp.description}
                </p>

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
                datosVisuale += `<summary>${lista} </summary>`;
                datosVisuale += ` <button id="btn_${disp.id}" class="btn waves-effect waves-light button-view red"><i class="material-icons left">delete_forever</i>Remove Device</button> `
     
              //  datosVisuale += `  <a <input type= button class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">delete_forever</i>Remove Device></a> `
              //  datosVisuale += ` <a <button>  class="waves-effect waves-light btn button-view red" id="btn_${disp.id}" ><i class="material-icons left">delete_forever</i>Remove Device</a>`
       //         <button id="btn_${disp.id}" class="btn waves-effect waves-light button-view red"><i class="material-icons left">delete_forever</i>Remove Device</button>

              datosVisuale += `</details>`;
            }
            datosVisuale += `</ul>`
            cajaDiv.innerHTML = datosVisuale;

            for (let disp of respuesta) {


                let checkbox = document.getElementById("cb_" + disp.id);
                checkbox.addEventListener("click",this)
                let btn = document.getElementById("btn_" + disp.id);
                btn.addEventListener("click",this)
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
            
        } else if (e.type == "click" && objetoEvento.id.startsWith("btn_")) {

            //  console.log(objetoEvento.id,)
              console.log("Se hizo click para borrar el device")
              let datos = { "id": objetoEvento.id.substring(4)};
              this.framework.ejecutarRequest("POST","http://localhost:8000/deleteDevice/", this,datos)
              
        }else if (e.type == "click" && objetoEvento.id == "btnAddDevice") {       
            console.log("Se hizo click para agregar un device")    
            alert("Hola - Quiero Agregar un device ");    
        } else {
                alert("Se hizo algo distinto")
        }
        this.framework.ejecutarRequest("GET", "http://localhost:8000/listdevices", this)   
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,"");

    let btn = document.getElementById("btnAddDevice");
    //let btn2 = document.getElementById("btnDoble");
    let main: Main = new Main();
    // main.nombre = "Matias"
  //  btn2.addEventListener("dblclick", main);
    btn.addEventListener("click", main);
  

});







