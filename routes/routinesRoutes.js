const express = require("express");
const {
  registerPeopleDayRoutines,
  getPeopleRoutinesByPresetId,
  getRoutine,
  registerEachRoutineActivity,
  getAllRoutinesDays,
  updateRoutineActivities,
  deleteActivity,
  deletePersonFromPreset,
  registerActivyPresetParam,
  getActivityPresetParams,
  getAllPeopleRoutines
} = require("../controllers/routinesController");
const { auth } = require("../helpers/authHelper");

const router = express.Router();

// router.post("/register", auth, register);
// router.post("/registerActivyPresetParam", auth, registerActivyPresetParam)
router.post("/registerPeopleDayRoutines", auth, registerPeopleDayRoutines);
router.get(
  "/getPeopleRoutinesByPresetId/:housePresetId",
  auth,
  getPeopleRoutinesByPresetId
);
router.post("/registerEachRoutineActivity", auth, registerEachRoutineActivity)
router.get("/getActivityPresetParams/:presetId", auth, getActivityPresetParams)
router.get("/getRoutine/:dayRoutineId", auth, getRoutine);
router.post("/getAllRoutinesDays", auth, getAllRoutinesDays);
router.put("/updateRoutineActivities", auth, updateRoutineActivities);
router.delete("/deleteActivity/:id", auth, deleteActivity)
router.delete("/deletePersonFromPreset", auth, deletePersonFromPreset)
router.get("/getAllPeopleRoutines/:page", auth, getAllPeopleRoutines)

module.exports = router;
