import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Shield, Globe, Cpu, Github, ExternalLink, Sparkles, ShoppingCart, Beef, Carrot, CheckCircle2 } from 'lucide-react';
import { Language, TRANSLATIONS, AI_TOOLS } from '../constants';

interface BaseProps {
  lang: Language;
}

export const SplashScreen: React.FC<BaseProps & { onComplete: () => void }> = ({ lang, onComplete }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center text-white p-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center space-y-8"
      >
        <div className="flex justify-center mb-12">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-t-blue-500 border-r-transparent border-b-orange-500 border-l-transparent rounded-full flex items-center justify-center p-4 backdrop-blur-xl"
          >
           <Cpu size={48} className="text-white" />
          </motion.div>
        </div>

        <div className={`space-y-4 max-w-2xl ${lang === 'ur' ? 'urdu-text' : ''}`}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t.welcome}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-medium">
            {t.tagline}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-12 px-10 py-4 bg-white text-black font-bold rounded-full text-lg shadow-2xl flex items-center gap-3 mx-auto"
        >
          {t.getStarted}
          <Rocket size={20} />
        </motion.button>
      </motion.div>
      
      <div className="absolute bottom-12 text-neutral-600 text-sm font-medium tracking-widest uppercase flex gap-8">
        <span>Prototype</span>
        <span>•</span>
        <span>Automate</span>
        <span>•</span>
        <span>Scale</span>
      </div>
    </div>
  );
};

export const TrinityScale: React.FC<BaseProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const items = [
    { 
      title: t.prototype, 
      icon: <Sparkles />, 
      color: "text-blue-500", 
      bg: "bg-blue-50", 
      brand: "AI Studio", 
      link: "https://aistudio.google.com/",
      desc: "Rapid ideation and AI integration using Gemini models." 
    },
    { 
      title: t.automate, 
      icon: <Github />, 
      color: "text-neutral-900", 
      bg: "bg-neutral-100", 
      brand: "GitHub", 
      link: "https://github.com/",
      desc: "Seamless CI/CD pipelines and version control for efficiency." 
    },
    { 
      title: t.scale, 
      icon: <Globe />, 
      color: "text-black", 
      bg: "bg-neutral-200", 
      brand: "Vercel", 
      link: "https://vercel.com/",
      desc: "Global edge deployment for lightning-fast performance." 
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 py-12 ${lang === 'ur' ? 'urdu-text' : ''}`}>
      {items.map((item, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm transition-all hover:shadow-xl hover:border-neutral-300 flex flex-col h-full"
        >
          <div className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
            {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
          </div>
          <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
          <p className="text-neutral-500 leading-relaxed font-medium mb-6 flex-1">{item.desc}</p>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline group"
          >
            {lang === 'ur' ? 'مزید جانیں' : 'Official Site'}
            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      ))}
    </div>
  );
};

export const AIPowerHub: React.FC<BaseProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <section className={`py-12 space-y-8 animate-in fade-in duration-700 ${lang === 'ur' ? 'urdu-text' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h2 className="text-4xl font-black mb-2">{t.aiHub}</h2>
          <p className="text-neutral-500 font-medium">Access world-class AI tools in one click.</p>
        </div>
        <div className="flex gap-2">
           <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Global Access</span>
           <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Official</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_TOOLS.map((tool) => (
          <a 
            key={tool.name}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white p-8 rounded-3xl border-2 border-neutral-100 hover:border-blue-500 hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${tool.color} opacity-5 -mr-8 -mt-8 rounded-full`} />
            <div className="flex justify-between items-start mb-6">
              <div className={`${tool.color} text-white px-4 py-1 rounded-xl text-xs font-bold shadow-lg shadow-black/10`}>
                {tool.creator}
              </div>
              <div className="bg-neutral-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                <ExternalLink size={20} className="text-neutral-300 group-hover:text-blue-500" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{tool.name}</h3>
            <p className="text-neutral-500 font-medium text-sm leading-relaxed">{tool.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export const CaseStudies: React.FC<BaseProps & { onLaunch: (id: string) => void }> = ({ lang, onLaunch }) => {
  const t = TRANSLATIONS[lang];
  const cases = [
    { 
      id: 'veg',
      title: t.cases.vegetable.title,
      desc: t.cases.vegetable.desc,
      step: t.cases.vegetable.step,
      icon: <Carrot size={40} />,
      color: "from-green-500 to-emerald-600",
      accent: "text-green-600",
      bg: "bg-green-50",
      isLive: true
    },
    { 
      id: 'coco',
      title: t.cases.coconut.title,
      desc: t.cases.coconut.desc,
      step: t.cases.coconut.step,
      icon: <ShoppingCart size={40} />,
      color: "from-amber-700 to-orange-800",
      accent: "text-amber-800",
      bg: "bg-amber-50",
      isLive: true
    },
    { 
      id: 'meat',
      title: t.cases.meat.title,
      desc: t.cases.meat.desc,
      step: t.cases.meat.step,
      icon: <Beef size={40} />,
      color: "from-red-600 to-rose-700",
      accent: "text-red-700",
      bg: "bg-red-50",
      isLive: true
    }
  ];

  return (
    <div className={`space-y-8 ${lang === 'ur' ? 'urdu-text' : ''}`}>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-4xl font-black tracking-tight">{t.digitalize}</h2>
        <div className="h-1 flex-1 bg-neutral-100 rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cases.map((c) => (
          <div key={c.id} className="group relative">
            <div className={`absolute -inset-1 bg-gradient-to-r ${c.color} rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />
            <div className="relative bg-white rounded-3xl p-8 border border-neutral-100 h-full flex flex-col">
              <div className="flex justify-between items-start mb-8">
                 <div className={`${c.bg} ${c.accent} w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10 bg-current" />
                    {c.icon}
                  </div>
                  {c.isLive && (
                    <button 
                      onClick={() => onLaunch(c.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                      {lang === 'ur' ? 'ٹیسٹ کریں' : 'Live Demo'}
                    </button>
                  )}
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{c.title}</h3>
              <p className="text-neutral-500 font-medium leading-relaxed mb-8 flex-1">{c.desc}</p>
              
              <div className={`mt-auto flex items-center gap-3 p-4 rounded-2xl ${c.bg} border-2 border-dashed border-current/20`}>
                <CheckCircle2 size={24} className={c.accent} />
                <span className={`font-black text-sm uppercase tracking-wider ${c.accent}`}>
                  {c.step}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
