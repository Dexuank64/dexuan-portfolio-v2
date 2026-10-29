import './media.css';
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
export function MediaVideo({autoPlay=false,preload='none',controls=false,children,...props}){
 const video=useRef(null);const [observeRef,active]=useMediaActivity();
 const [duration,setDuration]=useState(0),[current,setCurrent]=useState(0),[playing,setPlaying]=useState(false),[muted,setMuted]=useState(!!props.muted);
 const togglePlay=()=>{const el=video.current;if(el){if(el.paused)el.play().catch(()=>{});else el.pause();}};
 const toggleMute=()=>{const el=video.current;if(el){el.muted=!el.muted;setMuted(el.muted);}};
 const fullscreen=()=>{const el=video.current;if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});else if(el?.parentElement.requestFullscreen)el.parentElement.requestFullscreen().catch(()=>{});else el?.webkitEnterFullscreen?.();};
 const syncTime=()=>{const el=video.current;if(el){setDuration(Number.isFinite(el.duration)?el.duration:0);setCurrent(el.currentTime||0);}};
 const seek=value=>{const el=video.current;if(el&&Number.isFinite(el.duration)){el.currentTime=Math.max(0,Math.min(el.duration,value));setCurrent(el.currentTime);}};
 const stamp=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,"0")}`;
 useEffect(()=>{const el=video.current;if(!el)return;const update=()=>{const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const saveData=navigator.connection?.saveData;if(!active||(autoPlay&&(reduced||saveData))){el.pause();return;}if(autoPlay)el.play().catch(()=>{});};update();if(!autoPlay)return;const preference=window.matchMedia('(prefers-reduced-motion: reduce)');preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);},[active,autoPlay]);
 const bind=useCallback(el=>{video.current=el;observeRef(el);},[observeRef]);
 const player=<video {...props} controls={false} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onVolumeChange={()=>setMuted(!!video.current?.muted)} preload={controls&&active?'metadata':preload} ref={bind} onLoadedMetadata={syncTime} onDurationChange={syncTime} onTimeUpdate={syncTime}>{children}</video>;
 return controls?<div className="media-player">{player}<div className="media-seek-controls"><button type="button" aria-label={playing?"Pause video":"Play video"} onClick={togglePlay}>{playing?"Ⅱ":"▶"}</button><button type="button" aria-label="Rewind 10 seconds" disabled={!duration} onClick={()=>seek(current-10)}>−10s</button><input type="range" min="0" max={duration||1} step="0.1" value={Math.min(current,duration||1)} disabled={!duration} aria-label="Video playback position" aria-valuetext={stamp(current)+' / '+stamp(duration)} onChange={event=>seek(Number(event.target.value))}/><span>{stamp(current)} / {stamp(duration)}</span><button type="button" aria-label="Forward 10 seconds" disabled={!duration} onClick={()=>seek(current+10)}>+10s</button><button type="button" aria-label={muted?"Unmute video":"Mute video"} onClick={toggleMute}>{muted?"Unmute":"Mute"}</button><button type="button" aria-label="Toggle fullscreen" onClick={fullscreen}>⛶</button></div></div>:player;
}
