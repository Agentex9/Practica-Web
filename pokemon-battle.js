// Pokemon Battle System
// =====================

// Global state
let battleState = {
    pokemon1: null,
    pokemon2: null,
    pokemon1Data: null,
    pokemon2Data: null,
    pokemon1Hp: 100,
    pokemon2Hp: 100,
    currentTurn: 1,
    maxTurns: 10,
    currentPlayer: 1,
    battleActive: false,
    pokemon1SpecialAttackTurns: 3,
    pokemon2SpecialAttackTurns: 3,
    pokemon1SpecialDefenseTurns: 2,
    pokemon2SpecialDefenseTurns: 2,
    battleLog: [],
    waitingForAction: false
};

// Pokémon data for attacks and stats
const pokemonAttacks = {
    fire: { name: 'Lanzallamas', minDamage: 25, maxDamage: 35, hitChance: 90 },
    water: { name: 'Hidrobomba', minDamage: 25, maxDamage: 35, hitChance: 90 },
    electric: { name: 'Rayo', minDamage: 20, maxDamage: 30, hitChance: 100 },
    grass: { name: 'Rayo Solar', minDamage: 20, maxDamage: 30, hitChance: 90 },
    normal: { name: 'Ataque Rápido', minDamage: 10, maxDamage: 15, hitChance: 95 },
    flying: { name: 'Remolino', minDamage: 15, maxDamage: 25, hitChance: 95 },
    psychic: { name: 'Psíquico', minDamage: 20, maxDamage: 30, hitChance: 90 },
    fighting: { name: 'Golpe Karate', minDamage: 25, maxDamage: 35, hitChance: 85 },
    poison: { name: 'Polvo Venenoso', minDamage: 15, maxDamage: 25, hitChance: 85 },
    ground: { name: 'Terremoto', minDamage: 20, maxDamage: 30, hitChance: 85 },
    rock: { name: 'Roca Afilada', minDamage: 20, maxDamage: 30, hitChance: 80 },
    bug: { name: 'Picotazo Venenoso', minDamage: 15, maxDamage: 25, hitChance: 90 },
    ghost: { name: 'Sombra', minDamage: 15, maxDamage: 25, hitChance: 85 },
    ice: { name: 'Rayo de Hielo', minDamage: 20, maxDamage: 30, hitChance: 90 },
    dragon: { name: 'Enfado del Dragón', minDamage: 30, maxDamage: 40, hitChance: 85 },
    dark: { name: 'Pulso Umbrío', minDamage: 20, maxDamage: 30, hitChance: 85 },
    steel: { name: 'Cabezada de Hierro', minDamage: 20, maxDamage: 30, hitChance: 85 },
    fairy: { name: 'Destello Mágico', minDamage: 20, maxDamage: 30, hitChance: 90 }
};

// Get type from pokemon data
function getTypeAttack(types) {
    if (!types || types.length === 0) return pokemonAttacks.normal;
    const type = types[0].type.name.toLowerCase();
    return pokemonAttacks[type] || pokemonAttacks.normal;
}

// Select Pokémon 1
async function selectPokemon1() {
    const input = document.getElementById('pokemon1Input').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    if (!input) {
        errorDiv.innerHTML = '<div class="error-message">Por favor, ingresa el nombre del Pokémon 1</div>';
        return;
    }

    const pokemon = await fetchPokemon(input);

    if (!pokemon) {
        errorDiv.innerHTML = `<div class="error-message">No se encontró el Pokémon: ${input}</div>`;
        return;
    }

    battleState.pokemon1 = pokemon.name;
    battleState.pokemon1Data = pokemon;
    document.getElementById('pokemon1Selected').textContent = `✓ ${pokemon.name.toUpperCase()} seleccionado`;
    errorDiv.innerHTML = '';
    checkIfCanStart();
}

// Select Pokémon 2
async function selectPokemon2() {
    const input = document.getElementById('pokemon2Input').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    if (!input) {
        errorDiv.innerHTML = '<div class="error-message">Por favor, ingresa el nombre del Pokémon 2</div>';
        return;
    }

    const pokemon = await fetchPokemon(input);

    if (!pokemon) {
        errorDiv.innerHTML = `<div class="error-message">No se encontró el Pokémon: ${input}</div>`;
        return;
    }

    battleState.pokemon2 = pokemon.name;
    battleState.pokemon2Data = pokemon;
    document.getElementById('pokemon2Selected').textContent = `✓ ${pokemon.name.toUpperCase()} seleccionado`;
    errorDiv.innerHTML = '';
    checkIfCanStart();
}

