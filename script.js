
document.addEventListener('DOMContentLoaded', () => {

function roll() {
    return Math.floor(Math.random() * 6) + 1;
}

const rollBtn = document.getElementById('roll');
const scoreSpan = document.getElementById('score');
const rollsLeftSpan = document.getElementById('rollsLeft');
const handDice = Array.from(document.getElementById('hand').children);
let parsedHandDice = handDice.map(die => parseInt(die.textContent));
const rollsAllowed = 3;

const place6 = new Array(6);
for (let i = 0; i < place6.length; ++i) {
    place6[i] = document.getElementById(`${i+1}`);
}

const ofAKind3 = document.getElementById('3x');
const ofAKind4 = document.getElementById('4x');

const fullHouse = document.getElementById('fullHouse');

const largeStraight = document.getElementById('largeStraight');

let rollsLeft = rollsAllowed;
rollsLeftSpan.innerText = rollsLeft;

let score = 0;

let canClick = true;

handDice.forEach(die => {
    die.addEventListener('click', function() {
        if (canClick) {
            this.dataset.locked = !(this.dataset.locked === 'true');
        }
    });
});

function sum() {
    let ret = 0;
    handDice.forEach(die => {
        ret += parseInt(die.innerText);
    });
    return ret;
}

/*place6.forEach(p => {
    p.addEventListener('click', function() {
        score += parseInt(p.innerText);
    });
});

ofAKind3.addEventListener('click', function() {
    score += parseInt(ofAKind3.innerText);
});

ofAKind4.addEventListener('click', function() {
    score += parseInt(ofAKind4.innerText);
});

fullHouse.addEventListener('click', function() {
    score += parseInt(fullHouse.innerText);
});

largeStraight.addEventListener('click', function() {
    score += parseInt(largeStraight.innerText);
});*/

function place () {
    rollsLeft = rollsAllowed;
    rollsLeftSpan.innerText = rollsLeft;
    rollBtn.disabled = false;
    scoreSpan.innerText = score;
    handDice.forEach(die => {
        die.innerText = '';
        die.dataset.locked = 'false';
    });
}

const addScoreOnClick = (element) => {
    element.addEventListener('click', function() {
        score += parseInt(element.innerText);
        place();
    });
};

place6.forEach(p => addScoreOnClick(p));
[ofAKind3, ofAKind4, fullHouse, largeStraight].forEach(addScoreOnClick);


/*document.getElementById('1').addEventListener('click', () => {
    handDice.forEach(dice => {
        if (dice.innerText == '1') {
            score += 1;
        }
    });
    place();
});

document.getElementById('2').addEventListener('click', () => {
    handDice.forEach(dice => {
        if (dice.innerText == '2') {
            score += 2;
        }
    });
    place();
});

document.getElementById('3').addEventListener('click', () => {
    handDice.forEach(dice => {
        if (dice.textContent == '3') {
            score += 3;
        }
    });
    place();
});*/

rollBtn.addEventListener('click', () => {
    if(rollsLeft > 0) {
        --rollsLeft;
        rollsLeftSpan.textContent = rollsLeft;
        handDice.forEach(die => {
            if (die.dataset.locked === 'false') {
                die.innerText = roll();
            }
        });
        parsedHandDice = handDice.map(die => parseInt(die.textContent));


        // itt kéne kiírni a leendő pontokat, meg disableolni ahol 0 pontot ér (ezt mégse kell)
        // és akk ott felül meg csak hozza kene adni a kiirt pontot

        for (let i = 0; i < place6.length; ++i) {
            let thisScore = 0;
            parsedHandDice.forEach(die => {
                if (die == i + 1) {
                    thisScore += i + 1;
                }
            });
            place6[i].innerText = thisScore;
        }
        
        let kinds = new Array(6).fill(0);
        parsedHandDice.forEach(die => {
            ++kinds[die-1];
        });

        let ofAKind3Int = 0;
        let ofAKind4Int = 0;
        
        let kind3 = false;
        let kind2 = false;
        for (let i = 0; i < kinds.length; ++i) {
            if (kinds[i] >= 3) {
                ofAKind3Int = sum();
                if (kinds[i] >= 4) {
                    ofAKind4Int = sum();
                    break;
                }
            }

            if (kinds[i] == 3) {
                kind3 = true;
            } else if (kinds[i] == 2) {
                kind2 = true;
            }

        }

        ofAKind3.innerText = ofAKind3Int;
        ofAKind4.innerText = ofAKind4Int;

        if (kind3 && kind2) { // Does 5 of a kind counts as fullHouse???
            fullHouse.innerText = 25;
        } else {
            fullHouse.innerText = 0;
        }

        sequence5 = true;
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

        if(rollsLeft < 1) {
            rollBtn.disabled = true;
        }
    }
});

});
