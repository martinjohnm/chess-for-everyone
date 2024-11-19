

import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import { RecoilRoot } from "recoil"
import { ThemeProvider } from "./context/ThemeContext"
import { Game } from "./pages/Game"
import { Login } from "./pages/Login"
import { Suspense } from "react"
import { Loader } from "./components/Loader"
import Landing from "./pages/Landing"
import { Layout } from "./components/Layout"
import { PlayedGames } from "./pages/PlayedGames"
import { ViewGame } from "./pages/ViewGame"



function App() {
  return (
    
    <RecoilRoot>
      <Suspense fallback={<Loader />}>
        <ThemeProvider >
          <AuthApp/>
        </ThemeProvider>
      </Suspense>
    </RecoilRoot>
  )
}

function AuthApp () {

  return (

    
 
      <div className="bg-[#302e2b] min-h-screen">
        <BrowserRouter >
          <Routes>
            
              <Route path="/" element={<Layout><Landing/></Layout>}/>
              <Route path="/game/:gameId" element={<Layout><Game/></Layout>}/>
              <Route path="/games" element={ <Layout><PlayedGames/></Layout>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/view/:gameId" element={<Layout><ViewGame/></Layout>}/>
        
          </Routes>
        </BrowserRouter>
      
      </div>
  )
}

export default App
