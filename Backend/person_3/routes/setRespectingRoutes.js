import express from 'express'
import {setRespect} from '../Controlles/setRespectController.js'

const router = express.Router()

router.post('/setRespect/:loggedInUserId',setRespect)


export default router;