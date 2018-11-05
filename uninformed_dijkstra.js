////////// FONCTIONS \\\\\\\\\\

function clone(obj){
    let copy;
    try{
        copy = JSON.parse(JSON.stringify(obj));
    } catch(ex){
        console.log("Vous utilisez un compilateur / navigateur super vieux");
    }
    return copy;
}

function isTarget(state){
    return state[1].length === NBBOATS;
}

function isEqualAndSlower(state1, state2){
    let i;
    let sum1 = 0;
    let sum2 = 0;

    for(i = 0; i < state1[0]; i++ ){
        sum1 += state1[0][i].speed;
    }
    for(i = 0; i < state2[0]; i++ ){
        sum2 += state2[0][i].speed;
    }

    return sum1 === sum2 && state2.cost >= state1.cost;

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
    let i;
    let name = "\n";

    for (i = 0; i < state[0].length; i++ ) {
        name += state[0][i].speed + " ";
    }
    name += "\n-----\n";
    for ( i = 0; i < state[1].length; i++ ) {
        name += state[1][i].speed + " ";
    }
    name += state.movedBack;
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

function transform(state){

    let i;
    let j;
    let k;

    let ArrNewStates = [];

    let newState = {};
    let buffFinalState = {};

    for(i=0; i < state[0].length; i++){
        for(j=i+1; j < state[0].length; j++){
            newState = clone(state);
            newState.previous = state;

            newState.cost = Math.max(newState[0][i].speed, newState[0][j].speed) + state.cost;

            newState[1].push(newState[0][i]);
            newState[1].push(newState[0][j]);

            newState[0].splice(j, 1);
            newState[0].splice(i, 1);

            if(!(isTarget(newState))){
                for(k=0; k < newState[1].length; k++){

                    buffFinalState = clone(newState);

                    buffFinalState.movedBack = "(" + buffFinalState[1][k].speed + ")";

                    buffFinalState.cost += buffFinalState[1][k].speed;

                    buffFinalState[0].push(buffFinalState[1][k]);
                    buffFinalState[1].splice(k, 1);

                    if(!(isVisited(buffFinalState))){
                        ArrNewStates.push(clone(buffFinalState));
                    }
                }
            }
            else{
                newState.movedBack = "";
                ArrNewStates.push(clone(newState));
            }

        }
    }

    return ArrNewStates;
}


////////// VARIABLES \\\\\\\\\\

const NBBOATS = 4;

let XC21 = {};
let XC56 = {};
let XC100 = {};
let XC800 = {};
let XC1000 = {};
let XC2000 = {};
XC21.speed = 45;
XC56.speed = 90;
XC100.speed = 255;
XC800.speed = 360;
XC1000.speed = 500;
XC2000.speed = 780;

let currentState = {};
currentState[0] = [XC21, XC56, XC100, XC800];
currentState[1] = [];
currentState.cost = 0;
currentState.previous = null;
currentState.movedBack = "";

let visited = [];
let queue = [currentState];
let nextStates = [];
let nodeVisited = 0;


//////////     MAIN     \\\\\\\\\\

while(queue.length > 0){
    nodeVisited ++;

    currentState = clone(queue[0]);
    // Si l'état trouvé est la soltion, on affiche le résultat et le chemin pour y parvenir
    if(isTarget(currentState)){
        let path = returnPath(currentState);
        console.log("Déplacements des batiments :");
        console.log(path);
        console.log("Durée du déplacement : " + currentState.cost + "mn");
        console.log("Nombre de noeuds visités : " + nodeVisited);
        break;
    }
    nextStates = transform(currentState);

    queue = queue.concat(nextStates);
    // On trie la queue par ordre croissant afin de toujours visiter en premier les états au cout le plus faible
    queue.sort(function(a, b){return a.cost - b.cost});

    queue.shift();
}