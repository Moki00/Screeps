/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.Workers');
 * mod.thing == 'a thing'; // true
 */
const jobOrder = ["harvester", "builder", "maintenance", "upgrader"];
const utilityCreepBody = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; //COST: 550
const cleanerCreepBody = [
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
]; //COST: 700
const creepMemory = {
    cType: "utility",
    isFull: false,
    currentJob: undefined,
};
const cleanerCreepMemory = {
    cType: "cleaner",
    isFull: false,
    currentJob: undefined,
};
const numHarvesters = 4;
const numBuilders = 2;
const numMaintainers = 2;
const numUpgraders = 2;
const numCleaners = 1;

function emergencyCreepSpawn() {
    let EmergencyCreepMemory = {
        cType: "utility",
        isFull: false,
    };
    let status = Game.spawns["Spawn1"].spawnCreep(
        [WORK, CARRY, MOVE],
        "Emergency",
        { memory: EmergencyCreepMemory }
    );
    let emergencyMsg = "Game ran out of creeps, spawned emergency creep with status ".concat(
        status
    );
    Game.notify(emergencyMsg);
}

function getEnergySources(currRoom) {
    let energyResources = currRoom
        .find(FIND_SOURCES, {
            filter: (sources) =>
                sources.energy > 0 || sources.ticksToRegeneration < 20,
        })
        .map((sources) => sources.id);
    return energyResources;
}

function getOpenExtensions(currRoom) {
    let extensions = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (extensions) =>
            extensions.structureType === STRUCTURE_EXTENSION &&
            extensions.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    return extensions;
}

function getFullExtensions(currRoom) {
    let extensions = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (extensions) =>
            extensions.structureType === STRUCTURE_EXTENSION &&
            extensions.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    return extensions;
}

function getOpenContainers(currRoom) {
    let containers = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (containers) =>
            containers.structureType === STRUCTURE_CONTAINER &&
            containers.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    return containers;
}

function getFullContainers(currRoom) {
    let containers = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (containers) =>
            containers.structureType === STRUCTURE_CONTAINER &&
            containers.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    return containers;
}

function getOpenStorages(currRoom) {
    let storages = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (storages) =>
            storages.structureType === STRUCTURE_STORAGE &&
            storages.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    return storages;
}

function getFullStorages(currRoom) {
    let storages = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (storages) =>
            storages.structureType === STRUCTURE_STORAGE &&
            storages.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    return storages;
}

