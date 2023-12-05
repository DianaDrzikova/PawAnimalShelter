const express = require("express")
const router = express.Router()
const animalController = require("../controllers/animalController")
const app = require("../server")

function Auth(req, res, next){
    console.log(req.session)
    if(!req.session || !req.session.user){
      res.render("error", {
        style: '../caregiver/user/homepage',
        not_partial: false, 
        footer:false
      })
      return
    }
    req.session.touch()
    next()
}

//CAREGIVER
router.get('/caregiverAnimals', Auth ,animalController.getAnimalsCaregiver)
router.get('/caregiverAddAnimal',Auth,animalController.addAnimal)
router.post('/caregiverAddAnimal/submit',Auth, animalController.addAnimalSubmit)
router.get('/caregiverProfileAnimal/:id',Auth, animalController.getAnimal)
router.get('/caregiverProfileAnimal/editAnimal/:id',Auth, animalController.editAnimal)
router.put('/caregiverProfileAnimal/editAnimal/:id',Auth, animalController.editAnimalSubmit)
router.delete('/caregiverProfileAnimal/:id', Auth,animalController.deleteAnimal)

router.put('/caregiverProfileAnimal/:id',Auth, animalController.editAnimalSubmit)

router.get("/caregiverAnimals/caregiverFoundAnimals",Auth, animalController.searchWithFilter)


router.get("/volunteerAnimals/volunteerFoundAnimals",Auth, animalController.searchWithFilterV)
router.get('/volunteerAnimals',Auth, animalController.getAnimalsVolunteer)
router.get('/volunteerProfileAnimal/:id',Auth,animalController.getAnimalV )

router.get('/unregistredProfileAnimal/:id',animalController.getAnimalV )
router.get('/unregistredAnimals', animalController.getAnimalsVolunteer)
router.get("/unregistredAnimals/unregistredFoundAnimals", animalController.searchWithFilterV)

router.get('/veterinarianAnimals',Auth, animalController.getAnimalsVet)
router.get("/veterinarianAnimals/veterinarianFoundAnimals",Auth, animalController.searchWithFilterVet)


module.exports = router


