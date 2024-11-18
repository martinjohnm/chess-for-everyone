

import { atom, selector } from "recoil"

// Load root .env file
//dotenv.config({ path: path.resolve(__dirname, './.env') });

const be_url = 'http://localhost:3000'

const b = import.meta.env.VITE_APP_BACKEND_URL



export interface User {
    token: string;
    id: string;
    name: string;
  }

export const userAtom = atom<User>({
        
    key: 'user',
    default: selector({
        key: 'user/default',
        get: async () => {
        try {
            await new Promise(r => setTimeout(r, 1000))
            const response = await fetch(`${be_url}/auth/refresh`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',

            });
            if (response.ok) {
            const data = await response.json();
            console.log(b);
            
            return data;
            }
        } catch (e) {
            console.error(e);
        }

        return null;
        },
    }),
});