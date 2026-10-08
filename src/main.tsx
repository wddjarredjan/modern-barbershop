import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

function hideLoadingOverlay(){
	const el = document.getElementById('loading-screen');
	if(!el) return;
	// add class to trigger fade/transform then remove from DOM after transition
	el.classList.add('loaded');
	setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); }, 700);
}

// Run after next paint to ensure app has mounted
requestAnimationFrame(()=> requestAnimationFrame(hideLoadingOverlay));
