/*
 * You can import it from another modules like this:
 * var mod = require('towerManager');
 * mod.thing == 'a thing'; // true
 */

function getTowers() {
    let towers = Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES, {
        filter: (towers) => towers.structureType === STRUCTURE_TOWER,
    });
    return towers;
}

function getHostiles(currTower) {
    let hostiles = currTower.room.find(FIND_HOSTILE_CREEPS);
    return hostiles;
}

function getHurtCreeps(currTower) {
    let hurtCreeps = currTower.room.find(FIND_MY_CREEPS, {
        filter: (creeps) => creeps.hits < creeps.hitsMax,
    });
    return hurtCreeps;
}

module.exports = {
    run: function towerManager() {
        let towers = getTowers();
        for (let i = 0; i < towers.length; i++) {
            let currTower = towers[i];
            let currHostile = getHostiles(currTower)[0];
            let currHurtCreep = getHurtCreeps(currTower)[0];
            if (currHostile !== undefined) {
                currTower.attack(currHostile);
            } else if (currHurtCreep !== undefined) {
                currHurtCreep.say("Oww );");
                currTower.heal(currHurtCreep);
            }
        }
    },
};
