const express = require("express")
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const path = require('path');

const uuidv4 = require('uuid/v4');
const randomWord = require('random-word');

const bodyParser = require("body-parser")
const app = express()

const port = 80
hostname = '0.0.0.0';

app.use(bodyParser.json())
app.use(express.static("web"))

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);



const url = 'mongodb://localhost:27017';


MongoClient.connect(url, {useNewUrlParser : true}, (err, client) => {
    if (err) {
        throw err;
    }

    let db = client.db('Gamedbs').collection('gamedata');

    // app.get('/', (req, res) => {
    //     res.sendFile(path.join(__dirname+'/index.html'));
    // });

    app.post('/word', (req, res) => {
        let sessionID = req.body.sessionID;
    
        if (sessionID === null) {
            sessionID = uuidv4();
        }

        let word = randomWord();

        let hiddenword = word.replace(/./g, '*');

        let gamedata = {
            sessionID,
            word,
            hiddenword,
            guessremain: 8,
            Won: false,
            Lost: false
        };

        db.insertOne(gamedata).then(data => {
            res.json({gameID: data.insertedId, sessionID, hiddenword});
        });    console.log(word)
    });

    app.post('/guessword', (req, res) => {
        let { sessionID, gameID, letter} = req.body;

        let _id = ObjectId(gameID); 

        db.findOne({sessionID,_id}, (err, gamedata) => {
            let Status = checkans(letter, gamedata);
            let update = {
                $set: Status
            };
            db.updateOne({_id}, update, (err, updateRes) => {
                res.send(Status);
            });
        });  
    });
});
function checkans(letter, gamedata) {
    let {
        word,
        hiddenword,
        guessremain,
        Won,
        Lost
    } = gamedata ;
    var correct = false;
    for (i = 0; i < word.length; i++) {
        if (word[i] == letter.toLowerCase()) {
            // console.log(word[i] + i)
            correct = true;
            // hiddenword =
            
        }
    }
    if (correct) {
        if (hiddenword.indexOf('*') == -1) {
            Won = true;
        }
    } else {
        correct = false;
        guessremain--;
        if (guessremain < 1) {
            Lost = true;
        }
    }
    return {
        guessremain,
        Won,
        Lost,
        hiddenword,
    }
}