// Check if both pokémon are selected
function checkIfCanStart() {
    if (battleState.pokemon1 && battleState.pokemon2) {
        document.getElementById('startBattleBtn').style.display = 'block';
    }
}

// Start the battle
function startBattle() {
    document.getElementById('selectionPhase').style.display = 'none';
    document.getElementById('battlePhase').style.display = 'block';
    document.getElementById('startBattleBtn').style.display = 'none';

    // Initialize battle
    battleState.battleActive = true;
    battleState.battleLog = [];
    battleState.currentTurn = 1;
    battleState.currentPlayer = 1;
    battleState.pokemon1Hp = 100;
    battleState.pokemon2Hp = 100;
    battleState.pokemon1SpecialAttackTurns = 3;
    battleState.pokemon2SpecialAttackTurns = 3;
    battleState.pokemon1SpecialDefenseTurns = 2;
    battleState.pokemon2SpecialDefenseTurns = 2;

    // Display pokémon info
    document.getElementById('pokemon1Name').textContent = battleState.pokemon1.toUpperCase();
    document.getElementById('pokemon1Sprite').src = battleState.pokemon1Data.sprites.front_default;
    document.getElementById('pokemon2Name').textContent = battleState.pokemon2.toUpperCase();
    document.getElementById('pokemon2Sprite').src = battleState.pokemon2Data.sprites.back_default || battleState.pokemon2Data.sprites.front_default;

    // Update UI
    updateBattleUI();
    showCurrentPlayerTurn();

    // Start automatic battle
    setTimeout(() => {
        autoBattle();
    }, 1500);
}

// Update battle UI
function updateBattleUI() {
    // Update HP bars
    const pokemon1HpPercent = battleState.pokemon1Hp;
    const pokemon2HpPercent = battleState.pokemon2Hp;

    document.getElementById('pokemon1HpBar').style.width = pokemon1HpPercent + '%';
    document.getElementById('pokemon1HpBar').textContent = pokemon1HpPercent + '%';
    document.getElementById('pokemon1HpText').textContent = `${battleState.pokemon1Hp}/100`;

    document.getElementById('pokemon2HpBar').style.width = pokemon2HpPercent + '%';
    document.getElementById('pokemon2HpBar').textContent = pokemon2HpPercent + '%';
    document.getElementById('pokemon2HpText').textContent = `${battleState.pokemon2Hp}/100`;

    // Update turn counter
    document.getElementById('turnCounter').textContent = battleState.currentTurn;

    // Update special attack/defense cooldowns
    updateCooldownDisplay();
}

// Update cooldown display
function updateCooldownDisplay() {
    let p1SpecialAttack = battleState.pokemon1SpecialAttackTurns;
    let p1SpecialDefense = battleState.pokemon1SpecialDefenseTurns;
    let p2SpecialAttack = battleState.pokemon2SpecialAttackTurns;
    let p2SpecialDefense = battleState.pokemon2SpecialDefenseTurns;

    document.getElementById('pokemon1SpecialAttackTurns').textContent = 
        p1SpecialAttack === 0 ? 'Disponible' : `En ${p1SpecialAttack} turnos`;
    document.getElementById('pokemon1SpecialDefenseTurns').textContent = 
        p1SpecialDefense === 0 ? 'Disponible' : `En ${p1SpecialDefense} turnos`;

    document.getElementById('pokemon2SpecialAttackTurns').textContent = 
        p2SpecialAttack === 0 ? 'Disponible' : `En ${p2SpecialAttack} turnos`;
    document.getElementById('pokemon2SpecialDefenseTurns').textContent = 
        p2SpecialDefense === 0 ? 'Disponible' : `En ${p2SpecialDefense} turnos`;
}

// Show current player turn
function showCurrentPlayerTurn() {
    const playerName = battleState.currentPlayer === 1 ? battleState.pokemon1.toUpperCase() : battleState.pokemon2.toUpperCase();
    document.getElementById('currentPlayerTurn').textContent = `Turno de ${playerName}`;
}

