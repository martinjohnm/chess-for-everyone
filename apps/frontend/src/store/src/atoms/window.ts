

import { atom, selector } from "recoil"


export const windowSizeAtom = atom({
    key : "windowSizeAtom",
    default : {
        width : window.innerWidth, 
        height : window.innerHeight
    }
})

// derived from the above atom

export const windowSizeLessThan960 = selector({
    key : "windowSizeLessThan960",
    get : ({ get }) => {
        const windowSize = get(windowSizeAtom);
        return windowSize.width < 960
    }
})