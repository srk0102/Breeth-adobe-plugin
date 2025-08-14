import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Home } from '../Pages';
import { NavBar } from '../components';

const App: React.FC = () => {
	const [dimensions, setDimensions] = useState({ width: 1280, height: 1000 });
	const lastDimensionsRef = useRef({ width: 600, height: 650 });
	const rafIdRef = useRef<number | null>(null);

	const updateDimensions = useCallback(() => {
		if (!window.cep) return;
		
		const width = window.innerWidth;
		const height = window.innerHeight;
		
		// Only update if dimensions actually changed
		if (width !== lastDimensionsRef.current.width || height !== lastDimensionsRef.current.height) {
			lastDimensionsRef.current = { width, height };
			setDimensions({ width, height });
		}
	}, []);

	const throttledUpdate = useCallback(() => {
		if (rafIdRef.current) return; // Already scheduled
		
		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null;
			updateDimensions();
		});
	}, [updateDimensions]);

	useEffect(() => {
		// Initial dimensions
		updateDimensions();
		
		// Add event listeners with throttling
		window.addEventListener('resize', throttledUpdate, { passive: true });
		
		if (window.__adobe_cep__) {
			window.__adobe_cep__.addEventListener('com.adobe.csxs.events.WindowGeometryChanged', throttledUpdate);
		}
		
		return () => {
			window.removeEventListener('resize', throttledUpdate);
			if (window.__adobe_cep__) {
				window.__adobe_cep__.removeEventListener('com.adobe.csxs.events.WindowGeometryChanged', throttledUpdate);
			}
			// Cancel pending animation frame
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [updateDimensions, throttledUpdate]);

	const navbarHeight = 64; // Fixed navbar height
	const heroHeight = Math.floor((dimensions.height - navbarHeight) * 0.4);
	const serviceHeight = Math.floor((dimensions.height - navbarHeight) * 0.6);

	return (
		<>
			<div 
				className='bg-black text-white relative overflow-hidden'
				style={{ width: dimensions.width, height: dimensions.height }}
			>
				{/* Background gradient effect similar to website */}
				<div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/20 via-blue-900/10 to-black"></div>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)]"></div>
				
				<div className="relative z-10 h-full flex flex-col">
					<div style={{ height: navbarHeight }}>
						<NavBar />
					</div>
					<div style={{ height: heroHeight }}>
						<Home section="hero" />
					</div>
					<div style={{ height: serviceHeight }}>
						<Home section="service" />
					</div>
				</div>
			</div>
		</>
	);
};

export default App;