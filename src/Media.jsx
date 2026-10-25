import mediaSizes from './media-sizes.js';
import React,{useEffect,useState,useRef,useCallback} from 'react';
const subscriptions=new Map();
let observer;
function emit(){const visible=document.visibilityState!=='hidden';for(const record of subscriptions.values())record.notify(record.near&&visible);}
function observe(node,notify){
 if(!('IntersectionObserver' in window)){notify(true);return ()=>{};}
 if(!observer)observer=new IntersectionObserver(entries=>{for(const entry of entries){const record=subscriptions.get(entry.target);if(record)record.near=entry.isIntersecting;}emit();},{rootMargin:'200px 0px'});
 if(!subscriptions.size)document.addEventListener('visibilitychange',emit);
 subscriptions.set(node,{notify,near:false});observer.observe(node);
 return ()=>{observer.unobserve(node);subscriptions.delete(node);if(!subscriptions.size){observer.disconnect();observer=undefined;document.removeEventListener('visibilitychange',emit);}};
}
function useMediaActivity(){const [node,setNode]=useState(null);const [active,setActive]=useState(false);useEffect(()=>node?observe(node,setActive):undefined,[node]);return [setNode,active];}
export function isAnimatedAsset(src){return !!mediaSizes[src.split('/assets/').pop()];}
export function AnimatedImage({src,alt,...props}){const [ref,active]=useMediaActivity();const size=mediaSizes[src.split('/assets/').pop()];return <img width={size?.width} height={size?.height} {...props} ref={ref} src={active?src:src.replace(/\.(gif|webp)$/,'-still.webp')} alt={alt} loading="lazy" decoding="async"/>;}
export function MediaVideo({autoPlay=false,preload='none',children,...props}){
 const video=useRef(null);const [observeRef,active]=useMediaActivity();
 useEffect(()=>{const el=video.current;if(!el)return;const update=()=>{const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const saveData=navigator.connection?.saveData;if(!active||(autoPlay&&(reduced||saveData))){el.pause();return;}if(autoPlay)el.play().catch(()=>{});};update();if(!autoPlay)return;const preference=window.matchMedia('(prefers-reduced-motion: reduce)');preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);},[active,autoPlay]);
 const bind=useCallback(el=>{video.current=el;observeRef(el);},[observeRef]);
 return <video {...props} preload={preload} ref={bind}>{children}</video>;
}
