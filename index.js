let id;

//Bejelentkezés
document.getElementById("login").onclick = function () {
    const url = 'http://localhost:3000/admin';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "password": document.getElementById("password").value,
        })
    })
        .then(res => {
            ok = res.ok
            return res.json()
        })
        .then(json => {
            document.getElementById("uzenet2").innerHTML = json.message
            if (ok) {
                sessionStorage.token = json.token
                document.location = "menu-bar.html"
                
            }
        })
        .catch(err => console.log(err));
}
//Kijelentkezes
function kijelentkezes(){
    delete sessionStorage.token
    document.location = "index.html"
}

function kezdolap(id) {
    const url = 'http://localhost:3000/kezdolap/';
    const lista = document.getElementById("rendezvenyek");
    fetch(url)
        .then((response) => response.json())
        .then(json => {
            lista.innerHTML = "";
            json.forEach(f => {
                id = f.id;
                lista.innerHTML +=
                    "<div class='card h-150 col-lg-3' id='" + id + "'>" +
                    "<p id='rendNev'>" + f.rend_nev + "</p>" +
                    "<p>" + f.idopont + "</p>" +
                    "<template id='eloado' id='eloado_nev'></template>" +
                    "<p>" + f.helyszin_nev + "</p>" +
                    "<button type='button' class='button' id='button" + id + "' onClick='bovebben(" + id + ")' style='vertical-align:middle'>Részletes infók</button>" +
                    "</div>";
            })
        })
        .catch(err => console.log(err));
}

function bovebben(id) {
    const url = 'http://localhost:3000/kezdolap/' + id;
    const lista = document.getElementById("rendezvenyek");
    lista.innerHTML = "";
    fetch(url)
        .then((response) => response.json())
        .then(json => {
            console.log(json),
                lista.innerHTML = "";
            lista.innerHTML += "<div class='card col-sm-4' >" +
                "<p><h2>" + json[0].rend_nev + "</h2></p>" +
                "<p>Időpont: " + json[0].idopont + "</p>" +
                "<p>Fellépők: " + json[0].eloado_nev + "</p>" +
                "<p>Helyszín: " + json[0].helyszin_nev + "</p>" +
                "<p>Kategória: " + json[0].kategoria + "</p>" +
                "<p id='leiras'>Esemény leírása: " + json[0].leiras + "</p>" +
                "<p>Ár: " + json[0].ar + "</p>" +
                "</div>";
        })
        .catch((err) => console.log(err));
}

function nevSzerint() {
    const url = 'http://localhost:3000/nevSzerint/';
    const lista = document.getElementById("rendezvenyek");
    fetch(url)
        .then((response) => response.json())
        .then(json => {
            lista.innerHTML = "";
            json.forEach(f => {
                id = f.id;
                lista.innerHTML += "<div class='card h-150 col-lg-3' id='" + id + "'>" +
                    "<p id='rendNev'>" + f.rend_nev + "</p>" +
                    "<p>" + f.idopont + "</p>" +
                    "<template id='eloado' id='eloado_nev'></template>" +
                    //"<p>" + f.helyszin_nev + "</p>" +
                    "<button type='button' class='button' id='button" + id + "' onClick='bovebben(" + id + ")' style='vertical-align:middle'><span>Részletes infók</span></button>" +
                    "</div>";
            })
        })
        .catch(err => console.log(err));
}

function keres() {
    const url = 'http://localhost:3000/keres/';
    const lista = document.getElementById("rendezvenyek");
    fetch(url)
        .then((response) => response.json())
        .then(json => {
            lista.innerHTML = "";
            json.forEach(f => {
                id = f.id;
                lista.innerHTML +=
                    "<div class='card' id='" + id + "'>" +
                    "<p>" + f.rend_nev + "</p>" +
                    "<p>" + f.idopont + "</p>" +
                    "<p>" + f.eloado_nev + "</p>" +
                    "<p>" + f.helyszin_nev + "</p>" +
                    "<button type='button' class='button' id='button" + id + "' onClick='bovebben(" + id + ")' style='vertical-align:middle'><span>Bővebben</span></button>" +
                    "</div>" +
                    "</div>";
            })
        })
        .catch(err => console.log(err));
}

//LÉTREHOZÁS
function letrehozas(){
    //console.log("letrehozas elindult...");
    const helyszin = document.getElementById("helyszin").value;
    const cim = document.getElementById("cim").value;
    const leiras = document.getElementById("leiras").value;
    const email = document.getElementById("email").value;
    const weblap = document.getElementById("weblap").value;
    const url = 'http://localhost:3000/letrehozas';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify ({
            "helyszin_nev": helyszin,
            "helyszin_cim": cim,
            "helyszin_bemutatas": leiras,
            "email": email,
            "weblap": weblap
        })      
    }) 
    .then(json=>console.log(json))  
    .catch(err=>console.log(err));    
}


kezdolap();
//console.log("sikeresen elindult 🟢")