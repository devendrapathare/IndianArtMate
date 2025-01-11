import React from 'react'
import './FeedPage.css'
import ProfileInfo from '../../components-p2/Profile/ProfileInfo/ProfileInfo'
import { useAuthContext } from '../../context/AuthContext/AuthContext'
import TopArtistProfileDisplay from '../../components-p2/ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay'
import Feeds from '../../components-p2/Feeds/Feeds'

const FeedPage = () => {

    const { authUser } = useAuthContext()

  return (
    <div className='FeedPage-container'>
        <div>
        <ProfileInfo setshowUploadPost={false} isOwnProfile={true} userId={authUser._id} />
        </div>
        <div className='FeedPage-scrollable'>
            <Feeds />
        </div>
        <div>
            <TopArtistProfileDisplay />
        </div>
    </div>
  )
}

export default FeedPage