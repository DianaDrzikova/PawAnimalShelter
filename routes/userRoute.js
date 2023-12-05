const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const db = require("../databasepg")
const app = require("../server.js")

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

router.put("/caregiverPendingUserProfile/:id",Auth, userController.PendingChange)
router.get("/caregiverPendingUserProfile/:id",Auth, userController.getPending)
router.get("/caregiverPendingVolunteers",Auth, userController.Pending)
router.get("/caregiverHomepage",Auth, userController.homepageCar)
router.get("/caregiverUserProfile",Auth, userController.get)

router.get("/volunteerHomepage",Auth, userController.homepageVol)
router.get("/volunteerMyProfile/:id",Auth, userController.getmyprofile)

router.get("/veterinarianHomepage",Auth, userController.homepageVet)

router.get("/volunteerEditMyProfile/:id",Auth, userController.editmyprofile)
router.put('/volunteerMyProfile/:id',Auth, userController.editmyprofileSubmit)


router.get('/', userController.welcome)


router.get('/adminHomepage', Auth, userController.adminHomepage)
router.get('/adminAddUser',Auth,userController.addUser)
router.post('/adminAddUser/submit',Auth, userController.addUserSubmit)
router.get("/adminProfileUser/:id",Auth, userController.getAdminProfile)
router.delete('/adminProfileUser/:id', Auth,userController.deleteUser)



router.get('/signUp', userController.signUp)
router.post('/signUp', userController.signUpConfirm)

router.get('/logIn', userController.logIn)
router.post('/logIn', userController.logInConfirm)


router.get('/error', userController.error)


router.route('/logout')
    .get(function (req, res, next) {
            req.session.destroy(function (err) {
              if (err) next(err)
              console.log(req.session)
              res.redirect('/')
              next()
            })
})

module.exports = router