require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'rendteszt'
});

//ADMIN jelszo: kicsinagy
app.route("/admin")
    .post(function (req, res) {
        const hash = process.env.ADMIN;
            if (!bcrypt.compareSync(req.body.password, hash))
                return res.status(401).send({ message: "Hibás jelszó!" })
    const token = jwt.sign(
        { password: req.body.password }, 
        process.env.TOKEN_SECRET, 
        { expiresIn: 3600 })
    res.json({ token: token, message: "Sikeres bejelentkezés." })
})
    .get(function(req, res) {
        const q = "SELECT r.rend_id AS id, r.rend_nev AS 'rend_nev', date_format(r.idopont, '%Y %M %d') AS 'idopont', h.helyszin_nev AS 'helyszin_nev'" + //, e.eloado_nev AS 'eloado_nev', " + "re.rend_id AS 'kapcs_rend', re.eloado_id AS 'kapcs_eloado'" +
            " FROM helyszin AS h INNER JOIN" +
            " rendezveny AS r" +
            " ON h.helyszin_id = r.helyszin_id INNER JOIN" +
            " rend_eloado AS re" +
            " ON r.rend_id = re.rend_id INNER JOIN" +
            " eloado AS e" +
            " ON re.eloado_id = e.eloado_id" +
            " GROUP BY rend_nev ORDER BY r.idopont DESC;"
        pool.query(q,
            function(error, results) {
                if (!error) {
                    res.send(results);
                } else {
                    res.send(error);
                }
            })
    })



//Token ellenőrzése middlewarrel
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token)
        return res.status(401).send({message: "Azonosítás szükséges"})
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) =>{
        if(err)
            return res.status(403).send({messgae: "Nincs jogoskutság!"})
        req.user = user
        next()
    })
};

app.route("/kezdolap")
    .get(function(req, res) {
        const q = "SELECT r.rend_id AS id, r.rend_nev AS 'rend_nev', date_format(r.idopont, '%Y %M %d') AS 'idopont', h.helyszin_nev AS 'helyszin_nev'" + //, e.eloado_nev AS 'eloado_nev', " + "re.rend_id AS 'kapcs_rend', re.eloado_id AS 'kapcs_eloado'" +
            " FROM helyszin AS h INNER JOIN" +
            " rendezveny AS r" +
            " ON h.helyszin_id = r.helyszin_id INNER JOIN" +
            " rend_eloado AS re" +
            " ON r.rend_id = re.rend_id INNER JOIN" +
            " eloado AS e" +
            " ON re.eloado_id = e.eloado_id" +
            " GROUP BY rend_nev ORDER BY r.idopont DESC;"
        ;
        pool.query(q,
            function(error, results) {
                if (!error) {
                    res.send(results);
                } else {
                    res.send(error);
                }
            })
    })
    .get(function(req, res) {
        const q = "SELECT e.eloado_nev AS eloadok, e.eloado_id AS eloado_id, re.rend_id AS rend_id FROM eloado as e" +
            "JOIN rend_eloado as re" +
            "ON e.eloado_id=re.eloado_id" +
            "JOIN rendezveny as r" +
            "ON re.rend_id=r.rend_id" +
            "WHERE re.rend_id=? AND re.eloado_id=e.eloado_id;";
        pool.query(q, [req.params.id],
            function(error, results) {
                if (!error) {
                    res.send(results);
                } else {
                    res.send(error);
                }
            })
    });
//Egy esemény törlése
/*app.route("/rendezveny/:id")
    .delete(function (req, res) {
        const q = "DELETE e.eloado_nev AS eloadok, e.eloado_id AS eloado_id, re.rend_id AS rend_id FROM eloado as e" +
        "JOIN rend_eloado as re" +
        "ON e.eloado_id=re.eloado_id" +
        "JOIN rendezveny as r" +
        "ON re.rend_id=r.rend_id" +
        "WHERE re.rend_id=? AND re.eloado_id=e.eloado_id WHERE id = ?";
        pool.query(q, [req.params.id], function (error, result) {
            if (!error) {
                res.send(result);
            } else {
                res.send(error);
            }
        });
    })
*/

