//spawn
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "Harvester1");
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "Upgrader1");

//memory
Game.creeps["Harvester1"].memory.role = "harvester";
Game.creeps["Upgrader1"].memory.role = "upgrader";

//builder
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "Builder1", {
  memory: { role: "builder" },
});

//can build Big Creep with 550 energy in spawn and extensions
Game.spawns["Spawn1"].spawnCreep(
  [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  "HarvesterBig",
  { memory: { role: "harvester" } }
);

//self-destruct
Game.creeps["Harvester1"].suicide();

//safe mode
Game.spawns["Spawn1"].room.controller.activateSafeMode();

//build a Defense Tower
Game.spawns["Spawn1"].room.createConstructionSite(23, 22, STRUCTURE_TOWER);
