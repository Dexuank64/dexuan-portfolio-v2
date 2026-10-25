import {MediaVideo} from './Media.jsx';
import React,{useEffect,useRef,useState} from 'react';
import {projects} from './projects.js';
import {combatSystems,personalProjects} from './portfolio-content.js';
import ReadMore,{ReadMoreLink,readMoreId} from './ReadMore.jsx';
import './styles.css';
import './pages.css';
import './home-refinements.css';
import SocialLinks from './SocialLinks.jsx';
import Archive from './Archive.jsx';
import AboutMe from './AboutMe.jsx';
const A='/assets/';
const linkedin='https://www.linkedin.com/in/dexuan-kong-9a72b32b3/';
const email='dexuank64@gmail.com';
export function pageForHash(hash){if(readMoreId(hash))return 'detail';if(hash==='#project-archive'||hash==='#combat')return 'archive';if(hash==='#about')return 'about';return 'home';}
export function TeamProject({project,onReadMore,index}){
 return <article className="team-project" id={project.id}><div className="project-copy"><div className="eyebrow">0{index} / {project.id==='icarus'?'YEAR 2':'YEAR 1'} TEAM PROJECT</div><div className="project-heading-row"><div><h3>{project.name}<span>({project.year})</span></h3><div className="role">Technical Game Designer</div></div><div className="project-logos"><img className="engine-logo" src={A+'unreal-engine-logo.webp'} alt="Unreal Engine 5"/><img className={project.id==='icarus'?'engine-logo':'team-logo'} src={A+(project.id==='icarus'?'icarus-team-logo.webp':'hyrax-games-logo.webp')} alt={project.id==='icarus'?'Icarus team emblem':'Hyrax Games'}/></div></div><p className="project-description">{project.intro}</p><div className="project-columns"><section><h4>Project Information</h4><dl><div><dt>Team</dt><dd>{project.team}</dd></div><div><dt>Duration</dt><dd>{project.time}</dd></div><div><dt>Engine</dt><dd>Unreal Engine 5</dd></div><div><dt>Platform</dt><dd>PC</dd></div><div><dt>Genre</dt><dd>{project.genre}</dd></div></dl></section><section className="responsibilities"><h4>Responsibility Highlights</h4><ul>{project.contributions.map(text=><li key={text}>{text}</li>)}</ul></section></div><div className="project-actions"><ReadMoreLink id={project.id} onOpen={onReadMore}/><a className="button button-gold" href={project.url}>View on itch.io <span>↗</span></a></div></div><div className="project-visual"><div className="project-image-wrap"><MediaVideo className="project-video" controls playsInline preload="none" aria-label={project.name+' trailer'} poster={A+(project.id==='icarus'?'icarus-video-cover.webp':(project.cover||project.image))}><source src={A+(project.id==='icarus'?'icarus-final-trailer.mp4':'palegrave-final-trailer.mp4')} type="video/mp4"/></MediaVideo><div className="image-tag">{project.id==='icarus'?'ENEMY AI / UI & UX':'ENEMY BEHAVIOR / COMBAT VFX'}</div></div>{project.award?<div className="project-award-badges" aria-label="BUas Game Awards"><img src={A+'y1-best-tech-award.webp'} alt="Year 1 Best Tech Award"/><img src={A+'y1-industry-award.webp'} alt="Year 1 Industry Award"/></div>:null}</div></article>;
}
function Hero(){return <section id="home" className="hero"><MediaVideo className="hero-video" autoPlay muted loop playsInline preload="none" poster={A+'hero-poster.jpg'} aria-label="Gameplay showreel provided by Dexuan Kong"><source src={A+'hero-showreel.mp4'} type="video/mp4"/></MediaVideo><div className="hero-shade"/><div className="hero-layout container"><div className="hero-about"><img fetchPriority="high" decoding="async" width="200" height="200" className="hero-portrait" src={A+'portrait.webp'} alt="Dexuan Kong"/><h1>About me</h1><p>Technical Game Designer with a passion for exploring new ideas, turning them into playable prototypes, and refining the details that shape the player experience.</p><div className="hero-meta"><span>Chinese</span><span>Tilburg, Netherlands</span></div><a href="#icarus" className="button button-gold">Projects <span>↓</span></a></div></div></section>;}
export default function App(){
 const [menu,setMenu]=useState(false),[hash,setHash]=useState(()=>window.location.hash);
 const detail=readMoreId(hash),page=pageForHash(hash);
 const scrollPosition=useRef(null),backPosition=useRef(false);
 const notes={icarus:{...projects[0],parent:'icarus'},palegrave:{...projects[1],parent:'palegrave'},dmc5:{...combatSystems.sections[0],parent:'combat'},witcher3:{...combatSystems.sections[1],parent:'combat'}};
 useEffect(()=>{const sync=()=>{if(readMoreId(hash)&&!readMoreId(window.location.hash))backPosition.current=true;setHash(window.location.hash);setMenu(false);};window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);};},[hash]);
 useEffect(()=>{if(backPosition.current&&scrollPosition.current!==null){backPosition.current=false;window.scrollTo({top:scrollPosition.current,behavior:'instant'});return;}const anchor=hash.slice(1);if(page==='home'&&['icarus','palegrave','main-projects','contact'].includes(anchor))document.getElementById(anchor)?.scrollIntoView({behavior:'smooth'});else if(page==='archive'&&anchor==='combat')document.getElementById('combat')?.scrollIntoView();else window.scrollTo({top:0,behavior:'instant'});},[hash,page]);
 const go=(event,target)=>{if(event){event.preventDefault();setMenu(false);}if(window.location.hash===target){window.scrollTo({top:0,behavior:'smooth'});return;}window.history.pushState(null,'',target);setHash(target);};
 const openDetail=id=>{scrollPosition.current=window.scrollY;window.history.pushState({portfolioDetail:true},'','#read-more/'+id);setHash('#read-more/'+id);};
 const back=()=>{if(window.history.state?.portfolioDetail)window.history.back();else go(null,notes[detail].parent==='combat'?'#project-archive':'#'+notes[detail].parent);};
 return <><header className="site-header"><div className="header-inner container"><a href="#home" className="brand" onClick={e=>go(e,'#home')}><span>Dexuan Kong <em>Technical Game Designer</em></span></a><button className="menu-toggle" aria-expanded={menu} aria-label="Toggle navigation" onClick={()=>setMenu(v=>!v)}>{menu?'Close ✕':'Menu ☰'}</button><nav aria-label="Main navigation" className={menu?'is-open':''}>{[['#home','Main Projects','home'],['#project-archive','Project Archive','archive'],['#about','About me','about']].map(([target,title,targetPage])=><a key={target} href={target} aria-current={page===targetPage?'page':undefined} onClick={e=>go(e,target)}>{title}</a>)}<a href={A+'Dexuan-Kong-Resume.pdf'}>Resume <span>↗</span></a><SocialLinks/></nav></div></header>
 {detail&&<ReadMore project={notes[detail]} onBack={back}/>}
 <main hidden={!!detail}>
 {page==='home'&&<>
  <Hero/>
  <section id="main-projects" className="container main-projects section"><div className="main-projects-heading"><h2>Main Projects</h2></div>{projects.slice(0,2).map((project,index)=><TeamProject key={project.id} project={project} index={index+1} onReadMore={openDetail}/>)}</section>
 </>}
 {page==='archive'&&<Archive onReadMore={openDetail}/>}
 {page==='about'&&<AboutMe/>}
  <footer id="contact" className="social-footer"><SocialLinks/></footer>
 </main></>;
}

