////////// FONCTIONS \\\\\\\\\\

// Fonction permettant de faire des copies profondes en javascript
function clone(obj){
    let copy;

    try{
        copy = JSON.parse(JSON.stringify(obj));
    } catch(ex){
        console.log("Vous utilisez un compilateur / navigateur super vieux");
    }
    return copy;
}

// Fonction evaluant si l'etat est la cible en vérifiant la longueur de la cible.
function isTarget(state){
    return state[1].length === NBBOATS;
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

    // Si les dispositions sont identiques et le coût de state2 supérieur ou égal, on retourne vrai et on le rajoute à la queue
    return sum1 === sum2 && state2.cost >= state1.cost;

}

// Fonction retournant vrai si l'état a déjà été visité
// Rappel : un état est considéré comme visité ssi cette disposition est déjà dans queue ET le cout de la disposition dans la queue est inférieur ou égal au coût de l'état paramètre
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
    let i;
    let name = "\n";
    // On ajoute le premier tableau
    for (i = 0; i < state[0].length; i++ ) {
        name += state[0][i].speed + " ";
    }

    name += "\n-----\n";

    //On ajoute le second tableau
    for ( i = 0; i < state[1].length; i++ ) {
        name += state[1][i].speed + " ";
    }

    //On ajoute le bateau de sécurité qui a été bougé
    name += state.movedBack;
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
    //On affiche le chemin qui nous mènent à la solution
    path += represent(state);
    return path;
}

//Fonction retournant un tableau contenant tous les etats possibles depuis un etat courant
function transform(state){

    let i;
    let j;
    let k;

    let ArrNewStates = [];
    let newState = {};
    let buffFinalState = {};

    // Premièrement, on bouge 2 bateaux vers la destination
    for(i=0; i < state[0].length; i++){
        // On ne déplace pas 2 fois le même bateau, et on ne déplace pas 2 fois le même set de bateaux
        for(j=i+1; j < state[0].length; j++){

            newState = clone(state);
            newState.previous = state;

            //Le coût du déplacement est conditionné par le bateau le plus lent, et on le rajoute au coût total.
            newState.cost = Math.max(newState[0][i].speed, newState[0][j].speed) + state.cost;

            newState[1].push(newState[0][i]);
            newState[1].push(newState[0][j]);

            // On s'assure que on bouge toujours l'indice le plus haut en premier,
            newState[0].splice(j, 1);
            newState[0].splice(i, 1);

            // Puis, si on a pas l'état final, on ramène 1 bateau afin de servir d'escorte pour les prochains
            if(!(isTarget(newState))){
                for(k=0; k < newState[1].length; k++){

                    buffFinalState = clone(newState);

                    // On récupère le nom du bateau qui a été ramené avec l'escorte et on ajoute son coût au coût total
                    buffFinalState.movedBack = "(" + buffFinalState[1][k].speed + ")";
                    buffFinalState.cost += buffFinalState[1][k].speed;

                    //On le fait revenir au port de départ
                    buffFinalState[0].push(buffFinalState[1][k]);
                    buffFinalState[1].splice(k, 1);

                    // On vérifie si il existe deja un chemin plus rapide ou aussi rapide dans visited avant de l'y ajouter
                    if(!(isVisited(buffFinalState))){
                        ArrNewStates.push(clone(buffFinalState));
                    }
                }
            }
            // Si on a l'état final, on le retourne et il sera traité par l'algorithme
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

// Representation
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

// Etat actuel initialisé à l'état source
let currentState = {};
currentState[0] = [XC800, XC21, XC56, XC100];
currentState[1] = [];
currentState.cost = 0;
currentState.previous = null;
currentState.movedBack = "";

// Autres variables
let visited = [];
let queue = [currentState];
let nextStates = [];
let arrTargets = [];
let nodeVisited = 0;


//////////     MAIN     \\\\\\\\\\

while(queue.length > 0){
    nodeVisited ++;

    // Dans queue[0] se trouve l'état initial, suivit de l'état ayant le cout le plus faible, celui à étudier
    currentState = clone(queue[0]);
    //Si l'état visité est une solution, on l'ajoute au tableau des solutions que l'on triera plus tard
    if(isTarget(currentState)){
        arrTargets.push(clone(currentState));
    }
    nextStates = transform(currentState);

    // On ajoute les états suivants découverts à la queue, et on la trie par cout des états
    queue = queue.concat(nextStates);



    // Si l'etat actuel n'est pas l'état cible, on le retire de la queue (c'est celui qui a le cout le plus bas, soit queue[0])
    queue.shift();
}

//On trie le tableau des résultats du coût le plus faible au coût le plus fort pour en sortir le premier résultat comme solution
arrTargets.sort(function(a, b){return a.cost - b.cost});
let path = returnPath(arrTargets[0]);

console.log("Déplacements des batiments :");
console.log(path);
console.log("Durée du déplacement : " + arrTargets[0].cost + "mn");
console.log("Nombre de noeuds visités : " + nodeVisited);
