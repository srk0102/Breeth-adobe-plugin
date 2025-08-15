import { useState } from 'react';
import { ServiceModel } from './ServiceModel';
import { GradientIcon } from './common';

const emojiIcons = [
    { icon: "😀", name: "Deep Labs" },
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
    const [service, setService] = useState("select any service to proceed");

    const selectService = (serviceItem: { name: string }) => {
        setService(serviceItem.name);
    };


    return (
        <div className="h-full w-full p-6">
            <div className="h-full rounded-xl border border-alpha-10 bg-black/80">
                    <div className="flex h-full">
                        <div className="flex-1 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {service === "select any service to proceed" ? "AI Services" : service}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {service === "select any service to proceed" 
                                        ? "Choose an AI service from the sidebar to get started" 
                                        : "Configure your AI-powered workflow"}
                                </p>
                            </div>
                            
                            {service !== "select any service to proceed" && (
                                <div className="bg-white/5 rounded-xl p-4 border border-alpha-10">
                                    <ServiceModel />
                                </div>
                            )}
                            
                            {service === "select any service to proceed" && (
                                <div className="text-center py-8">
                                    <GradientIcon size="lg" className="w-20 h-20 rounded-2xl mx-auto mb-4" fromColor="bg-brand-gradient">
                                        <span className="text-3xl">🤖</span>
                                    </GradientIcon>
                                    <p className="text-gray-300 text-sm">Select a service to begin your AI-powered workflow</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Services Sidebar */}
                        <div className="w-20 border-l border-alpha-10 bg-white/5 flex flex-col items-center gap-2 p-3 overflow-y-auto no-scrollbar">
                            <div className="text-xs text-gray-400 font-medium mb-2 whitespace-nowrap">
                                AI Tools
                            </div>
                            {emojiIcons?.map((e, index) => (
                                <button
                                    key={index}
                                    className={`w-12 h-12 cursor-pointer text-lg hover:scale-105 rounded-xl transition-transform-opacity active:scale-95 flex items-center justify-center ${
                                        service === e.name 
                                            ? 'bg-brand-gradient shadow-lg border border-brand-primary/50' 
                                            : 'bg-black/40 hover:bg-black/60 border border-alpha-12 hover:border-brand-primary/30'
                                    }`}
                                    onClick={() => selectService(e)}
                                    title={e.name}
                                >
                                    {e.icon}
                                </button>
                            ))}
                        </div>
                    </div>
            </div>
        </div>
    )
}
