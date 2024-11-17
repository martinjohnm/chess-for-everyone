

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
import { Protected } from "./pages/Protected"



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
        <Layout>
        <BrowserRouter >
          <Routes>
            
              <Route path="/" element={<Landing/>}/>
              <Route path="/game/:gameId" element={<Protected><Game/></Protected>}/>
              <Route path="/games" element={ <Protected><PlayedGames/></Protected>}/>
              <Route path="/login" element={<Login/>}/>

        
          </Routes>
        </BrowserRouter>
        </Layout>
      </div>
  )
}

export default App
