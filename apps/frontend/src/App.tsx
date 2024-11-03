

import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import { Landing } from "./pages/Landing"
import { RecoilRoot } from "recoil"
import { ThemeProvider } from "./context/ThemeContext"
import Sidebar from "./components/SideBar"



function App() {
  return (
    
    <RecoilRoot>
      <ThemeProvider >
        <AuthApp/>
      </ThemeProvider>
    </RecoilRoot>
  )
}

function AuthApp () {
  return (
 
      <div className="flex">
        <Sidebar />
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
