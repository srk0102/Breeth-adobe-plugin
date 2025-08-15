import React from 'react';
import { Hero, Service } from '../components'

interface HomeProps {
    height: number;
}

export const Home: React.FC<HomeProps> = ({ height }) => {
    const heroSectionHeight = Math.floor(height * 0.4);
    const serviceSectionHeight = height - heroSectionHeight;

    return (
        <div className="flex-1 flex flex-col h-full">
            <div style={{ height: heroSectionHeight }}>
                <Hero />
            </div>
            <div style={{ height: serviceSectionHeight }}>
                <Service />
            </div>
        </div>
    );
}
