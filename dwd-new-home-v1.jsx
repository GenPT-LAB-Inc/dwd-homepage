import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import { ArrowRight, Plus, Minus, Globe, Dna, Briefcase, Users, Mail, MapPin, ArrowUpRight, Menu, X, Layers, TrendingUp, ExternalLink, Microscope, Brain, Cpu, Leaf, TestTube, Activity } from 'lucide-react';

// --- DATA ---

const TEAM_MEMBERS = [
  { id: 1, name: "Dr. James Seo", role: "Managing Partner", bio: "Former VP at Global Pharma. Expert in Oncology.", tags: ["MD", "PhD", "Strategy"] },
  { id: 2, name: "Sarah Kim", role: "Investment Director", bio: "15+ years in Bio-Healthcare VC.", tags: ["M&A", "IPO", "Valuation"] },
  { id: 3, name: "Prof. David Lee", role: "Scientific Advisor", bio: "Professor of Immunology, Seoul Nat'l Univ.", tags: ["R&D", "Immunology"] },
  { id: 4, name: "Michael Park", role: "Global Operation", bio: "Specialist in Cross-border licensing.", tags: ["BD", "Global"] },
];

// NEW DATA: Focus Areas
const FOCUS_AREAS = [
  { 
    id: "F01", 
    title: "Cell Therapy", 
    kor: "세포치료제", 
    desc: "Next-gen CAR-T & NK platforms targeting solid tumors.", 
    code: "CT-204",
    icon: <Activity className="w-8 h-8" />
  },
  { 
    id: "F02", 
    title: "Gene Therapy", 
    kor: "유전자치료제", 
    desc: "AAV vector engineering and in-vivo CRISPR editing.", 
    code: "GT-X9",
    icon: <Dna className="w-8 h-8" />
  },
  { 
    id: "F03", 
    title: "Organoids", 
    kor: "오가노이드", 
    desc: "High-fidelity 3D tissue models for drug screening.", 
    code: "OG-3D",
    icon: <Microscope className="w-8 h-8" />
  },
  { 
    id: "F04", 
    title: "Medical AI", 
    kor: "의료 AI", 
    desc: "Deep learning for pathology & early diagnosis.", 
    code: "AI-NET",
    icon: <Cpu className="w-8 h-8" />
  },
  { 
    id: "F05", 
    title: "Cultured Meat", 
    kor: "배양육", 
    desc: "Sustainable cellular agriculture & alternative proteins.", 
    code: "CM-ALT",
    icon: <TestTube className="w-8 h-8" />
  },
  { 
    id: "F06", 
    title: "Microbiome", 
    kor: "마이크로바이옴", 
    desc: "Therapeutics targeting gut-brain axis & metabolic disorders.", 
    code: "MB-01",
    icon: <Leaf className="w-8 h-8" />
  },
];

const BUSINESS_STEPS = [
  { 
    id: "01", 
    title: "In-Depth Consulting", 
    desc: "Scientific diligence meets market intelligence. We de-risk early-stage assets through rigorous analysis.",
    icon: <Dna className="w-10 h-10" />
  },
  { 
    id: "02", 
    title: "Strategic Acceleration", 
    desc: "Hands-on company building. We bridge the gap between bench and bedside with operational support.",
    icon: <Layers className="w-10 h-10" />
  },
  { 
    id: "03", 
    title: "Global Investment", 
    desc: "Smart capital injection. We fuel growth for promising biotech startups targeting global markets.",
    icon: <TrendingUp className="w-10 h-10" />
  }
];

const PORTFOLIO_ITEMS = [
  { 
    id: 1, 
    name: "OncoMatrix", 
    category: "Therapeutics", 
    year: "2024", 
    image: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=1000",
    description: "Developing next-generation ADC platforms for solid tumors. Their proprietary linker technology significantly reduces off-target toxicity.",
    highlights: ["Series A Lead Investor", "FDA IND Cleared (Phase 1)", "Strategic Partnership with Big Pharma"]
  },
  { 
    id: 2, 
    name: "NeuroGen", 
    category: "Digital Health", 
    year: "2023", 
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000",
    description: "AI-driven diagnostic platform for early detection of neurodegenerative diseases using non-invasive retinal imaging.",
    highlights: ["Seed to Series A Follow-on", "CE Mark Obtained", "Deployed in 50+ Hospitals"]
  },
  { 
    id: 3, 
    name: "BioSentry", 
    category: "Diagnostics", 
    year: "2023", 
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1000",
    description: "Real-time pathogen detection system for critical care environments. Reduces sepsis diagnosis time from days to hours.",
    highlights: ["Series B Participant", "Awarded 'Innovation of the Year'", "Successful Pilot in Mayo Clinic"]
  },
  { 
    id: 4, 
    name: "CellCore", 
    category: "MedTech", 
    year: "2022", 
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1000",
    description: "Automated cell culture manufacturing systems for CGT (Cell & Gene Therapy) mass production.",
    highlights: ["Series A Lead", "5 Patents Registered", "Global Distribution Deal Signed"]
  },
];

