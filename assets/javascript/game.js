class fighter {
    constructor(name, attack, counter, health) {
        this.name = name;
        this.attack = this.levelUpValue = attack;
        this.counter = counter;
        this.health = health;
        this.htmlObject;
    }

    // Decrements health by damage taken, returns a bool stating whether a player is alive (true) or not (false).
    takeDamage(damage) {
        this.health -= damage;
        return this.health > 0;
    }

    levelup() {
        this.attack += this.levelUpValue;
    }

    set htmlObject(object) {
        this.htmlObject = object;
        this.htmlObject.click(function() {
            /* Not sure what to do here. When no character is selected I want it to assign this character as the PC. 
            If there's a PC this needs to select an opponent.
            If there's already an opponent this shouldn't do anything.
            This probably doesn't belong here */
        })
    }

    // Processes a fight and returns an array of combatants living status'.
    fight(opponent) {
        let playerLives = this.takeDamage(opponent.counter);
        let opponentLives = opponent.takeDamage(this.attack);
        return [playerLives, opponentLives];
    }

    print() {
        console.log("++++++++++++++++++");
        console.log("name:", this.name);
        console.log("attack:", this.attack);
        console.log("health:", this.health);
        console.log("counter:", this.counter);
        console.log("level up incrment:", this.levelUpValue);
        console.log("------------------");
    }
}

let game = {
    characters: [],
    playerCharacter: null,
    fighters: [],

    createFighters: function() {
        for (let i = 0; i < 2; i++) {
            this.fighters.push(new fighter("fighter " + i, 4 + i, 4 + i, 9 + i));
        }
    },

    tempStartGame: function() {
        this.createFighters();
        this.fighters[0].print();
        this.fighters[1].print();
        console.log("Fighting");
        console.log(this.fighters[0].fight(this.fighters[1]));
        this.fighters[0].print();
        this.fighters[1].print();
        console.log("Fighter 1 Leveling up");
        this.fighters[1].levelup();
        this.fighters[0].print();
        console.log(this.fighters[1].fight(this.fighters[0]));
    }
}

$(document).ready(function() {
    game.tempStartGame()
});