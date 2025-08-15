import { useState, useRef, useCallback, useEffect } from 'react';

export interface PanelDimensions {
	width: number;
	height: number;
}

export function usePanelDimensions(initial: PanelDimensions = { width: 1280, height: 1000 }): PanelDimensions {
	const [dimensions, setDimensions] = useState<PanelDimensions>(initial);
	const lastDimensionsRef = useRef<PanelDimensions>({ width: initial.width, height: initial.height });
	const rafIdRef = useRef<number | null>(null);

	const updateDimensions = useCallback(() => {
		if (!window.cep) return;
		const width = window.innerWidth;
		const height = window.innerHeight;
		if (width !== lastDimensionsRef.current.width || height !== lastDimensionsRef.current.height) {
			lastDimensionsRef.current = { width, height };
			setDimensions({ width, height });
		}
	}, []);

	const throttledUpdate = useCallback(() => {
		if (rafIdRef.current) return;
		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null;
			updateDimensions();
		});
	}, [updateDimensions]);

	useEffect(() => {
		updateDimensions();
		window.addEventListener('resize', throttledUpdate, { passive: true });
		if (window.__adobe_cep__) {
			window.__adobe_cep__.addEventListener('com.adobe.csxs.events.WindowGeometryChanged', throttledUpdate);
		}
		return () => {
			window.removeEventListener('resize', throttledUpdate);
			if (window.__adobe_cep__) {
				window.__adobe_cep__.removeEventListener('com.adobe.csxs.events.WindowGeometryChanged', throttledUpdate);
			}
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [throttledUpdate, updateDimensions]);

	return dimensions;
}


