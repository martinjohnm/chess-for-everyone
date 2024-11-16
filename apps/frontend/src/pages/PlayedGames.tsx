import { useGetGames } from "../hooks/useGetGames";



export const PlayedGames = () => {


    const {data} =  useGetGames()

    console.log(data);
    
    return <div>
        {data?.map((game) => (
            <div className="bg-slate-300 p-4 flex">
                <p>{game.id}</p>
                <p>{game.status}</p>
            </div>
        ))}
    </div>
}
