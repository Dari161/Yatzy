document.addEventListener('DOMContentLoaded', () => {

    // Function to roll a die (returns a number between 1 and 6)
    function roll() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // Get references to necessary DOM elements
    const rollBtn = document.getElementById('roll');
    const scoreSpan = document.getElementById('score');
    const rollsLeftSpan = document.getElementById('rollsLeft');
    const handDice = Array.from(document.getElementById('hand').children);
    let parsedHandDice = handDice.map(die => parseInt(die.innerText));

    // Get references to score placement elements for numbers 1 through 6
    const place6 = new Array(6);
    for (let i = 0; i < place6.length; ++i) {
        place6[i] = document.getElementById(`${i+1}`);
    }
    // Get references to score placement elements for special combinations
    const ofAKind3 = document.getElementById('3x');
    const ofAKind4 = document.getElementById('4x');
    const ofAKind5 = document.getElementById('5x');
    const fullHouse = document.getElementById('fullHouse');
    const largeStraight = document.getElementById('largeStraight');

    // Initialize game variables
    const rollsAllowed = 3;
    let rollsLeft = rollsAllowed;
    rollsLeftSpan.innerText = rollsLeft;

    let score = 0;
    let canPlace = false;

    // Add event listeners to dice for locking/unlocking
    handDice.forEach(die => {
        die.addEventListener('click', () => {
            if (canPlace) {
                die.dataset.locked = !(die.dataset.locked === 'true');
            }
        });
    });

    // Add event listeners to score placement elements
    [...place6, ofAKind3, ofAKind4, ofAKind5, fullHouse, largeStraight].forEach(element => {
        element.addEventListener('click', () => {
            if (canPlace && element.dataset.placable === 'true') {
                // Update score and reset for next round
                score += parseInt(element.innerText);
                element.dataset.placable = 'placed';
                rollsLeft = rollsAllowed;
                rollsLeftSpan.innerText = rollsLeft;
                rollBtn.disabled = false;
                scoreSpan.innerText = score;

                // Reset dice and placable elements
                handDice.forEach(die => {
                    die.innerHTML = '';
                    die.dataset.locked = 'false';
                });
                [...place6, ofAKind3, ofAKind4, ofAKind5, fullHouse, largeStraight].forEach(p => {
                    if (p.dataset.placable != 'placed') {
                        p.innerHTML = '';
                        p.dataset.placable = 'false';
                    }
                });
                handDice.forEach(die => {
                    die.innerText = '';
                });
                canPlace = false;
            }
        });
    });

    // Add event listener to roll button
    rollBtn.addEventListener('click', () => {
        if (rollsLeft > 0) {
            // Decrement rolls left and update display
            --rollsLeft;
            rollsLeftSpan.innerText = rollsLeft;

            // Roll unlocked dice
            handDice.forEach(die => {
                if (die.dataset.locked === 'false') {
                    die.innerText = roll();
                }
            });

            // Parse the rolled dice values
            parsedHandDice = handDice.map(die => parseInt(die.innerText));

            // Update potential scores for the '1-6' categories
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

            // Count occurrences of each die value
            let kinds = new Array(6).fill(0);
            parsedHandDice.forEach(die => {
                ++kinds[die-1];
            });

            // Determine scores for 'of a kind' and other combinations
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

            // Update 'of a kind' scores
            if (ofAKind3.dataset.placable != 'placed') {
                ofAKind3.innerText = ofAKind3Int;
            }
            if (ofAKind4.dataset.placable != 'placed') {
                ofAKind4.innerText = ofAKind4Int;
            }
            if (ofAKind5.dataset.placable != 'placed') {
                ofAKind5.innerText = ofAKind5Int;
            }

            // Update full house score
            if (fullHouse.dataset.placable != 'placed') {
                if (kind3 && kind2) {
                    fullHouse.innerText = 25;
                } else {
                    fullHouse.innerText = 0;
                }
            }

            // Update large straight score
            if (largeStraight.dataset.placable != 'placed') {
                const uniqueValues = kinds.filter(count => count >= 1).length;
                if (uniqueValues >= 5) {
                    largeStraight.innerText = 40;
                } else {
                    largeStraight.innerText = 0;
                }
            }

            // Mark all unplaced scores as placable
            [...place6, ofAKind3, ofAKind4, ofAKind5, fullHouse, largeStraight].forEach(p => {
                if (p.dataset.placable != 'placed') {
                    p.dataset.placable = 'true';
                }
            });

            // Allow player to place a score
            canPlace = true;

            // Disable roll button if no rolls left
            if (rollsLeft < 1) {
                rollBtn.disabled = true;
            }
        }
    });

});
