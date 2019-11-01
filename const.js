class Enum{
    constructor(constantsList){
        for (let index = 0; index < constantsList.length; index++) {
            this[constantsList[index]] = index;   
            this.length = index + 1;
        }
    }
}

const ID = new Enum(
    ["BG","PLAYER",
    "ARROW_1","ARROW_2",
    "FX","BALL1"]
);

var OBJECT;
var IMAGE;
var STATE;

const LOOP_TIME = 60;