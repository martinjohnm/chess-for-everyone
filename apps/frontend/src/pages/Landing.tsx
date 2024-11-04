import { Button } from "@repo/ui/button";
import { useNavigate } from "react-router-dom";


export default function Landing() {



    const navigate = useNavigate();

    return (
        
        <div className="grid-cols-1 md:grid-cols-2 gap-4 grid container mx-auto max-w-5xl text-black dark:text-white">
            <div className="md:col-span-1 hidden md:block">
                <img className="rounded-md" src="chess.png" alt="" />
            </div>
            <div className="md:col-span-1 flex justify-center px-2">
              <div>
                <div className="items-center justify-center py-10">
                  <h1 className="font-bold text-5xl">
                    <span>Play Chess Online</span>
                  </h1>
                  <h1 className="font-bold text-5xl">
                    <span>on the #X Site!</span>
                  </h1>
                </div>
                <div className="items-center justify-center flex">
                  <Button className="bg-[#81b64c] p-4 rounded-md w-full" onclick={() => {
                    navigate("/game")
                  }}><p className="font-bold text-3xl shadow-sm">Play Online</p></Button>
                </div>
              </div>
            </div>
        </div>
  
   
    );
  }
  