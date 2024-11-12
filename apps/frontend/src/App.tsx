

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

    
 
      <div className="dark:bg-[#302e2b] bg-slate-100">

        <BrowserRouter >
          <Routes>
            <Route path="/" element={<Layout><Landing/></Layout>}/>
            <Route path="/game/:gameId" element={<Layout><Game/></Layout>}/>
            <Route path="/login" element={<Login/>}/>
            
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