// Delay helper function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto battle system
async function autoBattle() {
    while (battleState.battleActive && battleState.currentTurn <= battleState.maxTurns) {
        // Choose action randomly
        const action = chooseRandomAction();
        
        // Execute action
        const attacker = battleState.currentPlayer === 1 ? battleState.pokemon1Data : battleState.pokemon2Data;
        let actionLog = performAction(action, attacker);
        addToBattleLog(actionLog);

        // Update UI immediately after action
        updateBattleUI();

        // Check if battle should end
        if (battleState.pokemon1Hp <= 0 || battleState.pokemon2Hp <= 0) {
            battleState.battleActive = false;
            updateBattleUI();
            await delay(2000);
            endBattle();
            break;
        }

        // Decrease cooldowns
        if (battleState.pokemon1SpecialAttackTurns > 0) battleState.pokemon1SpecialAttackTurns--;
        if (battleState.pokemon1SpecialDefenseTurns > 0) battleState.pokemon1SpecialDefenseTurns--;
        if (battleState.pokemon2SpecialAttackTurns > 0) battleState.pokemon2SpecialAttackTurns--;
        if (battleState.pokemon2SpecialDefenseTurns > 0) battleState.pokemon2SpecialDefenseTurns--;

        // Switch to other player
        battleState.currentPlayer = battleState.currentPlayer === 1 ? 2 : 1;

        // Move to next turn when both players have acted
        if (battleState.currentPlayer === 1) {
            battleState.currentTurn++;
            if (battleState.currentTurn > battleState.maxTurns) {
                battleState.battleActive = false;
                updateBattleUI();
                await delay(2000);
                endBattle();
                break;
            }
        }

        // Update who's turn is next
        showCurrentPlayerTurn();

        // Wait before next action
        await delay(2500);
    }
}

// Choose random action
function chooseRandomAction() {
    const actions = ['attack', 'defense'];
    
    // Add special actions if cooldown allows
    if (battleState.currentPlayer === 1) {
        if (battleState.pokemon1SpecialAttackTurns === 0) {
            actions.push('specialAttack');
        }
        if (battleState.pokemon1SpecialDefenseTurns === 0) {
            actions.push('specialDefense');
        }
    } else {
        if (battleState.pokemon2SpecialAttackTurns === 0) {
            actions.push('specialAttack');
        }
        if (battleState.pokemon2SpecialDefenseTurns === 0) {
            actions.push('specialDefense');
        }
    }
    
    // Choose random action with higher probability for normal attacks
    const randomIndex = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * actions.length);
    return actions[randomIndex];
}

// Perform action
function performAction(action, attacker) {
    const isPlayer1 = battleState.currentPlayer === 1;
    const attackerName = isPlayer1 ? battleState.pokemon1 : battleState.pokemon2;

    let log = {
        turn: battleState.currentTurn,
        attacker: attackerName.toUpperCase(),
        action: '',
        damage: 0,
        missedFlag: false
    };

    if (action === 'attack') {
        const attackData = getTypeAttack(attacker.types);
        const hitRoll = Math.random() * 100;
        
        if (hitRoll < attackData.hitChance) {
            const damage = Math.floor(Math.random() * (attackData.maxDamage - attackData.minDamage + 1)) + attackData.minDamage;
            if (isPlayer1) {
                battleState.pokemon2Hp = Math.max(0, battleState.pokemon2Hp - damage);
            } else {
                battleState.pokemon1Hp = Math.max(0, battleState.pokemon1Hp - damage);
            }
            log.action = `usó ${attackData.name}`;
            log.damage = damage;
        } else {
            log.action = `intentó usar ${attackData.name}`;
            log.damage = 0;
            log.missedFlag = true;
        }
    } 
    else if (action === 'specialAttack') {
        const attackData = getTypeAttack(attacker.types);
        const specialDamageMultiplier = 1.5;
        const hitRoll = Math.random() * 100;

        if (isPlayer1) {
            battleState.pokemon1SpecialAttackTurns = 3;
        } else {
            battleState.pokemon2SpecialAttackTurns = 3;
        }

        if (hitRoll < attackData.hitChance * 0.85) {
            const damage = Math.floor((Math.random() * (attackData.maxDamage - attackData.minDamage + 1)) + attackData.minDamage) * specialDamageMultiplier;
            if (isPlayer1) {
                battleState.pokemon2Hp = Math.max(0, battleState.pokemon2Hp - damage);
            } else {
                battleState.pokemon1Hp = Math.max(0, battleState.pokemon1Hp - damage);
            }
            log.action = `usó ${attackData.name} ESPECIAL`;
            log.damage = Math.floor(damage);
        } else {
            log.action = `intentó usar ${attackData.name} ESPECIAL`;
            log.damage = 0;
            log.missedFlag = true;
        }
    }
    else if (action === 'defense') {
        const damageReduction = Math.floor(Math.random() * 8) + 5;
        const hitRoll = Math.random() * 100;

        if (hitRoll < 85) {
            log.action = `se defendió`;
            log.damage = -damageReduction;
            log.isDefense = true;
        } else {
            log.action = `intentó defenderse`;
            log.damage = 0;
            log.missedFlag = true;
        }
    }
    else if (action === 'specialDefense') {
        const damageReduction = Math.floor(Math.random() * 15) + 15;
        const hitRoll = Math.random() * 100;

        if (isPlayer1) {
            battleState.pokemon1SpecialDefenseTurns = 2;
        } else {
            battleState.pokemon2SpecialDefenseTurns = 2;
        }

        if (hitRoll < 80) {
            log.action = `se defendió ESPECIALMENTE`;
            log.damage = -damageReduction;
            log.isDefense = true;
        } else {
            log.action = `intentó defenderse especialmente`;
            log.damage = 0;
            log.missedFlag = true;
        }
    }

    return log;
}

