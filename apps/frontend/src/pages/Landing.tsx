import { Button } from "@repo/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/src/hooks/useUser";
import { useEffect } from "react";


export default function Landing() {



    const navigate = useNavigate();

    const user = useUser()

    useEffect(() => {
      
    }, [user])

    return (
        <div className="p-4">
        <div className="grid-cols-1 md:grid-cols-2 gap-4 grid container mx-auto max-w-5xl text-white dark:text-white rounded-md">
            <div className="md:col-span-1 hidden md:block">
                <img className="rounded-md" src="chess.png" alt="" />
            </div>
            <div className="md:col-span-1 flex justify-center p-2 bg-black">
              <div>
                <div className="items-center justify-center py-10 text-3xl md:text-5xl">
                  <h1 className="font-bold">
                    <span>Play Chess Online</span>
                  </h1>
                  <h1 className="font-bold">
                    <span>on the #X Site!</span>
                  </h1>
                </div>
                <div className="items-center justify-center flex">
                  <Button className="bg-[#81b64c] p-4 rounded-md md:w-full" onclick={() => {
                    navigate("/game/random")
                  }}><p className="font-bold text-xl md:text-3xl shadow-sm">Play Online</p></Button>
                </div>
              </div>
            </div>
            <div className="md:col-span-1 md:hidden mt-8">
                <img className="rounded-md" src="chess.png" alt="" />
            </div>
        </div>
  
        <div className="text-white text-3xl md:text-5xl font-bold justify-center items-center container mx-auto max-w-5xl text-center mt-4">
            <p>The Game of Royals</p>
        </div>

        <div className="grid-cols-1 md:grid-cols-2 gap-4 grid container mx-auto max-w-5xl text-white dark:text-white mt-6 rounded-md">
            <div className="md:col-span-1 hidden md:block">
                <img className="rounded-md" src="chesss.png" alt="" />
            </div>
            <div className="md:col-span-1 flex justify-center p-4 bg-black">
         
                <div className="items-center justify-center flex py-10 gap-4">
                  <img src="https://www.chess.com/bundles/web/images/faces/anna-rudolf.193d08a5.jpg" alt="" />
                  <p className="">"Chess.com lessons make it easy to learn to play, then challenge you to continue growing."</p>
                </div>
          
            </div>
            <div className="md:col-span-1 md:hidden">
                <img className="rounded-md" src="chesss.png" alt="" />
            </div>
        </div>
        </div>
   
    );
  }
  