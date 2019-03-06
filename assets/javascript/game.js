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
        this.attack = Math.floor(BASE_ATTACK);
        this.counter = Math.floor(BASE_COUNTER);
        this.levelUpValue = Math.floor(BASE_LEVEL_UP_VALUE);
        this.health = this.startingHealth = Math.floor(BASE_HEALTH);
        this.text = "The basic combatant. Basically just a well equipped villager.";
        this.imageLink = "assets/images/wizard.jpg";
    }

    // Decrements health by damage taken, returns a bool stating whether a player is alive (true) or not (false).
    takeDamage(damage) {
        this.health -= damage;
        $("#" + this.characterClass + "-health").replaceWith($("<span id='" + this.characterClass + "-health'>" + this.health + "<span>"));
        return this.health > 0;
    }

    levelUp() {
        this.attack += this.levelUpValue;
        $("#" + this.characterClass + "-attack").replaceWith($("<span id='" + this.characterClass + "-attack'>" + this.attack + "<span>"));
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
        this.imageLink = "assets/images/barbarian.jpg";
        this.health = this.startingHealth = Math.floor(BASE_HEALTH * 2);
        this.attack = Math.floor(BASE_ATTACK * 1.25);
        this.counter = Math.floor(BASE_COUNTER * 1.25);
        this.text = "A hardy warrior whose gains increase the lower her health is."
    }

    levelUp() {
        this.attack = Math.floor(this.attack * this.startingHealth / this.health);
        $("#" + this.characterClass + "-attack").replaceWith($("<span id='" + this.characterClass + "-attack'>" + this.attack + "<span>"));
    }
}

// The wizard starts off with low health and damage but grows faster than other classes.
class wizard extends fighter {
    constructor(name) {
        super(name);
        this.characterClass = "wizard";
        this.imageLink = "assets/images/wizard.jpg";
        this.health = this.startingHealth = Math.floor(BASE_HEALTH * 1);
        this.attack = Math.floor(BASE_ATTACK * .75);
        this.counter = Math.floor(BASE_COUNTER * .75);
        this.text = "Frail but a fast learner. Heals herself at the end of combat.";
    }

    levelUp() {
        this.attack = Math.floor(this.attack * 1.5);
        $("#" + this.characterClass + "-attack").replaceWith($("<span id='" + this.characterClass + "-attack'>" + this.attack + "<span>"));
    }
}

// Rogue has higher than average damage but lower than average health. 
// Ambushes the opponent, getting an extra attack in when joining combat with an enemy.
class rogue extends fighter {
    constructor(name) {
        super(name);
        this.characterClass = "rogue";
        this.imageLink = "assets/images/rogue.jpg";
        this.health = this.startingHealth = Math.floor(BASE_HEALTH * .75);
        this.attack = Math.floor(BASE_ATTACK * 1.5);
        this.counter = Math.floor(BASE_COUNTER * 1.5);
        this.text = "Ambushes the opponent at the beginning of combat";
    }
}

// Ranger has a wolf that adds attack and counter damage to the ranger. The wolf will take damage before the Ranger. 
// If the wolf is killed, the bonuses given to the ranger are removed. 
class ranger extends fighter {
    constructor(name) {
        super(name);
        this.characterClass = "ranger";
        this.imageLink = "assets/images/ranger.jpg";
        this.wolfHealth = Math.floor(BASE_HEALTH * .75);
        this.wolfAttack = Math.floor(BASE_ATTACK * .5);
        this.wolfCounter = Math.floor(BASE_COUNTER * .5);
        this.health = this.startingHealth = Math.floor(BASE_HEALTH * .75);
        this.attack = BASE_ATTACK * 1 + this.wolfAttack;
        this.counter = BASE_COUNTER * 1 + this.wolfCounter;
        this.text = "Has a wolf friend who distracts opponents and aids in combat.";
    }

    takeDamage(damage) {
        if (this.wolfHealth > 0) {
            this.wolfHealth -= damage;
            $("#" + this.characterClass + "-health").replaceWith($("<span id='" + this.characterClass + "-health'>" + this.health + "<span>"));
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
    // This mess constructs a character card
    let button = $('<div class="col my-card" style="background-image:url(' + character.imageLink + ')"><div class="row"><div class="col my-card-title"><h2 class="my-card-title-text">' + character.characterClass + '</h2></div></div><div class="row my-card-img-spacer"></div><div class="row my-card-text-container"><div class="col-4 my-card-side-tab-container"><div class="row"><div class="col border my-card-side-tab"><i class="fas fa-fist-raised"></i><span class="attack-span" id="' + character.characterClass + '-attack">' + character.attack + '</span></div></div><div class="row"><div class="col border my-card-side-tab"><i class="fas fa-undo"></i><span class="counter-span" id="' + character.characterClass + '-counter">' + character.counter + '</span></div></div><div class="row"><div class="col border my-card-side-tab"><i class="fas fa-heart"></i><span class="health-span" id="' + character.characterClass + '-health">' + character.health + '</span></div></div></div><div class="col-8"><span class="my-card-class-text">' + character.text + '</span></div></div></div>')

    button.click(function() {
        if (playerCharacter === undefined) {
            playerCharacter = character;
            $("#player-div").append(button.detach());
            fighterCount--;
        } else if (opponent === undefined) {
            opponent = character;
            $("#opponent-div").append(button.detach());
            fighterCount--;
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
        playerCharacter.levelUp();
    }
    if (opponent.characterClass === "rogue") {
        playerCharacter.takeDamage(opponent.counter);
        console.log("opponent done sneaked!");
    }
}

$("#fight-button").click(function() {
    if (playerCharacter != undefined && opponent != undefined) {
        let boutResult = playerCharacter.bout(opponent);
        if (boutResult[0] === false) {
            console.log("game over!");
            //end game
        } else if (boutResult[1] === false) {
            if (playerCharacter.characterClass === "wizard") {
                playerCharacter.health = Math.min(playerCharacter.health + playerCharacter.attack, playerCharacter.startingHealth);
            }
            opponent = undefined;
            console.log($("#opponent-div>div"));
            $("#character-pool").append($("#opponent-div>div").detach());
            if (fighterCount === 0) {
                console.log("You win!");
            }
        }
        playerCharacter.levelUp();
    }
});

$(document).ready(function() {
    createfighter("rogue", "rogue");
    createfighter("ranger", "ranger");
    createfighter("barbarian", "barbarian");
    createfighter("wizard", "wizard");

});