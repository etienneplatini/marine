const NBBOATS = 4;

// Representation
let XC21 = {};
let XC56 = {};
let XC100 = {};
let XC800 = {};
XC21.speed = 45;
XC56.speed = 90;
XC100.speed = 255;
XC800.speed = 360;

let currentState = {};
currentState.cost = 0;
currentState.heuristic = 0;
currentState.previous = null;
currentState[0] = {XC21, XC56, XC100, XC800};
currentState[1] = {};
currentState.name = "epart";

var opened = [];
var closed = [];
let bestNode;

let neighboursStates = [];

// // Fonction de représentation graphique d'un état
// function represent(state) {
//
//     let name = "\n";
//     for (let i = 0; i < state[0].length; i++) {
//         name += state[0][i].speed + " ";
//     }
//     name += "\n-----\n";
//     for (i = 0; i < state[1].length; i++) {
//         name += state[1][i].speed + " ";
//     }
//     name += "\n";
//
//     return name;
//
// }

function iMinTab(tab) {
    for (let i = 0; i < tab.length(); i++) {
        let min = 999999999;
        let iMin = null;
        if (tab[i].cost < min) {
            iMin = i;
        }
    }
    return iMin;
}

function represent(state, nommage) {
    if (nommage != null) {
        let name = "";
        for (let i = 0; i < state[0].length; i++) {
            name += state[0][i].speed + " ";
        }
        name += "||";
        for (i = 0; i < state[1].length; i++) {
            name += state[1][i].speed + " ";
        }
    }
    else {
        let name = "\n";
        for (let i = 0; i < state[0].length; i++) {
            name += state[0][i].speed + " ";
        }
        name += "\n-----\n";
        for (i = 0; i < state[1].length; i++) {
            name += state[1][i].speed + " ";
        }
        name += "\n";
    }
    return name;

}

function h_cost(state) {

}

// Fonction permettant de faire des copies profondes en javascript
function clone(obj){
    try{
        var copy = JSON.parse(JSON.stringify(obj));
    } catch(ex){
        console.log("Vous utilisez un compilateur / navigateur super vieux");
    }
    return copy;
}

// Fonction evaluant si l'etat est la cible
function isTarget(state){
    if(state[1].length == NBBOATS){
        return true;
    }
    else{
        return false;
    }
}

// Fonction retournant un tableau contenant tous les voisins
function transform(state) {

    let i;
    let j;
    let k;

    let ArrNewStates = [];

    let newState = {};
    let buffFinalState = {};

    // Premièrement, on bouge 2 bateaux vers la destination
    for (i = 0; i < currentState[0].length; i++) {
        // On ne déplace pas 2 fois le même bateau, et on ne déplace pas 2 fois le même set de bateaux
        for (j = i + 1; j < objState[0].length; j++) {
            newState = clone(currentState);
            newState.previous = currentState;

            newState.cost = Math.max(newState[0][i].speed, newState[0][j].speed) + currentState.cost;

            newState[1].push(newState[0][i]);
            newState[1].push(newState[0][j]);

            // On s'assure que on bouge toujours l'indice le plus haut en premier,
            newState[0].splice(j, 1);
            newState[0].splice(i, 1);

            // Puis, si on a pas l'état final, on ramène 1 bateau afin de servir d'escorte pour les prochains
            if (!(isTarget(newState))) {
                for (k = 0; k < newState[1].length; k++) {

                    buffFinalState = clone(newState);

                    buffFinalState.cost += buffFinalState[1][k].speed;

                    buffFinalState[0].push(buffFinalState[1][k]);
                    buffFinalState[1].splice(k, 1);
                    buffFinalState.name = represent(buffFinalState, 1);

                    // On ne cherche pas le chemin le plus court, on stocke ici tous les voisins de l'état actuel.
                    ArrNewStates.push(clone(buffFinalState));

                }
            }
            // Si on a l'état final, on le retourne et il sera traité par l'algorithme
            else {
                newState.name = "final";
                ArrNewStates.push(clone(newState));
            }
        }
    }
    return ArrNewStates;
}

// ########################  MAIN ########################  //
// #########  Approche informée - Algorithme A*  ######### //

while (currentState[1].length() <= 4) {
    neighboursStates = clone(transform(currentState));
    for (let i = 0; i < neighboursStates.length(); i++) {
        for (let j = 0; j < closed.length(); i++) {
            if (neighboursStates[i] == closed[j]) { //Faire une fonction isEqual
                // On enlève un état si il fait déjà parti de la liste fermée
                neighboursStates.splice(i, 1);
            }
        }

        for (let j = 0; j < opened.length(); i++) {
            if (neighboursStates[i] == opened[j]) { //Faire une fonction isEqual
                //Si un noeud voisin est déjà dans la liste ouverte et que son coût(f+h) est meilleur, on le met à jour
                opened[j] = clone(neighboursStates [i]);
            }
            else {
                opened.push(neighboursStates[i]); //Sinon, on l'y pousse
            }
        }
    }
    if (opened != null) {
        //On cherche l'état avec le plus faible coût total dans la liste ouverte, on le place dans le tableau des états fermés et on le met dans l'état courant
        currentState = clone(opened[iMinTab(opened)]);
        closed.push(currentState);
            //On retire l'état des états ouverts.
        opened.splice(iMinTab(opened), 1);
    }
    else {
        //Ca ne devrait jamais arriver car le graphe n'est pas coupé, mais sait-on jamais...
        console.log("ERREUR : L'algorithme n'a pas de solution");
    }

}

// ########## TESTS DIVERS VERS ########## //

// let State1 = {};
// State1.cost = 23;
// let State2 = {};
// State2.cost = 44;
// let State3 = {};
// State3.cost = 66;
//
// opened.push(State1);
// opened.push(State2);
// opened.push(State3);
//
// console.log(indexOf(Math.min(...opened.cost)));