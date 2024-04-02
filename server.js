const express = require("express");
const sqlite = require("sqlite3").verbose()

const db = new sqlite.Database(':memory:');

let table = "CREATE TABLE IF NOT EXISTS APIs (\
    id INTEGER PRIMARY KEY,\
    nome TEXT NOT NULL UNIQUE,\
    produto TEXT NOT NULL,\
    banco TEXT NOT NULL\
)"

db.exec(table)

const app = express();

app.get("/", (req, res) => {
    res.send("ONLINE!");
});

// /search?nome=&produto=
app.get("/search", (req, res) => {
    let { nome, produto } = req.query;
    console.log(nome, produto);

    db.serialize(() => {
        db.get("SELECT nome,produto,banco FROM APIs WHERE nome = ? and produto = ?", [nome, produto], (err, row) => {
            console.log(row);
            let regEx = /[azAZ09]/g
            
            if(regEx.test(nome) == false || regEx.test(nome) == false){
                res.status(400).send("Bad Params")
                return;
            }

            if(row == undefined){
                res.json({
                    "status": "not found",
                });
                db.exec(`INSERT INTO APIs (nome, produto, banco) VALUES ('${nome}', '${produto}', 'test')`, (err) => {
                    console.log(err);
                })
            }else {
                res.json({
                    "status": "found",
                    "info": row,
                });
            }
        });
    });
});

app.listen(8000, () => {
    console.log("Listening on http://localhost:8000")
})

process.on('exit', () => {
    db.close();
});