// Add to battle log
function addToBattleLog(log) {
    const logElement = document.getElementById('battleLog');
    
    let entryHTML = `<div class="turn-entry">`;
    entryHTML += `<strong>Turno ${log.turn}:</strong> `;
    entryHTML += `<span class="pokemon-name">${log.attacker}</span> ${log.action}`;
    
    if (log.missedFlag) {
        entryHTML += ` <span class="miss">¡FALLÓ!</span>`;
    } else if (log.damage > 0) {
        entryHTML += ` → <span class="damage">${log.damage} de daño</span>`;
        const opponent = battleState.currentPlayer === 1 ? battleState.pokemon2 : battleState.pokemon1;
        const remainingHp = battleState.currentPlayer === 1 ? battleState.pokemon2Hp : battleState.pokemon1Hp;
        entryHTML += ` (${opponent.toUpperCase()} ahora tiene ${remainingHp}/100 HP)`;
    } else if (log.damage < 0) {
        entryHTML += ` → <span class="heal">Redujo daño en ${Math.abs(log.damage)}%</span>`;
    }
    
    entryHTML += `</div>`;
    logElement.innerHTML += entryHTML;
    logElement.scrollTop = logElement.scrollHeight;
}

// End battle
function endBattle() {
    battleState.battleActive = false;
    
    const endPhase = document.getElementById('battleEndPhase');
    endPhase.style.display = 'block';
    
    let winner = '';
    let message = '';
    let winnerSprite = '';

    if (battleState.pokemon1Hp <= 0) {
        winner = battleState.pokemon2.toUpperCase();
        winnerSprite = battleState.pokemon2Data.sprites.front_default;
        message = `¡${winner} GANA LA BATALLA!`;
    } 
    else if (battleState.pokemon2Hp <= 0) {
        winner = battleState.pokemon1.toUpperCase();
        winnerSprite = battleState.pokemon1Data.sprites.front_default;
        message = `¡${winner} GANA LA BATALLA!`;
    } 
    else {
        message = `¡BATALLA EMPATADA! Ambos Pokémon siguen en pie después de 10 turnos.`;
    }

    const html = `
        <div class="battle-end">
            <h2>${message}</h2>

            ${winnerSprite ? `<img src="${winnerSprite}" class="winner-sprite">` : ""}

            <p>Turno final: ${battleState.currentTurn - 1}</p>
            <p>${battleState.pokemon1.toUpperCase()}: ${Math.max(0, battleState.pokemon1Hp)}/100 HP</p>
            <p>${battleState.pokemon2.toUpperCase()}: ${Math.max(0, battleState.pokemon2Hp)}/100 HP</p>

            <button class="action-button" onclick="location.href='menu.html'" 
            style="margin-top: 20px; width: 200px;">
            Volver al Menú
            </button>
        </div>
    `;

    endPhase.innerHTML = html;
    document.getElementById('battleActions').style.display = 'none';
}
