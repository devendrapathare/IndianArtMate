import React from 'react'
import './My_Store.css'
import ProfileInfo from '../../../../person-2/components-p2/Profile/ProfileInfo/ProfileInfo'
import TopArtistProfileDisplay from '../../../../person-2/components-p2/ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay'
import Mid_section from './Mid_section/Mid_section'
const CreateStore = () => {
  return (
    <div className='CreateStore'>
      <div className="store-left">
        <ProfileInfo/>
      </div>
      <div className="store-mid">
        {/* <h2>You Don't Have A Store Currently</h2>
        <h2>But You Can Create one</h2>
        <form>
            <input type='text' name = "shore-name" required></input>
            <button type='submit'>Create Store</button>
        </form> */}
        <Mid_section/>
      </div>
     <div className="store-right">
        <TopArtistProfileDisplay/>
     </div>
      
    </div>
  )
}

export default CreateStore
