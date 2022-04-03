
function bejelentkezve(id) {
    const url = 'http://localhost:3000/admin/';
    const lista = document.getElementById("rendezvenyek2");
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
                    "<button type='button' class='button' id='button" + id + "' onClick='bovebben(" + id + ")' style='vertical-align:middle'><span>Részletes infók</span></button>" +
                    "</div>";
            })
        })
        .catch(err => console.log(err));
}
function kijelentkezes(){
    delete sessionStorage.token
    document.location = "index.html"
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


bejelentkezve();