import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import BottomNav from "./components/BottomNav"
import Create from "./components/Create"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Notification from "./pages/Notification"
import CreatePost from "./pages/CreatePost"
import Explore from "./pages/Explore"
import Search from "./pages/Search"
import { useUser } from "./contexts/userContext"

function App() {
  const {user} = useUser()

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route path="/" element={user ? <Home /> : <SignUp />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={user ? <Profile /> : <SignUp />} />
          <Route path="notification" element={user ? <Notification /> : <SignUp />} />
          <Route path="createPost" element={user ? <CreatePost /> : <SignUp />} />
          <Route path="explore" element={user ? <Explore /> : <SignUp />} />
          <Route path="search" element={user ? <Search /> : <SignUp />} />
        </Routes>
      </div>
      <Create />
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
