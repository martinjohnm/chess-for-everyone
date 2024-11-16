import { useEffect, useState } from "react";


interface GameType {
    id : string;
    status : string;
    result : string
}

export const useGetGames = () => {

    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<GameType[] | null>()
    const be_url = import.meta.env.VITE_APP_BACKEND_URL


    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch(be_url + "/games/get",{
                method : "get",
                headers : {"Content-Type" : "application/json"},
                credentials : "include",
                })
              
              const responseData = await response.json()
              
              if (responseData.success) {
                setData(responseData.data)
                setLoading(false);
            
              }
              setLoading(false)
            } catch (error) {
              setError('An error occurred while fetching data');
              setLoading(false);
            }
        };
      
          fetchData();
    }, [])   

    return { loading, error, data}
    
}