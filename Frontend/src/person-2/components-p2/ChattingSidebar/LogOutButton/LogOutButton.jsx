import React from 'react'
import './LogOutButton.css'
import { BiLogOut } from 'react-icons/bi'
// import '../tailwind.css'

const LogOutButton = () => {
  return (
    <div className='LogOutButton-container'>
      <BiLogOut className='icon' />
    </div>
  )
}

export default LogOutButton
