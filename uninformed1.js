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

// Etat courant est initialisé à l'état source
let currentState = {};
currentState[0] = [XC21, XC56, XC100, XC800];
currentState[1] = [];
currentState.cost = 0;
currentState.previous = null;

// Autres variables
let visited = [];
let queue = [currentState];

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

// Fonction de concatenation
function concatenate(arr1, arr2){

    arrReturn = clone(arr1);

    for(let i=0; i < arr2.length; i++){
        arrReturn.push(arr2[i]);
    }
    return arrReturn;
}

// Fonction evaluant si deux etats sont identiques, ou si le nouveau point a un cout inférieur
// renvoie true si state2 est plus lent ou aussi lent et égal a state1
function isEqualAndSlower(state1, state2){
    let i;
    let sum1;
    let sum2;

    // Il suffit de vérifier si le cout est le même sur un des deux tableaux
    for(i = 0; i < state1[0]; i++ ){
        sum1 += state1[0][i].speed;
    }
    for(i = 0; i < state2[0]; i++ ){
        sum2 += state2[0][i].speed;
    }

    // On vérifie ensuite si state2 a un cout inférieur a state1. Si oui on va y repasser.
    if (sum1 == sum2 && state2.cost >= state1.cost){
        return true;
    }
    else{
        return false;
    }


}

function isVisited(state){
    let i;
    for(i=0; i< visited.length; i++){
        if (isEqualAndSlower(visited[i], state)){
            return true;
        }
    }
    return false
}

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

function returnPath(state) {
    let path = "";

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
    let newState = {};
    let ArrNewStates = [];
    let buffFinalState = {};


    // Premièrement, on bouge 2 bateaux vers la destination
    for(i=0; i < currentState[0].length; i++){
        for(j=0; j < currentState[0].length; j++){
            newState = clone(currentState);
            newState.previous = currentState;

            // On ne déplace pas 2 fois le même bateau, et on ne déplace pas 2 fois le même set de bateaux
            if(i < j){

                newState.cost = Math.max(newState[0][i].speed, newState[0][j].speed) + currentState.cost;

                newState[1].push(newState[0][i]);
                newState[1].push(newState[0][j]);

                if(i > j){
                    newState[0].splice(i, 1);
                    newState[0].splice(j, 1);
                }
                else{
                    newState[0].splice(j, 1);
                    newState[0].splice(i, 1);
                }


                // Puis, si on a pas terminé, on ramène 1 bateau afin de servir d'escorte pour les prochains
                if(newState[0].length != 0){
                    for(k=0; k < newState[1].length; k++){

                        buffFinalState = clone(newState);

                        buffFinalState.cost += buffFinalState[1][k].speed;

                        buffFinalState[0].push(buffFinalState[1][k]);
                        buffFinalState[1].splice(k, 1);


                        // On vérifie si newState est dans visited

                        if(!(isVisited(buffFinalState))){
                            ArrNewStates.push(clone(buffFinalState));
                        }
                    }
                }
                ArrNewStates.push(clone(newState));
            }
        }
    }

    return ArrNewStates;
}


//////////     MAIN     \\\\\\\\\\

let nextStates = [];

while(queue.length > 0){

    currentState = clone(queue[0]);
    nextStates = transform(currentState);

    queue = concatenate(queue, nextStates);
    queue.sort(function(a, b){return a.cost - b.cost});

    if(isTarget(currentState)){
        path = returnPath(currentState);
        console.log(path);
        console.log(currentState.cost);
        break;
    }

    queue.shift();
}