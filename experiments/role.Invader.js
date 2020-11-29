/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.Invader');
 * mod.thing == 'a thing'; // true
 */
const supportBody = [TOUGH, TOUGH, TOUGH, WORK, HEAL, MOVE, MOVE, MOVE, MOVE];
const attackerBody = [TOUGH, TOUGH, TOUGH, ATTACK, MOVE, MOVE, MOVE];
const recoverEnergyBody = [CARRY, CARRY, MOVE, MOVE];
const currRoom = "invadeRoom";
const waitArea = "waitArea";
const roles = ["attacker", "support"];

const attackerCreepMemory = {
    cType: "invader",
    role: "attacker",
};

const supportCreepMemory = {
    cType: "invader",
    role: "support",
};

const energyRecoveryCreepMemory = {
    cType: "invader",
    role: "energyRecovery",
};

var groupedUp = false;

function getInvaderCreeps(role, any) {
    let invaderCreeps = [];
    let currRole = 0;
    for (const name in Game.creeps) {
        if (Game.creeps[name] !== undefined) {
            if (Game.creeps[name].memory.cType === "invader") {
                if (Game.creeps[name].memory.role === role || any) {
                    invaderCreeps.push(Game.creeps[name]);
                }
            }
        }
    }
    return invaderCreeps;
}

function spawnAttackerCreep() {
    Game.spawns["Spawn1"].spawnCreep(
        attackerBody,
        "invaderAttacker".concat(Game.time % 1000),
        { memory: attackerCreepMemory }
    );
}

function spawnSupportCreep() {
    Game.spawns["Spawn1"].spawnCreep(
        supportBody,
        "invaderSupport".concat(Game.time % 1000),
        { memory: supportCreepMemory }
    );
}

function spawnEnergyRecoveryCreep() {
    Game.spawns["Spawn1"].spawnCreep(
        recoverEnergyBody,
        "invaderEnergyRecovery".concat(Game.time % 1000),
        { memory: energyRecoveryCreepMemory }
    );
}

function getEnemyCreeps(currCreep) {
    let enemies = currCreep.room.find(FIND_HOSTILE_CREEPS);
    return enemies;
}

function getEnemyDefenseStructures(currCreep, any) {
    let enemyStructs = currCreep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: (structs) =>
            structs.structureType === STRUCTURE_TOWER ||
            structs.structureType === STRUCTURE_RAMPART ||
            structs.structureType === STRUCTURE_SPAWN ||
            any,
    });
    return enemyStructs;
}

function controlAttackerCreep(currCreep) {
    if (currCreep.room !== Game.flags[currRoom].room) {
        if (groupedUp === false) {
            currCreep.moveTo(Game.flags[waitArea]);
        } else {
            currCreep.say("Grr");
            currCreep.moveTo(Game.flags[currRoom]);
        }
    } else {
        let enemyStruct = currCreep.pos.findClosestByPath(
            getEnemyDefenseStructures(currCreep, false)
        );
        let enemyCreep = currCreep.pos.findClosestByPath(
            getEnemyCreeps(currCreep)
        );
        if (enemyCreep !== undefined) {
            if (currCreep.attack(enemyCreep) === ERR_NOT_IN_RANGE) {
                currCreep.moveTo(enemyCreep);
            }
        } else if (enemyStruct !== undefined) {
            if (currCreep.attack(enemyStruct) === ERR_NOT_IN_RANGE) {
                currCreep.moveTo(enemyStruct);
            }
        } else {
        }
    }
    if (Game.time % 1250 === 0) {
        groupedUp = true;
    }
    if (Game.time % 1337 === 0) {
        groupedUp = false;
    }
}

function controlSupportCreep(currCreep) {
    let myCreeps = currCreep.room.find(FIND_MY_CREEPS, {
        filter: (mycreeps) => mycreeps.hits < mycreeps.hitsMax,
    });
    if (currCreep.room !== Game.flags[currRoom].room) {
        if (groupedUp === false) {
            currCreep.moveTo(Game.flags[waitArea]);
        } else {
            currCreep.say("Grr");
            currCreep.moveTo(Game.flags[currRoom]);
        }
    } else if (currCreep.room === Game.flags[currRoom].room) {
        if (myCreeps.length !== 0) {
            currCreep.heal(currCreep.pos.findClosestByPath(myCreeps));
        } else {
            let enemyStructure = currCreep.pos.findClosestByPath(
                getEnemyDefenseStructures(currCreep, true)
            );
            if (currCreep.dismantle(enemyStructure) === ERR_NOT_IN_RANGE) {
                currCreep.moveTo(enemyStructure);
            }
        }
    }
}

function controlEnergyRecoveryCreep(currCreep) {
    if (currCreep.memory.isFull === undefined) {
        currCreep.memory.isFull = false;
    }
    if (
        currCreep.room !== Game.flags[currRoom].room &&
        currCreep.memory.isFull === false
    ) {
        currCreep.moveTo(Game.flags[currRoom]);
    } else if (currCreep.room === Game.flags[currRoom].room) {
        let droppedEnergy = currCreep.room.find(FIND_DROPPED_RESOURCES);
        currCreep.pickup(currCreep.pos.findClosestByPath(droppedEnergy));
    } else if (currCreep.memory.isFull === true) {
        if (currCreep.room !== Game.spawns["Spawn1"].room) {
            currCreep.moveTo(Game.spawns["Spawn1"].room);
        } else {
            let storage = currCreep.room.find(FIND_MY_STRUCTURES, {
                filter: (structs) =>
                    structs.structureType === STRUCTURE_STORAGE,
            });
            if (
                currCreep.transfer(storage, RESOURCE_ENERGY) ===
                ERR_NOT_IN_RANGE
            ) {
                currCreep.moveTo(storage);
            }
        }
    }
    if (currCreep.store.getFreeCapacity() == 0) {
        currCreep.memory.isFull = true;
    }
    if (currCreep.store.getUsedCapacity() == 0) {
        currCreep.memory.isFull = false;
    }
}

module.exports = {
    run: function () {
        let invaderCreeps = getInvaderCreeps("", true);
        for (let i = 0; i < invaderCreeps.length; i++) {
            if (invaderCreeps[i].memory !== undefined) {
                switch (invaderCreeps[i].memory.role) {
                    case "attacker":
                        controlAttackerCreep(invaderCreeps[i]);
                        break;
                    case "support":
                        controlSupportCreep(invaderCreeps[i]);
                        break;
                    case "energyRecovery":
                        controlEnergyRecoveryCreep(invaderCreeps[i]);
                        break;
                }
            }
        }
        if (Game.time % 40 === 0) {
            let spawnCode = -1;
            if (Game.time % 3 === 0) {
                spawnCode = spawnSupportCreep();
            } else {
                spawnCode = spawnAttackerCreep();
            }
            if (spawnCode === 0) {
                console.log("Spawning Attacker Creep");
            }
        }
        /*
    if (Game.time % 15 === 0) {
        spawnSupportCreep();
    } else if (Game.time % 40 === 0) {
        spawnAttackerCreep();
    } else if (Game.time % 55 === 0) {
        spawnEnergyRecoveryCreep();
    }
    */
    },
};
