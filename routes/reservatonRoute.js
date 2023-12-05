const express = require("express")
const router = express.Router()
const reservationController = require("../controllers/reservationController")
const db = require("../databasepg")


function Auth(req, res, next){
    console.log(req.session)
    if(!req.session || !req.session.user){
      res.render("error", {
        style: './caregiver/user/homepage',
        not_partial: false, 
        footer:false
      })
      return
    }
    req.session.touch()
    next()
  }

router.get('/caregiverAllWalkies/:id',Auth, reservationController.getReservations)
router.delete('/caregiverAllWalkies/:id',Auth, reservationController.deleteReservation)


router.get('/caregiverSetWalkies/:id',Auth, reservationController.addReservation)
router.delete('/caregiverSetWalkies/:id',Auth, reservationController.deleteReservation)
router.post('/caregiverSetWalkies/submit/:id',Auth, reservationController.addReservationSubmit)

router.get("/caregiverFoundReservations/:id",Auth, reservationController.foundReservations)
router.get('/caregiverReservationCard/:id',Auth, reservationController.getReservationCard)

router.get("/caregiverPendingReservations",Auth, reservationController.Pending)
router.get("/caregiverPendingReservationProfile/:id",Auth, reservationController.getRPending)
router.put("/caregiverPendingReservationProfile/:id",Auth, reservationController.PendingRChange)

router.get('/caregiverReservations', Auth, reservationController.getReservationsAll)

router.get("/volunteerMyReservations/:id",Auth, reservationController.getmyreservations)

router.get("/volunteerReservationCard/:id",Auth, reservationController.getReservationCardV)

router.get("/volunteerFoundReservations/:id",Auth, reservationController.foundReservationsV)

router.put("/volunteerReservationCard/:id",Auth, reservationController.deleteReservationV)

router.put("/volunteerProfileAnimal/:id",Auth, reservationController.signInForRes)

router.route('/deleting')
    .get(function (req, res) {
        var today = new Date()
        db.query("DELETE from reservations WHERE confirmed = $1 and date <= $2", [false,today]);
    })

module.exports = router



