# unit-4-game

## Game States
0. Setup game.
    1. create fighters
    2. create HTML objects
    3. assign fighters to their objects
1. Waiting To Start
2. Player Taps on a character
3. Game Starts in state with no enemy
4. Player Taps on a character to battle
5. Enemy is selected
6. Player takes turn (Player deals attack to enemy, enemy does counter-attack damage to player).
7. Player attack is increased.
8. Check for battle end.
    1. Player health <= 0 == game over
    2. Enemy health <= 0 == Battle Won
9. If battle continues GOTO 6.
10. If battle is over and was won, GOTO 4. 

## Thoughts
- characters should be of a class
- gameplay can still be an object

## Profile for fighters
Barbarian - High health high damage low scaling (increase damage when below half health)
Wizard - low health low damage high scaling (Heals self on enemy defeat)
rogue - low health high attack med scaling (extra attack at start of combat)
ranger - high health high damage med scaling (Has wolf which is attacked first, loses attack & counter when the wolf dies)


Art taken from https://www.artstation.com/jpbalmet