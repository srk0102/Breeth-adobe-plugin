import React from 'react'

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
    return (
        <div className='group grid grid-cols-12 h-4/6'>
            <div className='description border col-span-11 p-4'>
                <h1 className="text-2xl font-bold">Emoji Description</h1>
                <p>Hover on an emoji to see its name and enjoy the animations!</p>
            </div>
            <div className='services border col-span-1 flex flex-col justify-between items-center gap-3 p-3 overflow-y-scroll no-scrollbar bg-[rgba(246,188,255,0.09)] shadow-md backdrop-blur-lg'>
                {emojiIcons?.map((e) => (
                    <p>{e.icon}</p>
                ))}
            </div>
            <div className='send col-span-12 border'>
                like
            </div>
        </div>
    )
}