app.route("/kezdolap/:id")
    .get(function(req, res) {
        const q = "SELECT r.rend_id, r.rend_nev, date_format(r.idopont, '%Y %M %d') AS 'idopont', r.kategoria, r.korosztaly, r.leiras, r.ar, h.helyszin_nev, e.eloado_nev " +
            " FROM helyszin AS h JOIN" +
            " rendezveny AS r" +
            " ON h.helyszin_id = r.helyszin_id JOIN" +
            " rend_eloado AS re" +
            " ON r.rend_id = re.rend_id JOIN" +
            " eloado AS e" +
            " ON re.eloado_id = e.eloado_id" +
            " WHERE r.rend_id = ?";
        pool.query(q, [req.params.id],
            function(error, results) {
                if (!error) {
                    res.send(results);
                } else {
                    res.send(error);
                }
            })
    })

app.route("/nevSzerint/")
    .get(function(req, res) {
        const q = "SELECT r.rend_id AS id, r.rend_nev AS 'rend_nev', date_format(r.idopont, '%Y %M %d') AS 'idopont', h.helyszin_nev AS 'helyszin_nev', e.eloado_nev AS 'eloado_nev' " +
            " FROM helyszin AS h INNER JOIN" +
            " rendezveny AS r" +
            " ON h.helyszin_id = r.helyszin_id INNER JOIN" +
            " rend_eloado AS re" +
            " ON r.rend_id = re.rend_id INNER JOIN" +
            " eloado AS e" +
            " ON re.eloado_id = e.eloado_id" +
            " GROUP BY rend_nev ORDER BY r.rend_nev;";
        pool.query(q, function(error, results) {
            if (!error) {
                res.send(results);
            } else {
                res.send(error);
            }
        })
    });


app.route("/keres/")
    .get(function(req, res) {
        const q = "SELECT r.rend_id AS id, r.rend_nev AS 'rend_nev', date_format(r.idopont, '%Y %M %d') AS 'idopont', h.helyszin_nev AS 'helyszin_nev', e.eloado_id AS eEloadoID, re.eloado_id AS reEloadoID, re.rend_id AS reRendID, e.eloado_nev AS 'eloado_nev'" +
            " FROM helyszin AS h INNER JOIN" +
            " rendezveny AS r" +
            " ON h.helyszin_id = r.helyszin_id INNER JOIN" +
            " rend_eloado AS re" +
            " ON r.rend_id = re.rend_id INNER JOIN" +
            " eloado AS e" +
            " ON re.eloado_id = e.eloado_id" +
            " WHERE lcase(e.eloado_nev) LIKE '%?%'" +
            " ORDER BY r.idopont DESC;";
        pool.query(q, [req.params.kereso],
            function(error, results) {
                if (!error) {
                    res.send(results);
                } else {
                    console.log(error);
                    res.send(error);
                }
            })
    });

//HOZZÁADÁS
app.route("/letrehozas")
    .post(function(req, res) {
        /*console.log(req.body);
        console.log(req.body.helyszin_nev);
        /*
        const event = {
            helyszin: "aasd",
            cim: "asd",
            leiras: "asd",
            email: "asd@asd.com",
            weblap: "asd@asdasd.com"
        }*/
        const q = "INSERT INTO helyszin (helyszin_nev, helyszin_cim, helyszin_bemutatas, email, weblap) VALUES (?, ?, ?, ?, ?);";
        pool.query(q, [req.body.helyszin_nev, req.body.helyszin_cim, req.body.helyszin_bemutatas, req.body.email, req.body.weblap],
            function(error, result) {
                if (!error){
                    res.send(result);
                } else {
                    res.send(error);
                }
            }
        )
    });

app.listen(3000, function() {
    console.log("Szerver - 3000 - elindítva")
})