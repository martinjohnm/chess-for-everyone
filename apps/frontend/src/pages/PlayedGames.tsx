import { Button } from "@repo/ui/button";
import { useUser } from "@repo/store/useUser";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

export interface Player {
    id : string;
    name : string;
    email : string;
}
  
export interface GameType {
    id : string;
    status : string;
    result : string | null;
    blackPlayer : Player
    whitePlayer : Player
}



export const PlayedGames = () => {

    const [filter, setFilter ] = useState<string>("")
       
    const [_loading, setLoading] = useState<boolean>(true);
    const [_error, setError] = useState<string | null>(null);
    const [data, setData] = useState<GameType[] | null>()
    const be_url = import.meta.env.VITE_APP_BACKEND_URL
    const debouncedSearchQuery = useDebounce(filter, 500); // 500ms delay
    const naavi = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch(be_url + `/games/get?filter=${debouncedSearchQuery}`,{
                method : "get",
                headers : {"Content-Type" : "application/json"},
                credentials : "include",
                })
              
              const responseData = await response.json()
              
              if (responseData.success) {
                setData(responseData.data)
                console.log(responseData.success);
                console.log(data?.length);
                
                
                setLoading(false);
            
              }
              setLoading(false)
            } catch (error) {
              setError('An error occurred while fetching data');
              setLoading(false);
            }
        };
      
          fetchData();
    },[debouncedSearchQuery])

   
    const user = useUser()

    return <div className="text-slate-300 h-screen container mx-auto overflow-auto">
        <div className="fixed mx-auto container">
            <div className="max-w-5xl container mx-auto font-bold text-3xl p-2 backdrop-filter backdrop-blur-lg rounded-md">
                All Games
            </div>
            <div className="h-10 mx-auto container max-w-5xl w-full grid p-2 backdrop-filter backdrop-blur-lg rounded-md">
                <input onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                    setFilter(e.target.value)
                }} type="text" className="bg-black outline-none rounded-md cursor-default p-2" placeholder="Search your game Id Here......" />
            </div>
            <div className="grid grid-cols-4 max-w-5xl container mx-auto mt-2 p-2 backdrop-filter backdrop-blur-lg rounded-md">

                <div className="items-center justify-start flex">
                    Id
                </div>
                <div className="items-center justify-start flex">
                    Player
                </div>
                <div className="items-center justify-start flex">
                    Status
                </div>
                <div className="items-center justify-start flex">
                    Action
                </div>
            </div>
        </div>
        <div className="h-32"></div>
        {data?.map((game) => (
            <div key={game.id} className="p-4 max-w-5xl container mx-auto grid grid-cols-4">
                <div className="items-center justify-start flex">
                    {game.id}
                   
                </div>
                <div className="items-center justify-start flex">
                    {user.id !== game.whitePlayer.id ? `${game.whitePlayer.email}` : `${game.blackPlayer.email}`}
                   
                </div>
                
                <div className="items-center justify-start flex">
                    {game.status}
                </div>
                <div className="items-center justify-start flex">
                    {game.status === "IN_PROGRESS" ? <Button onclick={() => {
                        naavi(`game/${game.id}`)
                    }} className="p-2 bg-green-500 rounded-md text-zinc-50 hover:bg-green-700 w-36">Continue</Button> : <Button className="p-2 bg-red-500 rounded-md text-zinc-50 hover:bg-green-700 w-36">See game</Button>}
                </div>
            </div>
        ))}
    </div>
}
