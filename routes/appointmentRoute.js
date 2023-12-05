const express = require("express")
const router = express.Router()
const appointmentController = require("../controllers/appointmentsController")
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

router.get('/caregiverUpcomingAppointments', Auth, appointmentController.getAppointmentsAll)
router.get('/caregiverVetAppointments/:id', Auth, appointmentController.getAppointments)
router.get('/caregiverFoundAppointments/:id', Auth, appointmentController.getAnimalAppointments)
router.get('/caregiverAppointmentCard/:id', Auth, appointmentController.getAppointmentsCard)
router.delete('/caregiverFoundAppointments/:id',Auth, appointmentController.deleteAnimalAppointments)
router.post('/caregiverVetAppointments/:id', Auth, appointmentController.addAppointments)


router.get("/veterinarianFoundAppointments", Auth, appointmentController.getAppointmentsPending)
router.get("/veterinarianAppointmentCard/:id",Auth, appointmentController.getAppointmentCard)
router.get('/veterinarianProfileAnimal/:id',Auth, appointmentController.getAnimalVet)
router.put('/veterinarianAppointmentCard/:id',Auth, appointmentController.setAppointment)

module.exports = router
