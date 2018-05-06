var express = require("express");
var pg = require("pg");
var bodyParser = require("body-parser");
var fs = require('fs');


var app = express();

// Allow the use of bodyParser with url and json
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Create the express app
app.use(express.static(__dirname + "/public"));


// Set up the port (every app has to have a port)
app.set("port", 3001);
app.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});

// Set up the Pool
const config = JSON.parse(fs.readFileSync('databaseConfig.json', 'utf8'));
//pg.defaults.ssl = true;
const pool = new pg.Pool(config);

// ACTUAL CODE FOR ENDPOINTS

// List of database queries
const DBQ = {
    setPlayers: "INSERT INTO playersdata(id, firstname, lastname, position, projectedscore, salary, image) VALUES($1, $2, $3, $4, $5, $6, $7);",
    getPlayers: "SELECT * FROM playersdata;",
    getPlayer: "SELECT * FROM players WHERE id = $1;"
}

// This is the key database calling function.
//		action: pass in the query desired (select from DBQ)
//		params: pass in the query parameters
//		callback: pass in the callback function that will run after the query is complete
function performDatabaseAction(action, params, callback) {
    
    pool.connect(function (err, client, done) {
            client.query(action, params, function (err, data) {
                done();
                callback(err, data);
            });
        })
    
}

// This is not actually used; just for testing purposes
app.post("/set_players", function (req, res) {
    const data = req.body;

    // This is what is run after the query is complete
    function callback(err, data) {        
        if (err) {
           // console.log(err)
            res.status(400);
            //res.send("Failed query - set_players");
        } else {
            //console.log('else')
            res.status(200);
            //res.send("Success query - set_players");
        }
    }

    data.forEach(function (datum) {
        // Perform the query
        const params = [datum.id, datum.firstname, datum.lastname, datum.position, datum.projectedscore, datum.salary, datum.image];
        performDatabaseAction(DBQ.setPlayers, params, callback);
    })
})


// Request all players
app.get('/get_players', function (req, res) {
    // This is what is run after the query is complete
    function callback(err, data) {
        if (err) {
            res.status(400);
            res.send("Failed query - get_players:" + err);
        } else {
           // console.log(data)
            let responseData = [];
            data.rows.forEach(function (datum) {
                responseData.push({
                    "id": datum.id,
                    "firstname": datum.firstname,
                    "lastname": datum.lastname,
                    "position": datum.position,
                    "projectedscore": datum.projectedscore,
                    "salary": datum.salary,
                    "image": datum.image.toString("base64")
                })
            })

            res.status(200);
            res.json({ "data": responseData });
        }
    }

    // Perform the query
    performDatabaseAction(DBQ.getPlayers, [], callback);
});

// Request a single player
app.get('/get_player', function (req, res) {
    let playerId = req.query["playerId"];

    // This is what is run after the query is complete
    function callback(err, data) {
        if (err) {
            res.status(400);
            res.send("Failed query - get_player: " + err);
        } else {
            let response = {};
            if (data.rows.length > 0) {
                // console.log(data.rows[0])
                response = {
                    "id": data.rows[0].id,
                    "firstname": data.rows[0].firstname,
                    "lastname": data.rows[0].lastname,
                    "position": data.rows[0].position,
                    "projectedscore": data.rows[0].projectedscore,
                    "salary": data.rows[0].salary,
                    "image": data.rows[0].image.toString("base64")
                }
            }

            res.status(200);
            res.json(response);
        }
    }

    // Perform the query
    performDatabaseAction(DBQ.getPlayer, [playerId], callback);
});