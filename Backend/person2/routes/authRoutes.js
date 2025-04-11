import express from 'express'
import { loginUser, logOutUser, signupUser, userDataFromId, fetchUserByName, getAllUserData, updateLockedAmount } from '../controllers/authControllers.js'


const router =  express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logOutUser)
router.post('/userData', userDataFromId)
router.post('/userSearch', fetchUserByName)
router.get('/getAllUserData', getAllUserData)
router.post('/lock', updateLockedAmount)


export default router