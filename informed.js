////////// INITIALISATION DU CHRONOMETRE \\\\\\\\\\
console.time("timer");

////////// VARIABLES \\\\\\\\\\

const NBBOATS = 4;

// Representation
let XC21 = {};
let XC56 = {};
let XC100 = {};
let XC800 = {};
let XC1000 = {};
XC21.speed = 45;
XC56.speed = 90;
XC100.speed = 255;
XC800.speed = 360;
XC1000.speed = 500;

// Etat actuel est initialisé à l'état source
let currentState = {};
currentState[0] = [XC21, XC56, XC100, XC800];
currentState[1] = [];
currentState.gCost = 0;
currentState.hCost = 0;
currentState.fCost = 0;
currentState.previous = null;

// Autres variables
let visited = [];
let queue = [currentState];
let nextStates = [];

////////// FONCTIONS \\\\\\\\\\

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

// Fonction de concatenation de tableaux
function concatenate(arr1, arr2){

    arrReturn = clone(arr1);

    for(let i=0; i < arr2.length; i++){
        arrReturn.push(arr2[i]);
    }
    return arrReturn;
}

// Fonction renvoyant vrai si state2 à la même disposition que state1 et un cout supérieur ou égal
// Cela permet de savoir si on devrai le rajouter à la queue ou pas
function isEqualAndSlower(state1, state2){
    let i;
    let sum1 = 0;
    let sum2 = 0;

    // Si le cout du premier tableau des deux états est le même, la disposition est identique
    for(i = 0; i < state1[0]; i++ ){
        sum1 += state1[0][i].speed;
    }
    for(i = 0; i < state2[0]; i++ ){
        sum2 += state2[0][i].speed;
    }

    // Si les dispositions sont identiques et le cout de state2 supérieur ou égal, on retourne vrai
    return sum1 === sum2 && state2.cost >= state1.cost;

}

// Fonction retournant vrai si l'état a été visité
// Rappel : un état est considéré comme visité ssi cette disposition est deja dans queue ET le cout de la disposition dans queue est inférieur ou égal au cout de l'état paramètre
function isVisited(state){
    let i;
    for(i=0; i< visited.length; i++){
        if (isEqualAndSlower(visited[i], state)){
            return true;
        }
    }
    return false
}

// Fonction de représentation graphique d'un état
function represent(state){

    let name = "\n";
    for (let i = 0; i < state[0].length; i++ ) {
        name += state[0][i].speed + " ";
    }
    name += "\n-----\n";
    for ( i = 0; i < state[1].length; i++ ) {
        name += state[1][i].speed + " ";
    }
    name += "\n";

    return name;

}

// Fonction retournant les états parvenant à l'état paramètre
function returnPath(state) {
    let path = "";

    // On épuise les états par récursion
    if(state.previous != null){
        path += returnPath(state.previous);
    }
    path += represent(state);
    return path;
}

// Fonction retournant un tableau contenant tous les etats possibles depuis un etat
function transform(state){

    let i;
    let j;
    let k;

    let ArrNewStates = [];

    let newState = {};
    let buffNewState = {};

    // Premièrement, on bouge 2 bateaux vers la destination
    for(i=0; i < currentState[0].length; i++){
        // On ne déplace pas 2 fois le même bateau, et on ne déplace pas 2 fois le même set de bateaux
        for(j=i+1; j < currentState[0].length; j++){
            newState = clone(currentState);
            newState.previous = currentState;

            newState.gCost = Math.max(newState[0][i].speed, newState[0][j].speed) + currentState.gCost;

            newState[1].push(newState[0][i]);
            newState[1].push(newState[0][j]);

            // On s'assure que on bouge toujours l'indice le plus haut en premier,
            newState[0].splice(j, 1);
            newState[0].splice(i, 1);

            // Puis, si on a pas l'état final, on ramène 1 bateau afin de servir d'escorte pour les prochains
            if(!(isTarget(newState))){
                for(k=0; k < newState[1].length; k++){

                    buffNewState = clone(newState);

                    buffNewState.gCost += buffNewState[1][k].speed;

                    buffNewState[0].push(buffNewState[1][k]);
                    buffNewState[1].splice(k, 1);

                    // On vérifie si il existe deja un chemin plus rapide ou aussi rapide dans visited avant de l'y ajouter
                    if(!(isVisited(buffNewState))){
                        buffNewState.hCost = h(buffNewState);
                        buffNewState.fCost = buffNewState.gCost + buffNewState.hCost;
                        ArrNewStates.push(clone(buffNewState));
                    }
                }
            }
            // Si on a l'état final, on le retourne et il sera traité par l'algorithme
            else{
                newState.hCost = h(newState);
                newState.fCost = newState.gCost + newState.hCost;
                ArrNewStates.push(clone(newState));
            }

        }
    }

    return ArrNewStates;
}

// Fonction heuristique
function h(state){
    let hCost = state[0].length;

    return hCost;

}

//////////     MAIN     \\\\\\\\\\



while(queue.length > 0){

    // Dans queue[0] se trouve l'état initial, puis ensuite l'état ayant le cout le plus faible donc celui à étudier
    currentState = clone(queue[0]);
    nextStates = transform(currentState);

    // On ajoute les états suivants découverts à la queue, et on la trie par cout des états
    queue = concatenate(queue, nextStates);
    queue.sort(function(a, b){return a.fCost - b.fCost});

    if(isTarget(currentState)){
        let path = returnPath(currentState);
        console.log(path);
        console.log(currentState.gCost);
        console.timeEnd("timer");
        break;
    }

    // Si l'etat actuel n'est pas l'état cible, on le retire de la queue (c'est celui qui a le cout le plus bas, soit queue[0])
    queue.shift();
}