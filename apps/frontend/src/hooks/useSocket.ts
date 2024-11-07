import { useUser } from "@repo/store/useUser"
import { useEffect, useState } from "react"

const ws_url = import.meta.env.VITE_WEBSOCKET_URL


export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const user = useUser()
    useEffect(() => {
        if (!user) return;
        const ws = new WebSocket(`${ws_url}?token=${user.token}`);
    
        ws.onopen = () => {
            console.log("connected")
            setSocket(ws)
        }

        ws.onclose = () => {
            console.log("disconnected");
            setSocket(null)
        }


        return () => {
            ws.close();
        }

    }, [user])

    return socket
}