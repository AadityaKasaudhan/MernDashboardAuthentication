import Login from "./Login"
import Signup from "./Signup"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
