import React from 'react';
import { Home } from '../Pages';
import { NavBar } from '../components';
import { usePanelDimensions } from '../hooks/usePanelDimensions';

const App: React.FC = () => {
	const dimensions = usePanelDimensions({ width: 1280, height: 1000 });
	const navbarHeight = 64;
	const contentHeight = dimensions.height - navbarHeight;

	return (
		<>
			<div 
				className='bg-black text-white relative overflow-hidden'
				style={{ width: dimensions.width, height: dimensions.height }}
			>
				<div className="absolute inset-0 bg-brand-gradient opacity-5"></div>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#8b5cf626_0%,transparent_70%)]"></div>
				
				<div className="relative h-full flex flex-col">
					<div style={{ height: navbarHeight }}>
						<NavBar />
					</div>
					<Home height={contentHeight} />
				</div>
			</div>
		</>
	);
};

export default App;