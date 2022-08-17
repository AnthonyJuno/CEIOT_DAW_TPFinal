//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var utils = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

var devices = [
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
function validateInput(datos) {
    return ((datos.name != "" && datos.hasOwnProperty("name")) && (datos.hasOwnProperty("type")));
}
//Listat todos los dispositivos de la base de datos 

app.get('/listDevices/', function (req, res) {

    console.log("pidieron ver la DB");
        utils.query('SELECT * from Devices', (err, rows) => {  //temporary using Select * but will limit fields for the ones needed on the app.
            //  utils.release();
            if (err){ 
                throw err; 
                res.send( err).status(400); 
                return
            }
            //console.log('The data from Devices table are: \n', rows);
            res.send(JSON.stringify(rows)).status(200);
        });
});

app.get('/listDevicesPag/', function (req, res) {    // List devices in a paginated way (testing limiting the number of replies)
    let pagenumber = req.query.pagenumber;
    console.log("pidieron ver la pagina " + pagenumber + " de la DB");
        utils.query('SELECT * from Devices LIMIT 10 OFFSET ?' ,[pagenumber], (err, rows) => {  //temporary using Select * but will limit fields for the ones needed on the app.
            //  utils.release();
            if (err) throw err;
            console.log('The data from devices table are: \n', rows);
            res.send(JSON.stringify(rows)).status(200);
        });
});

app.get('/countDevices/', function (req, res) {

    utils.query('SELECT COUNT(name) as totalrows from Devices', (err, rows) => {
        //  utils.release();
        if (err) throw err;
        // totalRows = JSON.stringify(rows.name);
        // console.log('The number of devices in devices table is: \n', totalRows, + " and rows = " + rows);
        console.log("The number of rows in name is " + JSON.stringify(rows));
        res.send(JSON.stringify(rows)).status(200);
    });

});

// Listar solo el dispositivo con ID=
app.get('/queryDevice', function (req, res) {
        let deviceID = req.query.deviceID;
        let query = 'SELECT * FROM Devices WHERE id =?';
        utils.query(query, [deviceID], (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            // rows fetch
            console.log(data);
            res.send(JSON.stringify(data)).status(200);
        });
});

// Inserta un dispositivo con los datos enviados en el cuerpo del POST
app.post("/insertDevice", function (req, res) {
    console.log("pidieron insertar en la DB");
        let data = req.body;
        console.log(req.body);
        if (validateInput(data)) {
            let querydescription = ((req.body.hasOwnProperty("description") && (req.body.description != "")) ? req.body.description : "");
            let querystate = ((req.body.hasOwnProperty("state") && (req.body.state != "")) ? req.body.state  : 0);
            let querydimmable = ((req.body.hasOwnProperty("dimmable") && (req.body.dimmable != "")) ?  req.body.dimmable : 0);
            //Query build
            query = 'INSERT INTO Devices (name, description, type, state, dimmable ) VALUES ( ?, ?, ?, ?, ? )';
            console.log(query);
            utils.query(query,[req.body.name, querydescription, req.body.type, querystate, querydimmable], (err, response) => {
                if (err) {
                    console.error(err);
                    res.send("Error creating device").status(300);
                    return;
                }
                res.send(JSON.stringify(response)).status(200);
            });
        } else {
            res.send("Bad Data").status(300);
        }
});

//Cambiar el estado del dispositivo
app.post("/updateState", function (req, res) {
    console.log("pidieron cambiar el estado del dispositivo en la DB a " + req.body.state);
        let data = req.body;
        let query = 'UPDATE Devices SET state = ? WHERE id = ?';
        utils.query(query,[req.body.state, req.body.id], (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            res.send(JSON.stringify(response)).status(200);
        });
});

//Cambiar cualquier campo del dispositivo
app.post("/updateDevice", function (req, res) {
    console.log("pidieron cambiar algun valor del dispositivo en la DB con los siguientes datos");
    console.log(req.body);
    let queryDevice = 'SELECT * FROM Devices WHERE id =?';
    utils.query(queryDevice, [req.body.id], (err, device) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(device[0].name);
            if ( (device.length > 0)) { //device exists in the DB
                let querydescription = ((req.body.hasOwnProperty("description") && (req.body.description != "")) ? req.body.description : device[0].description);
                let querystate = ((req.body.hasOwnProperty("state") && (req.body.state != "")) ? Number(req.body.state) : Number(device[0].state));
                let querydimmable = ((req.body.hasOwnProperty("dimmable") && (req.body.dimmable === 0 || req.body.dimmable === 1)) ?  Number(req.body.dimmable) : Number(device[0].dimmable));
                //to be fixed: dimmable should enforce a boolean type
                let queryname = ((req.body.hasOwnProperty("name") && req.body.name != "")? req.body.name: device[0].name);
                let querytype = ((req.body.hasOwnProperty("type") && (req.body.type ===1 || req.body.type ===0)) ? Number(req.body.type): Number(device[0].type));
                let query = 'UPDATE Devices SET name = ?, description = ?, type = ?, state = ?, dimmable = ?  WHERE id = ?';
                console.log(query);

                utils.query(query, [queryname, querydescription, querytype, querystate, querydimmable, req.body.id], (err, response) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    res.send(JSON.stringify(response)).status(200);
                });
            } else {
                res.send("Bad Data").status(300);
            }

    });
});


// Borrar un dispositivo de la DB
app.post("/deleteDevice", function (req, res) {
    console.log("pidieron remover un dispositivo de la DB");
        let data = req.body;

        let query = 'DELETE from Devices WHERE id = ' + data.id;
        console.log(query);
        utils.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }

            res.send(JSON.stringify(response)).status(200);
        });
});


//API originales de la app.
app.get('/devices/', function (req, res) {

    console.log("Alguien pidio divices!");
        res.send(JSON.stringify(devices)).status(200);

});

app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
