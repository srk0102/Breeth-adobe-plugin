import React from 'react';
import { Hero, Service } from '../components'

interface HomeProps {
    section?: 'hero' | 'service';
}

export const Home: React.FC<HomeProps> = ({ section }) => {
    if (section === 'hero') {
        return (
            <div className="h-full w-full">
                <Hero />
            </div>
        );
    }
    
    if (section === 'service') {
        return (
            <div className="h-full w-full">
                <Service />
            </div>
        );
    }

    // Default: render both sections (fallback)
    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="h-2/5">
                <Hero />
            </div>
            <div className="h-3/5">
                <Service />
            </div>
        </div>
    )
}
