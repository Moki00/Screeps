console.log(Game.map.describeExits("W59S14")); //[object Object]
console.log(Game.rooms["W59S14"].controller.owner); //[object Object]
console.log(Game.rooms["W59S14"].controller.progress);
console.log(Game.rooms["W59S14"].StructureController.progress); // progress undefined
console.log(Game.map.describeExits("W59S14"));

// where is a creep?
console.log(Game.creeps["T2"].pos);

// move to
for (let G3 in Game.creeps) {
  Game.creeps[G3].moveTo(18, 23);
}

// move Left
Game.creeps["H1"].move(LEFT);

//spawn
Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], "B1", {
  memory: { role: "builder" },
});
Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], "H1", {
  memory: { role: "harvester" },
});
Game.spawns["Spawn1"].spawnCreep(
  [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
  "B2",
  {
    memory: { role: "builder" },
  }
);
Game.spawns["Spawn1"].spawnCreep([ATTACK, ATTACK, CARRY, MOVE], "W1", {
  memory: { role: "Warrior" },
});

// reset　ゲームの初期化
Memory.MemRooms = {};
Memory.ErrorLog = undefined;
Memory.InfoLog = undefined;
Memory.Paths = undefined;
Memory.powerCreeps = undefined;
for (const creepName in Memory.creeps) {
  const gc = Game.creeps[creepName];
  const mc = Memory.creeps[creepName];
  if (gc === undefined) {
    delete Memory.creeps[creepName];
  } else {
    for (const memoryElementKey in gc.memory) {
      gc.memory[memoryElementKey] = undefined;
    }
    mc.JobName = "idle(" + gc.pos.x + "," + gc.pos.y + ")" + gc.pos.roomName;
  }
}
gc.suicide();
console.log(
  "manual search: " +
    JSON.stringify(Game.getObjectById("5cee5f96d1936f6f4667aa35"))
);
console.log("Game.time: " + Game.time);
console.log(JSON.stringify(Game.powerCreeps["Hulmir"]));

// terminal send
Game.getObjectById("5d7ed54c708ec13c439c0193").send(
  RESOURCE_BIOMASS,
  3000,
  "E28S29"
);
Game.market.deal("5e00325c7072b2051bcdb880", 4000, "W59S14");
console.log(JSON.stringify(Game.rooms["W59S14"].controller.owner));

console.log(JSON.stringify(Game.rooms["E29S28"].controller.owner));

// check all flags
for (const flagKey in Game.flags) {
  const flag = Game.flags[flagKey];
  console.log(flagKey + " " + JSON.stringify(flag));
  if (
    (flag.color === COLOR_ORANGE && flag.secondaryColor === COLOR_CYAN) ||
    (flag.color === COLOR_ORANGE && flag.secondaryColor === COLOR_PURPLE)
  ) {
    console.log("removing flag");
    flag.remove();
  }
}

// check all flags //全部の旗を確認
for (const flagKey in Game.flags) {
  const flag = Game.flags[flagKey];
  console.log(flagKey + " " + JSON.stringify(flag));
}

console.log(Game.rooms["W59S14"].energyAvailable);

console.log(
  "RESOURCE_ENERGY " +
    Game.getObjectById("5cf1a7158e8ea635474264ca").store.getUsedCapacity(
      RESOURCE_POWER
    )
);

// destroy all structures
const structures = Game.rooms["W59S14"].find(FIND_STRUCTURES);
for (const structureKey in structures) {
  structures[structureKey].destroy();
}
// destroy all constructions

for (const roomName in Memory.MemRooms) {
  const constructions = Game.rooms[/*roomName*/ "W51N31"].find(
    FIND_CONSTRUCTION_SITES
  );
  for (const key in constructions) {
    console.log(
      "removed " +
        constructions[key].structureType +
        " " +
        constructions[key].pos
    );
    constructions[key].remove();
  }
}

// get something in a rooms memory
Memory.MemRooms["E31S31"].FctrId = undefined;

// test spawn transporters
Game.spawns["Spawn1"].spawnCreep([CARRY, CARRY, MOVE], "T1");
Game.spawns["Spawn17"].spawnCreep([CARRY, CARRY, MOVE], "T52");
Game.spawns["Spawn9"].spawnCreep([CARRY, CARRY, MOVE], "T53");

console.log(Object.keys(Memory.MemRooms["W59S14"].MaxCreeps["T"]).length - 1);
console.log(JSON.stringify(Memory.MemRooms["W59S14"].MaxCreeps["T"]["M"]));

// empty a terminal
const terminal = Game.getObjectById("5cf1a7158e8ea635474264ca");
for (const resourceType in terminal.store) {
  const amount = terminal.store[resourceType];
  if (resourceType !== RESOURCE_ENERGY && amount > 1) {
    terminal.send(resourceType, amount - 1, "E28S29");
  }
}

// send energy to a terminal?
const terminal = Game.getObjectById("putInTheIdHere");
terminal.send(RESOURCE_ENERGY, terminal.store[RESOURCE_ENERGY] * 0.9, "E28S29");

delete Memory.MemRooms["W59S14"].FctrId;

const hostiles = Game.rooms["W59S14"].find(FIND_HOSTILE_CREEPS);
console.log("hostiles " + JSON.stringify(hostiles[0].owner.username));

for (const roomName in Memory.MemRooms) {
  const memRoom = Memory.MemRooms[roomName];
  delete memRoom.Built;
}
delete Memory.MemRooms["W59S14"].Built;

// -----------------------------------------------
// 部屋の全部の自殺・自爆
const roomName = "W59S14";
const structures = Game.rooms[roomName].find(FIND_STRUCTURES);
const constructions = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
const myCreeps = Game.rooms[roomName].find(FIND_MY_CREEPS);
const flags = Game.rooms[roomName].find(FIND_FLAGS);
for (const structureKey in structures) {
  structures[structureKey].destroy();
}
for (const constructionKey in constructions) {
  constructions[constructionKey].remove();
}
for (const myCreepKey in myCreeps) {
  myCreeps[myCreepKey].suicide();
}
for (const flagKey in flags) {
  flags[flagKey].remove();
}
Game.rooms[roomName].controller.unclaim();
delete Memory.MemRooms[roomName];
// -----------------------------------------------

// get available energy in room
const roomName = "W59S14";
console.log(
  "energyCapacityAvailable " + Game.rooms[roomName].energyCapacityAvailable
);

console.log("COMMODITIES " + JSON.stringify(COMMODITIES[RESOURCE_ALLOY]));

const commodity = COMMODITIES[RESOURCE_ALLOY];
console.log("commodity " + JSON.stringify(commodity));
for (const component in commodity.components) {
  console.log("component " + JSON.stringify(component));
  console.log("component " + JSON.stringify(commodity.components[component]));
}
