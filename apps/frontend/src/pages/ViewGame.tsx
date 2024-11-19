import { useEffect, useState } from "react";
import { useUser } from "../store/src/hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { GameType } from "./PlayedGames";





export const ViewGame = () => {
    const user = useUser()
    const navi = useNavigate()
    const {gameId} = useParams()

    const [_loading, setLoading] = useState<boolean>(true);
    const [_error, setError] = useState<string | null>(null);
    const [data, setData] = useState<GameType | null>()
    const be_url = import.meta.env.VITE_APP_BACKEND_URL

    if (!gameId) {
        navi("/")
    }

    useEffect(() => {
        if (!user) {
          window.location.href = '/login';
        }
      }, [user]);

      useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch(be_url + `/games/getOne?gameId=${gameId}`,{
                method : "get",
                headers : {"Content-Type" : "application/json"},
                credentials : "include",
                })
              
              const responseData = await response.json()
              
              if (responseData.success) {
                setData(responseData.data)
                console.log(responseData.success);
                setLoading(false);
            
              }
              setLoading(false)
            } catch (error) {
              setError('An error occurred while fetching data');
              setLoading(false);
            }
        };
      
          fetchData();
    },[gameId])

    console.log(data);
    
    return <div>
        <div className="md:col-span-2 lg:col-span-4 w-full bg-black max-w-5xl container mx-auto max-h-[500px] h-screen rounded-lg shadow-zinc-700">
                <div className="text-white justify-between w-full p-8 grid grid-cols-2">
                    <div className="font-bold text-2xl">
                        Winner : 
                    </div>
                    <div>
                        {data?.result === "WHITE_WINS" ? `${data.whitePlayer.email}` : `${data?.blackPlayer.email}`}
                    </div>
                </div>
                <div className="text-white justify-between w-full p-8 grid grid-cols-2">
                    <div className="font-bold text-2xl">
                        By : 
                    </div>
                    <div>
                        {data?.status}
                    </div>
                </div>
        </div>
    </div>
}