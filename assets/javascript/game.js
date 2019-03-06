``
const BASE_HEALTH = 100;
const BASE_ATTACK = 10;
const BASE_COUNTER = 10;
const BASE_LEVEL_UP_VALUE = 5;
let playerCharacter = undefined;
let opponent = undefined;
let fighterCount = 0;



class fighter {
    constructor(name) {
        this.name = name;
        this.characterClass = "fighter";
        this.attack = BASE_ATTACK;
        this.counter = BASE_COUNTER;
        this.levelUpValue = BASE_LEVEL_UP_VALUE;
        this.health = this.startingHealth = BASE_HEALTH;
    }

    // Decrements health by damage taken, returns a bool stating whether a player is alive (true) or not (false).
    takeDamage(damage) {
        this.health -= damage;
        return this.health > 0;
    }

    levelUp() {
        this.attack += this.levelUpValue;
    }

    // Processes a fight and returns an array of combatants living status'.
    bout(opponentChar) {
        let playerLives = this.takeDamage(opponentChar.counter);
        let opponentLives = opponentChar.takeDamage(this.attack);
        return [playerLives, opponentLives];
    }

    print() {
        console.log("++++++++++++++++++");
        console.log("name:", this.name, "the", this.class);
        console.log("health:", this.health);
        console.log("attack:", this.attack);
        console.log("counter:", this.counter);
        console.log("level up incrment:", this.levelUpValue);
        console.log("------------------");
    }
}

// The barbarian starts with high health and damage but grows slowly at first. 
// As they are damaged, the rate at which they gain attack is increased.
class barbarian extends fighter {
    constructor(name) {
        super(name);
        this.characterClass = "barbarian";
        this.health = this.startingHealth = BASE_HEALTH * 2;
        this.attack = BASE_ATTACK * 1.25;
        this.counter = BASE_COUNTER * 1.25;
    }

    levelUp() {
        this.attack = Math.floor(this.attack * this.startingHealth / this.health);
    }
}

// The wizard starts off with low health and damage but grows faster than other classes.
class wizard extends fighter {
    constructor(name) {
        super(name);
        this.health = this.startingHealth = BASE_HEALTH * .75;
        this.attack = BASE_ATTACK * .5;
        this.counter = BASE_COUNTER * .5;
        this.characterClass = "wizard";
    }

    levelUp() {
        this.attack = Math.floor(this.attack * 1.25);
    }
}

// Rogue has higher than average damage but lower than average health. 
// Ambushes the opponent, getting an extra attack in when joining combat with an enemy.
class rogue extends fighter {
    constructor(name) {
        super(name);
        console.log("pre-update", this.characterClass);
        this.characterClass = "rogue";
        console.log("post-update", this.characterClass);
        this.health = this.startingHealth = BASE_HEALTH * .75;
        this.attack = BASE_ATTACK * 1.5;
        this.counter = BASE_COUNTER * 1.5;
    }
}

// Ranger has a wolf that adds attack and counter damage to the ranger. The wolf will take damage before the Ranger. 
// If the wolf is killed, the bonuses given to the ranger are removed. 
class ranger extends fighter {
    constructor(name) {
        super(name);
        this.wolfHealth = BASE_HEALTH * .75;
        this.wolfAttack = BASE_ATTACK * .5;
        this.wolfCounter = BASE_COUNTER * .5;
        this.health = this.startingHealth = BASE_HEALTH * .75;
        this.attack = BASE_ATTACK * 1 + this.wolfAttack;
        this.counter = BASE_COUNTER * 1 + this.wolfCounter;
        this.class = "ranger";
    }

    takeDamage(damage) {
        if (this.wolfHealth > 0) {
            this.wolfHealth -= damage;
            return true
        } else {
            this.attack -= this.wolfAttack;
            this.counter -= this.wolfCounter;
            this.wolfAttack = 0;
            this.wolfCounter = 0;
            return super.takeDamage(damage);
        }
    }

    bout(opponentChar) {
        let playerLives = this.takeDamage(opponentChar.counter);
        let opponentLives = opponentChar.takeDamage(this.attack + this.wolfAttack);
        return [playerLives, opponentLives];
    }

    print() {
        super.print();
        console.log("Wolf Health", this.wolfHealth);
        console.log("wolf Attack", this.wolfAttack);
        console.log("Wolf Counter", this.wolfCounter);
        console.log("----------------------")
    }
}

function createfighter(characterClass, characterName) {
    let character;
    switch (characterClass) {
        case "rogue":
            character = new rogue(characterName);
            break;
        case "ranger":
            character = new ranger(characterName);
            break;
        case "wizard":
            character = new wizard(characterName);
            break;
        case "barbarian":
            character = new barbarian(characterName);
            break;
        default:
            character = new fighter(characterName);
    }
    let button = $('<div class="col border mx-2" id="' + characterClass + '-button">' + characterClass + '</div>');
    button.click(function() {
        if (playerCharacter === undefined) {
            playerCharacter = character;
            $("#player-div").append(button.detach());
        } else if (opponent === undefined) {
            opponent = character;
            $("#opponent-div").append(button.detach());
            startCombat();
        }
    })
    fighterCount++;
    $("#character-pool").append(button);
}

function startCombat() {
    if (playerCharacter.characterClass === "rogue") {
        opponent.takeDamage(playerCharacter.attack);
        console.log("sneak attack!");
    }
    if (opponent.characterClass === "rogue") {
        playerCharacter.takeDamage(opponent.counter);
        console.log("opponent done sneaked!");
    }
    //show fight button
}

$("#fight-button").click(function() {
    if (playerCharacter != undefined && opponent != undefined) {
        let boutResult = playerCharacter.bout(opponent);
        console.log("a bout!", boutResult);
        console.log("pool", fighterCount);
        if (boutResult[0] === false) {
            console.log("game over!");
            //end game
        } else if (boutResult[1] === false) {
            opponent = undefined;
            $("#opponent-div>div").remove();
            console.log($("#character-pool>div"));
            if ($("#character-pool>div").length === 0) {
                console.log("You win!");
            }
        }

    }
});

$(document).ready(function() {
    createfighter("rogue", "rogue");
    createfighter("ranger", "ranger");
    createfighter("barbarian", "barbarian");
    createfighter("wizard", "wizard");

});