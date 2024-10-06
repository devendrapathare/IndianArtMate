import express from 'express'
import {setRespect, checkRespect} from '../Controlles/setRespectController.js'

const router = express.Router()

router.post('/setRespect/:loggedInUserId',setRespect)
router.get('/checkRespect/:loggedInUserId/:userId',checkRespect)


export default router;