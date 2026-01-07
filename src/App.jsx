import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, Dna, Users, MapPin, Menu, X, Layers, TrendingUp, ExternalLink, Microscope, Cpu, Leaf, TestTube, Activity } from 'lucide-react';
import { BRAND, SECTIONS, HERO, MARQUEE, ABOUT, FOCUS, TEAM, BUSINESS, NETWORK, PORTFOLIO, CONTACT, FOOTER } from './content.jsx';

const ICONS = {
  Activity,
  Dna,
  Microscope,
  Cpu,
  TestTube,
  Leaf,
  Layers,
  TrendingUp,
};

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((section) => [section.id, section]));

const renderIcon = (iconKey, className) => {
  const Icon = ICONS[iconKey];
  if (!Icon) return null;
  return <Icon className={className} />;
};

// --- COMPONENTS ---

const SectionHeader = ({ number, title, align = "left" }) => (
  <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start"} mb-12 md:mb-24 relative z-10`}>
    <span className="font-mono text-sm md:text-base text-blue-600 mb-2 tracking-widest">[ {number} ]</span>
    <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase text-slate-900 leading-[0.9]">
      {title}
    </h2>
  </div>
);

// Improved Custom Cursor with blending mode
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const mouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    
    // Add hover listeners for interactive elements
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.interactive')) {
        setIsHovering(true);
      }
    };
    const handleMouseOut = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.interactive')) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 border-2 border-blue-600 rounded-full pointer-events-none z-[60] hidden md:flex items-center justify-center mix-blend-exclusion"
      animate={{ 
        x: mousePosition.x - (isHovering ? 32 : 16), 
        y: mousePosition.y - (isHovering ? 32 : 16),
        width: isHovering ? 64 : 32,
        height: isHovering ? 64 : 32,
        backgroundColor: isHovering ? "rgba(37, 99, 235, 1)" : "transparent"
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {!isHovering && <div className="w-1 h-1 bg-blue-600 rounded-full" />}
    </motion.div>
  );
};

