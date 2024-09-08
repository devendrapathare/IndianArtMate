import './App.css'
import ProfilePage from './person-2/Pages-p2/profilePage/ProfilePage'
import Homepage from './person-3/Homepage/Homepage'
import Nav from './person-3/Components-3/Nav/Nav'
import Footer from './person-2/components-p2/Footer/Footer'
import UpdateProfilePage from './person-2/Pages-p2/UpdateProfilePage/UpdateProfilePage'

function App() {

  return (
    <>
      <Nav />
      {/* <ProfilePage /> */}
      {/* <Homepage/> */}
      <UpdateProfilePage />
      <Footer />

    </>
  )
}

export default App
