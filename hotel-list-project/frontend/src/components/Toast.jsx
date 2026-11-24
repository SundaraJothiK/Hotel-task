import { useEffect } from 'react';
export default function Toast({message,onClose}){useEffect(()=>{if(!message)return;const t=setTimeout(onClose,3200);return()=>clearTimeout(t)},[message,onClose]);if(!message)return null;return <div className="toast" role="status"><span>✓</span>{message}<button onClick={onClose} aria-label="Close notification">×</button></div>}