// Infinite Marquee Component
const InfiniteMarquee = ({ text, speed = 20, direction = 1 }) => {
  return (
    <div className="relative flex overflow-hidden py-4 border-y border-slate-900 bg-slate-900 text-white">
      <motion.div
        className="flex whitespace-nowrap font-mono text-lg font-bold tracking-widest uppercase"
        animate={{ x: direction === 1 ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-8 flex items-center">
            {text} <span className="ml-8 text-blue-500">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// Advanced Network Canvas
const NetworkCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Dynamic nodes based on NETWORK.nodes but scaled
    let nodes = NETWORK.nodes.map(n => ({
      x: (n.x / 100) * canvas.width,
      y: (n.y / 100) * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      city: n.city
    }));

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      // Re-position nodes proportionally
      nodes = NETWORK.nodes.map(n => ({
        x: (n.x / 100) * canvas.width,
        y: (n.y / 100) * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        city: n.city
      }));
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw Connections
      ctx.lineWidth = 1;
      nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
          if (i >= j) return;
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < canvas.width * 0.4) {
             ctx.beginPath();
             ctx.strokeStyle = `rgba(37, 99, 235, ${1 - dist / (canvas.width * 0.4)})`;
             ctx.moveTo(nodeA.x, nodeA.y);
             ctx.lineTo(nodeB.x, nodeB.y);
             ctx.stroke();
          }
        });
      });

      // Draw Nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.fillStyle = '#2563eb'; // blue-600
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // City Name
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px monospace';
        ctx.fillText(node.city, node.x + 10, node.y + 4);
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
};


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = SECTIONS;

  return (
    <nav className="fixed top-0 w-full z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1920px] mx-auto px-6 h-20 flex justify-between items-center">
        <a href="#" className="text-2xl font-black tracking-tighter z-50 interactive">
          {BRAND.left}
          <span className="text-blue-600">{BRAND.dot}</span>
          {BRAND.right}
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="font-mono text-sm uppercase tracking-wider hover:text-blue-600 transition-colors interactive">
              {link.navLabel}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden z-50 interactive" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full h-screen bg-slate-50 flex flex-col items-center justify-center space-y-8 md:hidden"
            >
              {links.map((link) => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-bold tracking-tighter hover:text-blue-600 interactive"
                >
                  {link.navLabel}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [portfolioHoverImage, setPortfolioHoverImage] = useState(null);
  const [expandedPortfolioId, setExpandedPortfolioId] = useState(null);
  const businessTitleLines = SECTION_BY_ID.business.titleLines ?? [SECTION_BY_ID.business.title];

  const togglePortfolio = (id) => {
    setExpandedPortfolioId(expandedPortfolioId === id ? null : id);
  };

  return (
    <div className="bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white cursor-none-override min-h-screen relative overflow-x-hidden font-sans">
      <CustomCursor />
      <Navigation />
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-20 left-0 right-0 h-1 bg-blue-600 origin-left z-50" style={{ scaleX }} />

      {/* NOISE TEXTURE OVERLAY - Adds "Concrete" feel */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.06] mix-blend-overlay"
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }} 
      />

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <main className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-between px-6 py-12 md:p-24 border-b border-slate-200 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            <div className="col-span-1 md:col-span-8 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-6xl md:text-[8vw] leading-[0.85] font-black tracking-tighter mb-8 mix-blend-darken">
                  {HERO.titleLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < HERO.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-mono text-sm md:text-xl max-w-xl border-l-2 border-blue-600 pl-6 text-slate-600"
              >
                {HERO.subtitleLines.map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < HERO.subtitleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </motion.p>
            </div>
            <div className="col-span-1 md:col-span-4 flex items-end justify-end md:justify-start">
               <div className="w-full h-[300px] md:h-full border-2 border-slate-900 bg-slate-900 text-slate-50 p-6 flex flex-col justify-between hover:bg-slate-800 transition-colors duration-500 shadow-2xl">
                  {renderIcon(HERO.card.iconKey, "w-12 h-12 text-blue-500 animate-pulse")}
                  <div className="font-mono text-xs space-y-2 opacity-70">
                    {HERO.card.lines.map((line) => (
                      <p key={line.text} className={line.accent ? "text-blue-400" : undefined}>
                        {line.text}
                      </p>
                    ))}
                  </div>
               </div>
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0"
          >
            <ArrowRight className="rotate-90 w-8 h-8 text-blue-600" />
          </motion.div>
        </section>

        {/* INFINITE MARQUEE */}
        <InfiniteMarquee text={MARQUEE.primary} />

        {/* ABOUT US */}
        <section id="about" className="min-h-screen px-6 py-24 border-b border-slate-200">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <SectionHeader number={SECTION_BY_ID.about.number} title={SECTION_BY_ID.about.title} />
            <div className="flex flex-col justify-center space-y-12 pt-12 md:pt-0">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-light leading-tight"
              >
                {ABOUT.headlineLine} <br/>
                <span className="font-bold bg-blue-600 text-white px-2 py-1">{ABOUT.headlineHighlight}</span>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-slate-900 pt-8">
                <div>
                  <h3 className="font-mono font-bold text-blue-600 mb-2 text-xl">{ABOUT.missionTitle}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {ABOUT.missionText}
                  </p>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-blue-600 mb-2 text-xl">{ABOUT.visionTitle}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {ABOUT.visionText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: FOCUS AREAS */}
        <section id="focus" className="py-24 px-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-[1920px] mx-auto">
             <SectionHeader number={SECTION_BY_ID.focus.number} title={SECTION_BY_ID.focus.title} />
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-slate-900/10">
                {FOCUS.areas.map((area, index) => (
                   <motion.div
                     key={area.id}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     className="group relative h-[320px] p-8 border-r border-b border-slate-300 bg-white hover:bg-slate-900 hover:text-white transition-all duration-500 cursor-crosshair overflow-hidden interactive"
                   >
                      <div className="absolute top-6 right-6 font-mono text-xs text-slate-400 group-hover:text-blue-500 transition-colors">
                        [{area.code}]
                      </div>
                      
                      <div className="h-full flex flex-col justify-between relative z-10">
                         <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                           {renderIcon(area.iconKey, "w-8 h-8")}
                         </div>
                         
                         <div>
                           <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">{area.title}</h3>
                           <p className="font-mono text-sm text-blue-600 mb-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                             {area.kor}
                           </p>
                           <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                             {area.desc}
                           </p>
                         </div>
                      </div>

                      {/* Hover Decoration */}
                      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                   </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="py-24 px-6 border-b border-slate-200 bg-slate-100">
          <div className="max-w-[1920px] mx-auto">
            <SectionHeader number={SECTION_BY_ID.team.number} title={SECTION_BY_ID.team.title} align="right" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {TEAM.members.map((member, index) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white h-[400px] border border-slate-200 overflow-hidden cursor-none interactive hover:border-blue-600 hover:border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:z-10"
                >
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                     <Users className="w-24 h-24 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-900/90 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xl font-bold">{member.name}</h3>
                    <p className="text-blue-400 font-mono text-sm mb-2">{member.role}</p>
                    <p className="text-slate-300 text-xs mb-4 line-clamp-2">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map(tag => (
                        <span key={tag} className="text-[10px] border border-white/30 text-white px-2 py-1 uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BUSINESS MODEL (Refined Layout) */}
        <section id="business" className="py-24 px-6 bg-slate-900 text-slate-50 border-b border-slate-800">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-24 text-white">
                <span className="font-mono text-sm text-blue-500 mb-2 block tracking-widest">[ {SECTION_BY_ID.business.number} ]</span>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">
                  {businessTitleLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < businessTitleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-slate-800">
              {BUSINESS.steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative z-10 interactive p-12 border-b lg:border-b-0 lg:border-r border-slate-800 hover:bg-slate-800 transition-all duration-500"
                >
                  {/* Big Number Background */}
                  <div className="absolute right-4 top-4 text-[120px] font-black text-slate-800/50 leading-none pointer-events-none group-hover:text-blue-900/30 transition-colors">
                    {step.id}
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="mb-12">
                       <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                         {renderIcon(step.iconKey, "w-10 h-10")}
                       </div>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-bold mb-4 flex items-center tracking-tight">
                        {step.title}
                      </h3>
                      <div className="w-12 h-1 bg-blue-600 mb-6 group-hover:w-full transition-all duration-500 ease-out"></div>
                      <p className="text-slate-400 text-lg leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* SECOND MARQUEE */}
        <InfiniteMarquee text={MARQUEE.secondary} speed={25} direction={-1} />

        {/* NETWORK */}
        <section id="network" className="py-24 px-6 border-b border-slate-200">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <SectionHeader number={SECTION_BY_ID.network.number} title={SECTION_BY_ID.network.title} />
            <div className="relative h-[400px] md:h-[600px] border-2 border-slate-900 bg-slate-50 overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
               
               {/* New Canvas Network */}
               <NetworkCanvas />

               <div className="absolute bottom-6 left-6 font-mono text-xs text-slate-900 bg-white border border-slate-900 p-4 shadow-lg z-20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold">{NETWORK.statusLabel}</span>
                  </div>
                  {NETWORK.statusLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line.replace("{count}", NETWORK.nodes.length)}
                      {index < NETWORK.statusLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO (Interactive Accordion) */}
        <section id="portfolio" className="py-24 px-6 border-b border-slate-200 relative overflow-hidden bg-slate-50">
           {/* Dynamic Background Image - Only show when hovering and NOT expanded */}
           <AnimatePresence mode="wait">
             {portfolioHoverImage && expandedPortfolioId === null && (
               <motion.div 
                 key={portfolioHoverImage}
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 0.15, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.4 }}
                 className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none grayscale mix-blend-multiply"
                 style={{ backgroundImage: `url(${portfolioHoverImage})` }}
               />
             )}
           </AnimatePresence>

           <div className="max-w-[1920px] mx-auto relative z-10">
             <SectionHeader number={SECTION_BY_ID.portfolio.number} title={SECTION_BY_ID.portfolio.title} />
             
             <div className="mt-12">
               {/* Table Header */}
               <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b-4 border-slate-900 font-mono text-sm uppercase font-bold text-slate-500">
                 <div className="col-span-1">{PORTFOLIO.tableHeaders.no}</div>
                 <div className="col-span-4">{PORTFOLIO.tableHeaders.company}</div>
                 <div className="col-span-4">{PORTFOLIO.tableHeaders.category}</div>
                 <div className="col-span-2 text-right">{PORTFOLIO.tableHeaders.year}</div>
                 <div className="col-span-1 text-center">{PORTFOLIO.tableHeaders.info}</div>
               </div>

               {/* Portfolio List */}
               {PORTFOLIO.items.map((item, index) => {
                 const displayNo = String(index + 1).padStart(2, "0");
                 return (
                   <div key={item.id} className="border-b border-slate-300">
                     <motion.div 
                       initial={{ backgroundColor: "rgba(255,255,255,0)" }}
                       whileHover={{ backgroundColor: expandedPortfolioId === item.id ? "rgba(255,255,255,0)" : "rgba(37, 99, 235, 0.05)" }}
                       onClick={() => togglePortfolio(item.id)}
                       onMouseEnter={() => setPortfolioHoverImage(item.image)}
                       onMouseLeave={() => setPortfolioHoverImage(null)}
                       className={`grid grid-cols-1 md:grid-cols-12 gap-4 py-8 md:py-10 items-center transition-colors group cursor-pointer interactive ${expandedPortfolioId === item.id ? 'bg-slate-900 text-white' : ''}`}
                     >
                        <div className={`col-span-1 font-mono text-xs md:text-sm pl-2 md:pl-0 ${expandedPortfolioId === item.id ? 'text-blue-400' : 'text-blue-600'}`}>{displayNo}</div>
                        <div className={`col-span-4 text-3xl md:text-5xl font-black uppercase tracking-tighter transition-all duration-300 ${expandedPortfolioId === item.id ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>
                          {item.name}
                        </div>
                        <div className={`col-span-4 font-mono text-sm md:text-lg flex items-center ${expandedPortfolioId === item.id ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span className={`w-2 h-2 mr-2 rounded-full ${expandedPortfolioId === item.id ? 'bg-blue-500' : 'bg-slate-400 group-hover:bg-blue-600'}`}></span>
                          {item.category}
                        </div>
                        <div className={`col-span-2 text-right font-mono font-bold ${expandedPortfolioId === item.id ? 'text-slate-400' : 'text-slate-400 group-hover:text-slate-900'}`}>
                          {item.year}
                        </div>
                        <div className="col-span-1 flex justify-center">
                           {expandedPortfolioId === item.id ? <Minus className="text-blue-500" /> : <Plus className="text-slate-400 group-hover:text-blue-600" />}
                        </div>
                     </motion.div>

                     {/* Expandable Content */}
                     <AnimatePresence>
                       {expandedPortfolioId === item.id && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.4, ease: "easeInOut" }}
                           className="overflow-hidden bg-slate-900 text-slate-300"
                         >
                           <div className="p-8 md:p-12 border-t border-slate-800">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                               <div>
                                 <h4 className="font-mono text-blue-500 mb-4 text-sm tracking-widest uppercase">{PORTFOLIO.investmentLabel}</h4>
                                 <p className="text-lg md:text-xl text-white leading-relaxed font-light">
                                   {item.description}
                                 </p>
                                 
                                 <div className="mt-8">
                                   <button className="flex items-center space-x-2 text-sm font-bold uppercase hover:text-blue-500 transition-colors border-b border-transparent hover:border-blue-500 pb-1">
                                      <span>{PORTFOLIO.visitLabel}</span>
                                      <ExternalLink size={14} />
                                   </button>
                                 </div>
                               </div>
                               
                               <div className="space-y-6">
                                 <h4 className="font-mono text-blue-500 mb-4 text-sm tracking-widest uppercase">{PORTFOLIO.milestonesLabel}</h4>
                                 <ul className="space-y-4">
                                   {item.highlights.map((highlight, idx) => (
                                     <li key={idx} className="flex items-start">
                                       <ArrowRight className="min-w-[20px] w-5 h-5 mr-3 text-blue-600 mt-1" />
                                       <span className="text-lg">{highlight}</span>
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                             </div>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 );
               })}
             </div>
           </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="min-h-[80vh] flex flex-col justify-between py-24 px-6 bg-slate-900 text-slate-50">
           <div className="max-w-[1920px] mx-auto w-full">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                <span className="font-mono text-blue-500 block mb-4">{CONTACT.pretitle}</span>
                <h2 className="text-6xl md:text-[8rem] font-bold leading-none tracking-tighter mb-12">
                  {CONTACT.titleLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < CONTACT.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <form className="space-y-6 max-w-md">
                   <div className="border-b border-slate-700 py-2 group focus-within:border-blue-500 transition-colors">
                      <input type="text" placeholder={CONTACT.form.namePlaceholder} className="w-full bg-transparent outline-none text-xl placeholder-slate-600 py-2 interactive" />
                    </div>
                    <div className="border-b border-slate-700 py-2 group focus-within:border-blue-500 transition-colors">
                      <input type="email" placeholder={CONTACT.form.emailPlaceholder} className="w-full bg-transparent outline-none text-xl placeholder-slate-600 py-2 interactive" />
                    </div>
                    <div className="border-b border-slate-700 py-2 group focus-within:border-blue-500 transition-colors">
                      <textarea placeholder={CONTACT.form.messagePlaceholder} rows="3" className="w-full bg-transparent outline-none text-xl placeholder-slate-600 py-2 resize-none interactive"></textarea>
                    </div>
                    <button className="group flex items-center space-x-2 text-xl font-bold uppercase hover:text-blue-500 transition-colors mt-8 interactive">
                      <span>{CONTACT.form.submitLabel}</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </form>
               </div>
               
               <div className="flex flex-col justify-end lg:items-end space-y-12">
                  <div className="space-y-4 text-right">
                    <h3 className="font-mono text-slate-500">{CONTACT.headquartersLabel}</h3>
                    <p className="text-2xl font-bold">
                      {CONTACT.headquartersAddressLines.map((line, index) => (
                        <React.Fragment key={`${line}-${index}`}>
                          {line}
                          {index < CONTACT.headquartersAddressLines.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                    <div className="flex items-center justify-end space-x-2 text-blue-500">
                      <MapPin size={18} />
                      <a href="#" className="hover:underline interactive">{CONTACT.mapLinkLabel}</a>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-right">
                    <h3 className="font-mono text-slate-500">{CONTACT.contactLabel}</h3>
                    <a href={`mailto:${CONTACT.email}`} className="text-3xl md:text-5xl font-bold hover:text-blue-500 transition-colors underline decoration-2 underline-offset-8 interactive">
                      {CONTACT.email}
                    </a>
                  </div>
               </div>
             </div>
           </div>
           
           <footer className="mt-24 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-slate-500">
             <p>{FOOTER.copyright}</p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               {FOOTER.links.map((link) => (
                 <a key={link.label} href={link.href} className="hover:text-white interactive">{link.label}</a>
               ))}
             </div>
           </footer>
        </section>

      </main>
    </div>
  );
}
