const express = require("express");
const {
  register,
  registerPeopleDayRoutines,
  getPeopleRoutinesByPresetId,
  getRoutine,
  getAllRoutinesDays,
  updateRoutineActivities,
  deleteActivity,
  deletePersonFromPreset,
  registerAcitivyPresetParam,
  getActivityPresetParams
} = require("../controllers/routinesController");
const { auth } = require("../helpers/authHelper");

const router = express.Router();

router.post("/register", auth, register);
router.post("/registerAcitivyPresetParam", auth, registerAcitivyPresetParam)
router.post("/registerPeopleDayRoutines", auth, registerPeopleDayRoutines);
router.get(
  "/getPeopleRoutinesByPresetId/:housePresetId",
  auth,
  getPeopleRoutinesByPresetId
);
router.get("/getActivityPresetParams/:presetId", auth, getActivityPresetParams)
router.get("/getRoutine/:dayRoutineId", auth, getRoutine);
router.post("/getAllRoutinesDays", auth, getAllRoutinesDays);
router.put("/updateRoutineActivities", auth, updateRoutineActivities);
router.delete("/deleteActivity/:id", auth, deleteActivity)
router.delete("/deletePersonFromPreset", auth, deletePersonFromPreset)

module.exports = router;
