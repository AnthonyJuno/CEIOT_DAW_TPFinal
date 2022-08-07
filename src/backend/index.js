//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

var  devices = [
    { 
        'id': 1, 
        'name': 'Lampara 1', 
        'description': 'Luz living', 
        'state': 1, 
        'type': 1, 
    },
    { 
        'id': 2, 
        'name': 'Ventilador 1', 
        'description': 'Ventilador Habitacion', 
        'state': 1, 
        'type': 2, 
    },
];
//=======[ Main module code ]==================================================

//Listat todos los dispositivos de la base de datos 

app.get('/listDevices/', function(req, res) {
   
    console.log("pidieron ver la DB");
    setTimeout(function(){
    utils.query('SELECT * from devices', (err, rows) => {
      //  utils.release();
        if(err) throw err;
        console.log('The data from devices table are: \n', rows);
        res.send(JSON.stringify(rows)).status(200);
    });
    }, 2000);
});

// Listar solo el dispositivo con ID=
app.get('/queryRow', function(req,res) {
    setTimeout(function(){
    let deviceID = req.query.deviceID;
    let query = 'SELECT * FROM devices WHERE id =' + deviceID;    
    utils.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows fetch
        console.log(data);
        res.send(JSON.stringify(data)).status(200);
    });
    }, 2000);
});

// Inserta un dispositivo con los datos enviados en el cuerpo del POST
app.post("/insertrow",function(req,res){
    console.log("pidieron insertar en la DB");
    setTimeout(function(){
        let data = req.body;
        let query = 'INSERT INTO devices (name, description, state, type) VALUES ('+ JSON.stringify(data.name) +','+ JSON.stringify(data.description) +','+ data.state +','+ data.type +')' ;  
        utils.query(query,(err, response) => {
            if(err) {
                console.error(err);
                return;
            }
           // console.log(response.insertId);
            res.send(JSON.stringify(response)).status(200);
        });
        }, 2000);
    });

//Cambiar el estado del dispositivo
app.post("/updateState",function(req,res){
    console.log("pidieron cambiar el estado del dispositivo en la DB");
    setTimeout(function(){
        let data = req.body;
        let query = 'UPDATE devices SET state = ' + data.state +' WHERE id = '+ data.id ;  
        utils.query(query,(err, response) => {
            if(err) {
                console.error(err);
                return;
            }
            res.send(JSON.stringify(response)).status(200);
        });
        }, 2000);
    });

//Cambiar cualquier campo del dispositivo
app.post("/updateDevice",function(req,res){
    console.log("pidieron cambiar algun valor del dispositivo en la DB");
    setTimeout(function(){      
        let data = req.body;
        // Voy a preguntar solo por los campos de interes, en lugar de hacer un loop y permitir cualquier campo en el cuerpo del post.
        // la generacion del string de actualizacion es complicada por la necesida de poner comas para separar campos, en el caso que alguien mande mas de un cambio a la vez
        let update_fields = "";
        //solo hay nombre de dispositivo
        update_fields += (data.hasOwnProperty("name")? 'name = "' + data.name + '"': "");
        //pregunto si hubo nombre, sino uso solo tipo
        update_fields += ((data.hasOwnProperty("name") && data.hasOwnProperty("type"))? ', type = "' + data.type + '"' :( data.hasOwnProperty("type"))? 'type = "' + data.type + '"' : "");
        // si hubo nombre o tipo, o si solo hay descripcion
        update_fields += (((data.hasOwnProperty("name") || data.hasOwnProperty("type")) && data.hasOwnProperty("description")  )? ', description = "' + data.description + '"' :( data.hasOwnProperty("description"))? 'description = "' + data.description + '"': "");
        // si hubo alguno de los campos anteriores, o si solo hay estado
        update_fields += (((data.hasOwnProperty("name") || data.hasOwnProperty("type") || data.hasOwnProperty("description")) && data.hasOwnProperty("state")  )? ', state = "' + data.state + '"':( data.hasOwnProperty("state"))? 'state = "' + data.state + '"' : "");
        //update del type
        update_fields += (((data.hasOwnProperty("name") || data.hasOwnProperty("type") || data.hasOwnProperty("description") || data.hasOwnProperty("state")) && data.hasOwnProperty("type")  )? ', type = "' + data.type + '"':( data.hasOwnProperty("type"))? 'type = "' + data.type + '"' : "");

        let query = 'UPDATE devices SET '+ update_fields +' WHERE id = '+ data.id ;  
       console.log(query);
        utils.query(query,(err, response) => {
            if(err) {
                console.error(err);
                return;
            }
            res.send(JSON.stringify(response)).status(200);
        });
        }, 2000);
    });


// Borrar un dispositivo de la DB
    app.post("/deleteDevice",function(req,res){
        console.log("pidieron remover un dispositivo de la DB");
        setTimeout(function(){
            let data = req.body;

            let query = 'DELETE from devices WHERE id = '+ data.id ;  
            console.log(query) ;
            utils.query(query,(err, response) => {
                if(err) {
                    console.error(err);
                    return;
                }
    
                res.send(JSON.stringify(response)).status(200);
            });
            }, 2000);
        });


    //API originales de la app.
app.get('/devices/', function(req, res) {
   
    console.log("Alguien pidio divices!");
    setTimeout(function(){
        res.send(JSON.stringify(devices)).status(200);
    }, 2000);
    
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
