const express = require("express");
const {
  register,
  registerPeopleDayRoutines,
  getPeopleRoutinesByPresetId,
  getRoutine,
  getAllRoutinesDays,
  updateRoutineActivities,
  deleteActivity
} = require("../controllers/routinesController");
const { auth } = require("../helpers/authHelper");

const router = express.Router();

router.post("/register", auth, register);
router.post("/registerPeopleDayRoutines", auth, registerPeopleDayRoutines);
router.get(
  "/getPeopleRoutinesByPresetId/:housePresetId",
  auth,
  getPeopleRoutinesByPresetId
);
router.get("/getRoutine/:dayRoutineId", auth, getRoutine);
router.post("/getAllRoutinesDays", auth, getAllRoutinesDays);
router.put("/updateRoutineActivities", auth, updateRoutineActivities);
router.delete("/deleteActivity/:id", auth, deleteActivity)

module.exports = router;
