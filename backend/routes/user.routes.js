const express = require("express")
const passport = require("passport")
const controller = require("../controllers/user.controller")

const router = express.Router()

router.get("/getAll", passport.authenticate('jwt', { session: false }), controller.getAll)
router.get("/:id", passport.authenticate('jwt', { session: false }), controller.getById)
router.post("/", passport.authenticate('jwt', { session: false }), controller.getByEmail)
router.put("/:id", passport.authenticate('jwt', { session: false }), controller.update)

module.exports = router