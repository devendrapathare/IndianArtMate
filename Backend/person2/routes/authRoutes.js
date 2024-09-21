import express from 'express'
import { loginUser, logOutUser, signupUser } from '../controllers/authControllers.js'


const router =  express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logOutUser)


export default router