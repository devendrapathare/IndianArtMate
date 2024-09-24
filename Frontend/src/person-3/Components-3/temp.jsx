import React from 'react'
import ProfilePage from '../../person-2/Pages-p2/profilePage/ProfilePage'
import { useParams } from 'react-router-dom'

const Temp = () => {
    const {id} = useParams()
  return (
    <div>
      <ProfilePage current_id={id}/>
    </div>
  )
}

export default Temp
