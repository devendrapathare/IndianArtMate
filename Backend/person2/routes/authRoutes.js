import express from 'express'
import { loginUser, logOutUser, signupUser, userDataFromId, fetchUserByName } from '../controllers/authControllers.js'


const router =  express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logOutUser)
router.post('/userData', userDataFromId)
router.post('/userSearch', fetchUserByName)

export default router