import { useUser } from "../store/src/hooks/useUser"
import { Login } from "./Login"


export const Protected  = ({children} :{children : React.ReactNode}) => {


    const user = useUser()

    if (user) {
        return children
    } else {
        return <Login/>
    }
    
}