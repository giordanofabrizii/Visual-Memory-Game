const dizionario = { // attribuisce il giusto numero di caselle da generare rispetto al livello
    '1': '3',
    '2': '3',
    '3': '4',
    '4': '4',
    '5': '4',
    '6': '5',
    '7': '5',
    '8': '5',
    '9': '6',
};

var current_level = 1; // livello del gioco
var numero_da_indovinare = 3;
var id_da_indovinare = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function startGame() {
    document.getElementById("pre_game").style.display = 'none';;
    document.getElementById("game").style.display = 'block';

    newLevel();
}

async function newLevel() {
    id_da_indovinare = [] // pulizia degli id precedenti
    var numero_di_caselle = parseInt(dizionario[current_level]) ** 2 // aggiorna il numero di caselle da creare
    document.getElementById("level_value").innerHTML = current_level;

    //eliminare tutte le caselle precedenti
    var cards = document.getElementById('cards');
    while (cards.firstChild) {
      cards.removeChild(cards.firstChild);
    }

    // generare nuove caselle
    for (var i = 0; i < numero_di_caselle; i++) {
        var nuova_casella = document.createElement('div');
        nuova_casella.id = i;
        nuova_casella.classList.add("carta", "sbagliata");
        cards.appendChild(nuova_casella);
      }

    // definisci le caselle giuste
    for (i=0; i < numero_da_indovinare; i++) {
        var id;

        do {
            id = Math.floor(Math.random() * numero_di_caselle);
          } while (id_da_indovinare.includes(id));

        id_da_indovinare.push(id);
    }
    
    // sistemare la visualizzazione delle caselle
    var griglia = document.getElementById('cards');
    griglia.style.gridTemplateColumns = "repeat(" + Number(dizionario[current_level]) + ", 1fr)";

    // visualizzare temporaneamente le caselle
    let promesseColore = id_da_indovinare.map(async (id) => {
        await sleep(500);
        let casella = document.getElementById(id);
        casella.style.backgroundColor = 'green';

        await sleep(800); // tempo di visualizzazione di quelle da cliccare

        casella.style.backgroundColor = 'white';
    });
    await Promise.all(promesseColore);

    var caselle = Array.from(document.getElementsByClassName('carta'));
    caselle.forEach((c) => c.addEventListener('click', controllaClick));
}

async function controllaClick(e) {
    let id = parseInt(e.target.id); // converte l'id in un intero
    if (id_da_indovinare.includes(id)) { // se la casella era da cliccare
        let casella = document.getElementById(id);
        casella.style.backgroundColor = 'green';
        id_da_indovinare = id_da_indovinare.filter(item => item !== id); // rimuove il valore dalla lista
        casella.removeEventListener('click',controllaClick); // rimuove il click per non iterare piu volte

        if (id_da_indovinare.length === 0) {// se sono finiti gli id da indovinare
            await sleep(800);
            numero_da_indovinare++;
            if (current_level == 9) { // finisce il gioco
                document.getElementById("game").style.display = "none";
                document.getElementById("vittoria").style.display = "flex";

                // reset
                current_level = 1; // livello del gioco
                numero_da_indovinare = 3;
            } 

            current_level++; // incrementa livello
            newLevel();   
        }
    } else {
        // colora diverso
        let casella = document.getElementById(id);
        casella.style.backgroundColor = 'blue';

        // hai perso
        document.getElementById("game").style.display = "none";
        document.getElementById("sconfitta").style.display = "flex";
        
        //resetta 
        current_level = 1; // livello del gioco
        numero_da_indovinare = 3;
        id_da_indovinare = []

    }
}

newLevel()