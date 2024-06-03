
document.addEventListener('DOMContentLoaded', () => {

function roll() {
    return Math.floor(Math.random() * 6) + 1;
}

const rollBtn = document.getElementById('roll');
const scoreSpan = document.getElementById('score');
const rollsLeftSpan = document.getElementById('rollsLeft');
const handDice = Array.from(document.getElementById('hand').children);
let parsedHandDice = handDice.map(die => parseInt(die.innerText));
const rollsAllowed = 3;

const place6 = new Array(6);
for (let i = 0; i < place6.length; ++i) {
    place6[i] = document.getElementById(`${i+1}`);
}

const ofAKind3 = document.getElementById('3x');
const ofAKind4 = document.getElementById('4x');
const ofAKind5 = document.getElementById('5x');

const fullHouse = document.getElementById('fullHouse');

const largeStraight = document.getElementById('largeStraight');

let rollsLeft = rollsAllowed;
rollsLeftSpan.innerText = rollsLeft;

let score = 0;

let canPlace = false;

handDice.forEach(die => {
    die.addEventListener('click', () => {
        if (canPlace) {
            die.dataset.locked = !(die.dataset.locked === 'true');
        }
    });
});

[...place6, ofAKind3, ofAKind4, ofAKind5, fullHouse, largeStraight].forEach(element => {
    element.addEventListener('click', () => {
        if (canPlace && element.dataset.placable === 'true') {
            score += parseInt(element.innerText);
            element.dataset.placable = 'placed';
            rollsLeft = rollsAllowed;
            rollsLeftSpan.innerText = rollsLeft;
            rollBtn.disabled = false;
            scoreSpan.innerText = score;
            handDice.forEach(die => {
                die.innerHtml = '';
                die.dataset.locked = 'false';
            });
            [...place6, ofAKind3, ofAKind4, ofAKind5, fullHouse, largeStraight].forEach(p => {
                if (p.dataset.placable != 'placed') {
                    p.innerHtml = '';
                    p.dataset.placable = 'false';
                }
            });
            handDice.forEach(die => {
                die.innerText = '';
            });
        }
        canPlace = false;
    });
});

rollBtn.addEventListener('click', () => {
    if(rollsLeft > 0) {
        --rollsLeft;
        rollsLeftSpan.innerText = rollsLeft;
        handDice.forEach(die => {
            if (die.dataset.locked === 'false') {
                die.innerText = roll();
            }
        });
        parsedHandDice = handDice.map(die => parseInt(die.innerText));


        // itt kéne kiírni a leendő pontokat, meg disableolni ahol 0 pontot ér (ezt mégse kell)
        // és akk ott felül meg csak hozza kene adni a kiirt pontot

        for (let i = 0; i < place6.length; ++i) {
            if (place6[i].dataset.placable != 'placed') {
                let thisScore = 0;
                parsedHandDice.forEach(die => {
                    if (die == i + 1) {
                        thisScore += i + 1;
                    }
                });
                place6[i].innerText = thisScore;
            }
        }
        
        let kinds = new Array(6).fill(0);
        parsedHandDice.forEach(die => {
            ++kinds[die-1];
        });

        let ofAKind3Int = 0;
        let ofAKind4Int = 0;
        let ofAKind5Int = 0;
        
        let kind3 = false;
        let kind2 = false;
        let sum = 0;
        parsedHandDice.forEach(die => {
            sum += die;
        });
        for (let i = 0; i < kinds.length; ++i) {
            if (kinds[i] >= 3) {
                ofAKind3Int = sum;
                if (kinds[i] >= 4) {
                    ofAKind4Int = sum;
                    if (kinds[i] >= 5) {
                        ofAKind5Int = sum;
                        break;
                    }
                }
            }

            if (kinds[i] == 3) {
                kind3 = true;
            } else if (kinds[i] == 2) {
                kind2 = true;
            }

        }

        if (ofAKind3.dataset.placable != 'placed') {
            ofAKind3.innerText = ofAKind3Int;
        }
        if (ofAKind4.dataset.placable != 'placed') {
            ofAKind4.innerText = ofAKind4Int;
        }
        if (ofAKind4.dataset.placable != 'placed') {
            ofAKind5.innerText = ofAKind5Int;
        }

        if (fullHouse.dataset.placable != 'placed') {
            if (kind3 && kind2) { // Does 5 of a kind counts as fullHouse??? NO.
                fullHouse.innerText = 25; 
            } else {
                fullHouse.innerText = 0;
            }
        }

        if (largeStraight.dataset.placable != 'placed') {
            let sequence5 = true;
            for (let i = 1; i < handDice.length; ++i) {
                if (parsedHandDice[i-1] >= parsedHandDice[i]) {
                    sequence5 = false;
                }
            }
    
            if (sequence5) {
                largeStraight.innerText = 40;
            } else {
                largeStraight.innerText = 0;
            }
        }

        [...place6, ofAKind3, ofAKind4, ofAKind5, fullHouse, largeStraight].forEach(p => {
            if (p.dataset.placable != 'placed') {
                p.dataset.placable = 'true';
            }
        });
        canPlace = true;

        if(rollsLeft < 1) {
            rollBtn.disabled = true;
        }
    }
});

});
