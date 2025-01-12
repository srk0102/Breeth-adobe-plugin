import { useState, useEffect } from "react";
import { evalTS } from "../../lib/utils/bolt";

import { NavBar, Hero, Service } from '../components'
import { getTheFileData } from '../utils/commonFunctions'

export const Home = () => {

    return (
        <div className="relative bg-black h-screen">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 clip-diagonal opacity-90 bg-[rgba(246,188,255,0.09)] shadow-md backdrop-blur-lg"></div>
            <div className="relative text-white h-full overflow-y-scroll no-scrollba">
                <NavBar />
                <Hero />
                <Service />
            </div>
        </div>
    )
}
