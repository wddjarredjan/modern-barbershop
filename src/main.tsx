import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

function hideLoadingOverlay(){
	const el = document.getElementById('loading-screen');
	if(!el) return;
	// ensure loader is visible for at least `minDuration` milliseconds
	const minDuration = 3000; // 3 seconds
	const start = (window as any).__loadingStart ?? ((performance && performance.now) ? performance.now() : Date.now());
	const now = (performance && performance.now) ? performance.now() : Date.now();
	const elapsed = now - start;
	const wait = Math.max(0, minDuration - elapsed);

	setTimeout(() => {
		// add class to trigger fade/transform then remove from DOM after transition
		el.classList.add('loaded');
		setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
	}, wait);
}

// Run after next paint to ensure app has mounted
requestAnimationFrame(()=> requestAnimationFrame(hideLoadingOverlay));