const NETWORK_NODES = [
  { city: "Seoul", x: 80, y: 40 },
  { city: "Boston", x: 25, y: 35 },
  { city: "Basel", x: 52, y: 30 },
  { city: "Singapore", x: 75, y: 60 },
  { city: "San Francisco", x: 15, y: 45 },
  { city: "London", x: 48, y: 25 },
];

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
    
    // Dynamic Nodes based on NETWORK_NODES but scaled
    let nodes = NETWORK_NODES.map(n => ({
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
      nodes = NETWORK_NODES.map(n => ({
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
  const links = ["About", "Focus", "Team", "Business", "Network", "Portfolio", "Contact"];

  return (
    <nav className="fixed top-0 w-full z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1920px] mx-auto px-6 h-20 flex justify-between items-center">
        <a href="#" className="text-2xl font-black tracking-tighter z-50 interactive">DWD<span className="text-blue-600">.</span>HC</a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="font-mono text-sm uppercase tracking-wider hover:text-blue-600 transition-colors interactive">
              {link}
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
                  key={link} 
                  href={`#${link.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-bold tracking-tighter hover:text-blue-600 interactive"
                >
                  {link}
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
                  ARCHITECTS <br/>
                  OF BIO <br/>
                  ECOSYSTEM
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-mono text-sm md:text-xl max-w-xl border-l-2 border-blue-600 pl-6 text-slate-600"
              >
                Global Pharma/Bio Consulting & Investment Firm. <br/>
                We build solid foundations for radical innovation.
              </motion.p>
            </div>
            <div className="col-span-1 md:col-span-4 flex items-end justify-end md:justify-start">
               <div className="w-full h-[300px] md:h-full border-2 border-slate-900 bg-slate-900 text-slate-50 p-6 flex flex-col justify-between hover:bg-slate-800 transition-colors duration-500 shadow-2xl">
                  <Dna className="w-12 h-12 text-blue-500 animate-pulse" />
                  <div className="font-mono text-xs space-y-2 opacity-70">
                    <p>STATUS: OPERATIONAL</p>
                    <p>LOC: SEOUL / BOSTON</p>
                    <p>TARGET: SERIES A-B</p>
                    <p className="text-blue-400">/// SYSTEM_READY</p>
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
        <InfiniteMarquee text="STRATEGY • INVESTMENT • ACCELERATION • GLOBAL GROWTH" />

        {/* ABOUT US */}
        <section id="about" className="min-h-screen px-6 py-24 border-b border-slate-200">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <SectionHeader number="01" title="Our Philosophy" />
            <div className="flex flex-col justify-center space-y-12 pt-12 md:pt-0">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-light leading-tight"
              >
                We do not just invest. <br/>
                <span className="font-bold bg-blue-600 text-white px-2 py-1">We architect the future of medicine.</span>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-slate-900 pt-8">
                <div>
                  <h3 className="font-mono font-bold text-blue-600 mb-2 text-xl">MISSION</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    To bridge the gap between scientific discovery and commercial viability through rigorous analysis and strategic capital.
                  </p>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-blue-600 mb-2 text-xl">VISION</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Becoming the most trusted partner for bio-healthcare innovators aiming for global standard excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: FOCUS AREAS */}
        <section id="focus" className="py-24 px-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-[1920px] mx-auto">
             <SectionHeader number="02" title="Core Focus Areas" />
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-slate-900/10">
                {FOCUS_AREAS.map((area, index) => (
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
                           {area.icon}
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
            <SectionHeader number="03" title="The Architects" align="right" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {TEAM_MEMBERS.map((member) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: member.id * 0.1 }}
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
                <span className="font-mono text-sm text-blue-500 mb-2 block tracking-widest">[ 04 ]</span>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">Business<br/>Process</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-slate-800">
              {BUSINESS_STEPS.map((step, index) => (
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
                         {step.icon}
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
        <InfiniteMarquee text="PARTNERSHIP • INNOVATION • SCALABILITY • TRUST" speed={25} direction={-1} />

        {/* NETWORK */}
        <section id="network" className="py-24 px-6 border-b border-slate-200">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <SectionHeader number="05" title="Global Network" />
            <div className="relative h-[400px] md:h-[600px] border-2 border-slate-900 bg-slate-50 overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
               
               {/* New Canvas Network */}
               <NetworkCanvas />

               <div className="absolute bottom-6 left-6 font-mono text-xs text-slate-900 bg-white border border-slate-900 p-4 shadow-lg z-20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold">SYSTEM ACTIVE</span>
                  </div>
                  CONNECTING_NODES: {NETWORK_NODES.length} <br/>
                  DATA_FLOW: ENCRYPTED <br/>
                  LATENCY: 12ms
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
             <SectionHeader number="06" title="Portfolio" />
             
             <div className="mt-12">
               {/* Table Header */}
               <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b-4 border-slate-900 font-mono text-sm uppercase font-bold text-slate-500">
                 <div className="col-span-1">No.</div>
                 <div className="col-span-4">Company</div>
                 <div className="col-span-4">Category</div>
                 <div className="col-span-2 text-right">Year</div>
                 <div className="col-span-1 text-center">Info</div>
               </div>

               {/* Portfolio List */}
               {PORTFOLIO_ITEMS.map((item) => (
                 <div key={item.id} className="border-b border-slate-300">
                   <motion.div 
                     initial={{ backgroundColor: "rgba(255,255,255,0)" }}
                     whileHover={{ backgroundColor: expandedPortfolioId === item.id ? "rgba(255,255,255,0)" : "rgba(37, 99, 235, 0.05)" }}
                     onClick={() => togglePortfolio(item.id)}
                     onMouseEnter={() => setPortfolioHoverImage(item.image)}
                     onMouseLeave={() => setPortfolioHoverImage(null)}
                     className={`grid grid-cols-1 md:grid-cols-12 gap-4 py-8 md:py-10 items-center transition-colors group cursor-pointer interactive ${expandedPortfolioId === item.id ? 'bg-slate-900 text-white' : ''}`}
                   >
                      <div className={`col-span-1 font-mono text-xs md:text-sm pl-2 md:pl-0 ${expandedPortfolioId === item.id ? 'text-blue-400' : 'text-blue-600'}`}>0{item.id}</div>
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
                               <h4 className="font-mono text-blue-500 mb-4 text-sm tracking-widest uppercase">Investment Rationale</h4>
                               <p className="text-lg md:text-xl text-white leading-relaxed font-light">
                                 {item.description}
                               </p>
                               
                               <div className="mt-8">
                                 <button className="flex items-center space-x-2 text-sm font-bold uppercase hover:text-blue-500 transition-colors border-b border-transparent hover:border-blue-500 pb-1">
                                    <span>Visit Website</span>
                                    <ExternalLink size={14} />
                                 </button>
                               </div>
                             </div>
                             
                             <div className="space-y-6">
                               <h4 className="font-mono text-blue-500 mb-4 text-sm tracking-widest uppercase">Key Milestones & Status</h4>
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
               ))}
             </div>
           </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="min-h-[80vh] flex flex-col justify-between py-24 px-6 bg-slate-900 text-slate-50">
           <div className="max-w-[1920px] mx-auto w-full">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                 <span className="font-mono text-blue-500 block mb-4">Let's build together</span>
                 <h2 className="text-6xl md:text-[8rem] font-bold leading-none tracking-tighter mb-12">
                   GET IN <br/> TOUCH
                 </h2>
                 <form className="space-y-6 max-w-md">
                    <div className="border-b border-slate-700 py-2 group focus-within:border-blue-500 transition-colors">
                      <input type="text" placeholder="NAME" className="w-full bg-transparent outline-none text-xl placeholder-slate-600 py-2 interactive" />
                    </div>
                    <div className="border-b border-slate-700 py-2 group focus-within:border-blue-500 transition-colors">
                      <input type="email" placeholder="EMAIL" className="w-full bg-transparent outline-none text-xl placeholder-slate-600 py-2 interactive" />
                    </div>
                    <div className="border-b border-slate-700 py-2 group focus-within:border-blue-500 transition-colors">
                      <textarea placeholder="MESSAGE" rows="3" className="w-full bg-transparent outline-none text-xl placeholder-slate-600 py-2 resize-none interactive"></textarea>
                    </div>
                    <button className="group flex items-center space-x-2 text-xl font-bold uppercase hover:text-blue-500 transition-colors mt-8 interactive">
                      <span>Send Message</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </form>
               </div>
               
               <div className="flex flex-col justify-end lg:items-end space-y-12">
                  <div className="space-y-4 text-right">
                    <h3 className="font-mono text-slate-500">HEADQUARTERS</h3>
                    <p className="text-2xl font-bold">Teheran-ro 152, Gangnam-gu<br/>Seoul, South Korea</p>
                    <div className="flex items-center justify-end space-x-2 text-blue-500">
                      <MapPin size={18} />
                      <a href="#" className="hover:underline interactive">View on Map</a>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-right">
                    <h3 className="font-mono text-slate-500">CONTACT</h3>
                    <a href="mailto:hello@dwdhc.com" className="text-3xl md:text-5xl font-bold hover:text-blue-500 transition-colors underline decoration-2 underline-offset-8 interactive">
                      hello@dwdhc.com
                    </a>
                  </div>
               </div>
             </div>
           </div>
           
           <footer className="mt-24 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-slate-500">
             <p>&copy; 2026 DWD HEALTHCARE. ALL RIGHTS RESERVED.</p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white interactive">LINKEDIN</a>
               <a href="#" className="hover:text-white interactive">TWITTER</a>
               <a href="#" className="hover:text-white interactive">PRIVACY POLICY</a>
             </div>
           </footer>
        </section>

      </main>
    </div>
  );
}