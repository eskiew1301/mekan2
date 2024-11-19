const express=require('express')
const {check} =require('express-validator')
const usersController = require('../controllers/users.controller')
const checkAuth=require('../middleware/check-auth')

const router=express.Router()


router.post('/login', usersController.login)

router.use(checkAuth)
router.get('/', usersController.getAllUsers)

router.post('/add-user',[
    check('userName').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:8})
], usersController.addUser)



module.exports=router