"use strict";

if (Game.cpu.bucket < 500) {
  throw new Error("Extremely low bucket - aborting script run at top level");
}

// Load any prototypes or libraries

/* Get Upload Version */
require("version");
require("./constants");

/* Enable QOS Logger */
const QosLogger = require("logger");
global.Logger = new QosLogger();

/* Add "sos library" - https://github.com/ScreepsOS/sos-library */
global.SOS_LIB_PREFIX = "thirdparty_";
global.sos_lib = require("sos_lib");

/* Add additional room visualizations - https://github.com/screepers/RoomVisual */
require("roomvisual");

/* Add "creep talk" library - https://github.com/screepers/creeptalk */
const language = require("creeptalk_emoji");
require("creeptalk")({
  public: true,
  language: language,
});

/* Make the quorum library code available globally */
global.qlib = require("loader");

/* Extend built in objects */
require("controller");
require("creep");
require("creep_actions");
require("creep_movement");
require("creep_overrides");
require("lab");
require("mineral");
require("observer");
require("room_alchemy");
require("room_conflict");
require("room_construction");
require("room_control");
require("room_economy");
require("room_intel");
require("room_logistics");
require("room_landmarks");
require("room_meta");
require("room_movement");
require("room_spawning");
require("room_structures");
require("room_territory");
require("roomposition");
require("terminal");
require("source");
require("storage");

const QosKernel = require("kernel");

module.exports.loop = function () {
  if (Game.cpu.bucket < 500) {
    if (Game.cpu.limit !== 0) {
      Logger.log(
        "Extremely low bucket - aborting script run at start of loop",
        LOG_FATAL
      );
    }
    return;
  }
  const kernel = new QosKernel();
  kernel.start();
  global.Empire = new qlib.Empire();
  kernel.run();
  kernel.shutdown();
};
