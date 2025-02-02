import React, { useState } from 'react'

import { evalTS } from "../../lib/utils/bolt";

const emojiIcons = [
    { icon: "😀", name: "grinning-face" },
    { icon: "🎵", name: "musical-note" },
    { icon: "🎥", name: "movie-camera" },
    { icon: "🖼️", name: "framed-picture" },
    { icon: "📷", name: "camera" },
    { icon: "🎤", name: "microphone" },
    { icon: "🔊", name: "speaker" },
    { icon: "📽️", name: "film-projector" },
    { icon: "🎧", name: "headphones" },
    { icon: "📀", name: "dvd" },
    { icon: "💾", name: "floppy-disk" },
    { icon: "🖥️", name: "desktop-computer" },
    { icon: "📱", name: "mobile-phone" },
    { icon: "🔒", name: "lock" },
    { icon: "📝", name: "notepad" },
    { icon: "🌟", name: "star" },
    { icon: "🎯", name: "dartboard" },
    { icon: "🎬", name: "clapperboard" },
    { icon: "📡", name: "satellite-dish" },
    { icon: "🚀", name: "rocket" },
    { icon: "🎮", name: "video-game" },
    { icon: "📚", name: "books" },
    { icon: "🌍", name: "globe" },
    { icon: "💡", name: "light-bulb" },
    { icon: "🎨", name: "palette" },
    { icon: "📌", name: "push-pin" },
    { icon: "🛠️", name: "tools" },
    { icon: "🔍", name: "magnifying-glass" },
    { icon: "📊", name: "bar-chart" },
    { icon: "📎", name: "paperclip" },
];


export const Service = () => {

    const logo = "D:/breeth/premierpro-breeth-cep/src/js/main/assets/logo.png";

    const [service, setService] = useState()

    const selctService = (e: any) => {
        setService(e.name)
    }

    const handleSetFile = async () => {
        if (!logo) {
            alert("No file loaded!");
            return;
        }

        // Call ExtendScript function in Premiere Pro
        await evalTS("importAndSetFile", logo);
    };


    return (
        <div className='group grid grid-cols-12 h-4/6'>
            <div className='description border col-span-11 p-4'>
                <h1 className="text-2xl font-bold">Emoji Description</h1>
                <p>Hover on an emoji to see its name and enjoy the animations!</p>
                <p>{service}</p>
            </div>
            <div className='services border col-span-1 flex flex-col justify-between items-center gap-3 p-3 overflow-y-scroll no-scrollbar bg-[rgba(246,188,255,0.09)] shadow-md backdrop-blur-lg'>
                {emojiIcons?.map((e) => (
                    <p className='cursor-pointer' onClick={() => selctService(e)}>{e.icon}</p>
                ))}
            </div>
            <div className='send col-span-12 border flex flex-row justify-around'>
                <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Like</button>
                <button onClick={handleSetFile} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Set File</button>
            </div>
        </div >
    )
}