function getTowers(currRoom) {
    let towers = currRoom.find(FIND_MY_STRUCTURES, {
        filter: (towers) =>
            towers.structureType === STRUCTURE_TOWER &&
            towers.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    return towers;
}

function getUtilityCreeps() {
    let utilityCreeps = Game.spawns["Spawn1"].room.find(FIND_MY_CREEPS, {
        filter: (currCreep) => currCreep.memory.cType === "utility",
    });
    return utilityCreeps;
}

function getCleanerCreeps() {
    let cleanerCreeps = Game.spawns["Spawn1"].room.find(FIND_MY_CREEPS, {
        filter: (currCreep) => currCreep.memory.cType === "cleaner",
    });
    return cleanerCreeps;
}

function getConstructionProjects(currRoom) {
    let conProjects = currRoom.find(FIND_MY_CONSTRUCTION_SITES);
    return conProjects;
}

function getDamagedRamparts(currRoom) {
    let ramparts = currRoom.find(FIND_STRUCTURES, {
        filter: (ramparts) =>
            ramparts.structureType === STRUCTURE_RAMPART &&
            ramparts.hits < 50000,
    });
    return ramparts;
}

function getDamagedRoadsWalls(currRoom) {
    let roads = currRoom.find(FIND_STRUCTURES, {
        filter: (roads) =>
            roads.structureType === STRUCTURE_ROAD &&
            roads.hits < roads.hitsMax,
    });
    let walls = currRoom.find(FIND_STRUCTURES, {
        filter: (walls) =>
            walls.structureType === STRUCTURE_WALL && walls.hits < 150000,
    });
    return roads.concat(walls);
}

function getDroppedItems(currRoom) {
    let droppedEnergy = currRoom.find(FIND_DROPPED_RESOURCES);
    let tombStones = currRoom.find(FIND_TOMBSTONES, {
        filter: (tombstones) =>
            tombstones.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    let ruins = currRoom.find(FIND_RUINS, {
        filter: (ruins) => ruins.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    return [droppedEnergy, tombStones, ruins];
}

function getJobsNeeded(currRoom) {
    let jobArr = [0, 0, 0, 0]; // [Harvesters, Builders, Maintenance, Upgraders]
    jobArr[0] = numHarvesters;
    jobArr[1] = getConstructionProjects(currRoom).length > 0 ? numBuilders : 0;
    jobArr[2] = getDamagedRoadsWalls(currRoom).length > 0 ? numMaintainers : 0;
    jobArr[3] = numUpgraders;
    return jobArr;
}

function spawnUtilityCreeps() {
    let cName = "utility".concat((Game.time % 1000).toString().padStart(3, 0));
    let cBody = utilityCreepBody;
    let cMemory = creepMemory;
    Game.spawns["Spawn1"].spawnCreep(cBody, cName, { memory: cMemory });
}

function spawnCleanupCreeps() {
    let cName = "cleanup".concat((Game.time % 1000).toString().padStart(3, 0));
    let cBody = cleanerCreepBody;
    let cMemory = cleanerCreepMemory;
    Game.spawns["Spawn1"].spawnCreep(cBody, cName, { memory: cMemory });
}

function delegateJobs() {
    let utilityCreeps = getUtilityCreeps();
    let cleanerCreeps = getCleanerCreeps();
    let currRoom = utilityCreeps[0].room;
    let jobsNeeded = getJobsNeeded(currRoom);
    let jobList = jobOrder; // [harvest, builder, maintain, upgrader]
    let sum = 0;
    let currCreep = 0;
    for (let i = 0; i < jobsNeeded.length; i++) {
        sum += jobsNeeded[i];
    }
    for (let i = 0; i < jobList.length; i++) {
        for (let j = 0; j < jobsNeeded[i]; j++) {
            if (utilityCreeps[currCreep] === undefined) {
                spawnUtilityCreeps();
            } else if (
                utilityCreeps[currCreep].memory.currentJob != jobList[i]
            ) {
                utilityCreeps[currCreep].memory.currentJob = jobList[i];
                console.log(
                    utilityCreeps[currCreep] + " assigned " + jobList[i]
                );
            }
            if (utilityCreeps[currCreep] !== undefined) {
                utilityCreeps[currCreep].memory.prefES = currCreep % 2;
            }
            currCreep += 1;
            currCreep %= sum;
        }
    }
    for (let k = sum; k < utilityCreeps.length; k++) {
        if (utilityCreeps[k].memory.currentJob == undefined) {
            utilityCreeps[k].memory.currentJob = "upgrader";
            console.log(utilityCreeps[k] + " assigned upgrader");
        }
    }
    if (cleanerCreeps[0] == undefined) {
        spawnCleanupCreeps();
    } else if (cleanerCreeps[0].memory.currentJob == undefined) {
        console.log("Cleaner given job");
        cleanerCreeps[0].memory.currentJob = "cleaner";
    }
}

function harvestEnergy(currCreep) {
    let currRoom = currCreep.room;
    let extensions = getOpenExtensions(currRoom);
    let containers = getOpenContainers(currRoom);
    let storages = getOpenStorages(currRoom);
    let towers = getTowers(currRoom);
    let energySources = getEnergySources(currRoom);
    let currStorage;
    if (energySources.length == 0) {
        return 0;
    }
    currCreep.memory.currentEnergySource =
        energySources[currCreep.memory.prefES % energySources.length];
    if (towers.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(towers);
    } else if (extensions.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(extensions);
    } else if (
        Game.spawns["Spawn1"].store.getFreeCapacity(RESOURCE_ENERGY) != 0
    ) {
        currStorage = Game.spawns["Spawn1"];
    } else if (storages.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(storages);
    } else {
        console.log("---=== All storages are full ===---");
        return 0; // All Storages are full
    }
    if (currCreep.memory.isFull == false) {
        if (
            currCreep.harvest(
                Game.getObjectById(currCreep.memory.currentEnergySource)
            ) == ERR_NOT_IN_RANGE
        ) {
            currCreep.moveTo(
                Game.getObjectById(currCreep.memory.currentEnergySource)
            );
        }
    } else {
        // Current Creep is full
        if (
            currCreep.transfer(currStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
            currCreep.moveTo(currStorage);
        }
    }
    if (currCreep.store.getFreeCapacity() == 0) {
        currCreep.memory.isFull = true;
    }
    if (currCreep.store.getUsedCapacity() == 0) {
        currCreep.memory.isFull = false;
    }
}

function buildCon(currCreep) {
    if (Game.time % 2 === 0) {
        // Only build every other tick
        return 0;
    }
    let currRoom = currCreep.room;
    let extensions = getFullExtensions(currRoom);
    let storages = getFullStorages(currRoom);
    let conProjects = getConstructionProjects(currRoom);
    let currStorage;
    let currConProj;
    if (extensions.length == 0 && storages.length == 0) {
        return 0;
    }
    if (conProjects.length == 0) {
        return 0;
    }
    if (storages.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(storages);
    } else if (extensions.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(extensions);
    }
    if (currCreep.memory.isFull == false) {
        if (
            currCreep.withdraw(currStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
            currCreep.moveTo(currStorage);
        }
    } else {
        currConProj = currCreep.pos.findClosestByRange(conProjects);
        if (currCreep.build(currConProj) == ERR_NOT_IN_RANGE) {
            currCreep.moveTo(currConProj);
        }
    }
    if (currCreep.store.getFreeCapacity() == 0) {
        currCreep.memory.isFull = true;
    }
    if (currCreep.store.getUsedCapacity() == 0) {
        currCreep.memory.isFull = false;
    }
}

function maintenance(currCreep) {
    let currRoom = currCreep.room;
    let roadsWallsToRepair = getDamagedRoadsWalls(currRoom);
    let rampartsToRepair = getDamagedRamparts(currRoom);
    let extensions = getFullExtensions(currRoom);
    let storages = getFullStorages(currRoom);
    let currStorage;
    let currToRepair;
    if (roadsWallsToRepair.length == 0) {
        return 0;
    }
    if (storages.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(storages);
    } else if (extensions.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(extensions);
    }
    if (currCreep.memory.isFull == false) {
        if (
            currCreep.withdraw(currStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
            currCreep.moveTo(currStorage);
        }
    } else {
        if (rampartsToRepair.length !== 0) {
            currToRepair = currCreep.pos.findClosestByRange(rampartsToRepair);
        } else {
            currToRepair = currCreep.pos.findClosestByRange(roadsWallsToRepair);
        }
        if (currCreep.repair(currToRepair) == ERR_NOT_IN_RANGE) {
            currCreep.moveTo(currToRepair);
        }
    }
    if (currCreep.store.getFreeCapacity() == 0) {
        currCreep.memory.isFull = true;
    }
    if (currCreep.store.getUsedCapacity() == 0) {
        currCreep.memory.isFull = false;
    }
}

function upgradeRoomController(currCreep) {
    let currRoom = currCreep.room;
    let roomController = currCreep.room.controller;
    let extensions = getFullExtensions(currRoom);
    let storages = getFullStorages(currRoom);
    let currStorage;
    if (storages.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(storages);
    } else if (extensions.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(extensions);
    }
    if (currCreep.memory.isFull == false) {
        if (
            currCreep.withdraw(currStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
            currCreep.moveTo(currStorage);
        }
    } else {
        if (currCreep.upgradeController(roomController) == ERR_NOT_IN_RANGE) {
            currCreep.moveTo(roomController);
        }
    }
    if (currCreep.store.getFreeCapacity() == 0) {
        currCreep.memory.isFull = true;
    }
    if (currCreep.store.getUsedCapacity() == 0) {
        currCreep.memory.isFull = false;
    }
}

function cleanup(currCreep) {
    let currRoom = currCreep.room;
    let droppedItems = getDroppedItems(currRoom); //[droppedEnergy, tombStones, ruins]
    let droppedEnergy = droppedItems[0];
    let tombstones = droppedItems[1];
    let ruins = droppedItems[2];
    let extensions = getOpenExtensions(currRoom);
    let storages = getOpenStorages(currRoom);
    let currTarget;
    let currStorage;
    if (
        droppedEnergy.length == 0 &&
        tombstones.length == 0 &&
        ruins.length == 0 &&
        currCreep.memory.isFull == false
    ) {
        currCreep.moveTo(18, 36);
        return 0;
    }
    if (extensions.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(extensions);
    } else if (
        Game.spawns["Spawn1"].store.getFreeCapacity(RESOURCE_ENERGY) != 0
    ) {
        currStorage = Game.spawns["Spawn1"];
    } else if (storages.length != 0) {
        currStorage = currCreep.pos.findClosestByPath(storages);
    } else {
        return 0; // All Storages are full
    }
    if (currCreep.memory.isFull == false) {
        if (droppedEnergy.length != 0) {
            currTarget = currCreep.pos.findClosestByPath(droppedEnergy);
            if (currCreep.pickup(currTarget) == ERR_NOT_IN_RANGE) {
                currCreep.moveTo(currTarget);
            }
        } else if (tombstones.length != 0) {
            currTarget = currCreep.pos.findClosestByPath(tombstones);
            if (
                currCreep.withdraw(currTarget, RESOURCE_ENERGY) ==
                ERR_NOT_IN_RANGE
            ) {
                currCreep.moveTo(currTarget);
            }
        } else if (ruins.length != 0) {
            currTarget = currCreep.pos.findClosestByPath(ruins);
            if (
                currCreep.withdraw(currTarget, RESOURCE_ENERGY) ==
                ERR_NOT_IN_RANGE
            ) {
                currCreep.moveTo(currTarget);
            }
        }
    } else {
        if (
            currCreep.transfer(currStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
            currCreep.moveTo(currStorage);
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
        delegateJobs();
        let utilityCreeps = getUtilityCreeps();
        let cleanerCreeps = getCleanerCreeps();
        let allCreeps = utilityCreeps.concat(cleanerCreeps);
        let numCreeps = Object.keys(Game.creeps).length;
        if (numCreeps == 0) {
            emergencyCreepSpawn();
        }
        for (let i = 0; i < allCreeps.length; i++) {
            switch (allCreeps[i].memory.currentJob) {
                case "harvester":
                    harvestEnergy(allCreeps[i]);
                    break;
                case "builder":
                    buildCon(allCreeps[i]);
                    break;
                case "maintenance":
                    maintenance(allCreeps[i]);
                    break;
                case "upgrader":
                    upgradeRoomController(allCreeps[i]);
                    break;
                case "cleaner":
                    cleanup(allCreeps[i]);
                    break;
            }
        }
    },
};
