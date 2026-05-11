/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, TRANSLATIONS } from './constants';
import { SplashScreen, TrinityScale, AIPowerHub, CaseStudies } from './components/Dashboard';
import { KhaataSystem } from './components/KhaataSystem';
import { SmartCart } from './components/SmartCart';
import { VEGETABLES, COCONUTS, MEATS } from './constants';
import { Languages, Github, Twitter, Cpu, Layout, Boxes, Terminal, Sparkles } from 'lucide-react';

export default function App() {
  const [lang, setLang] = React.useState<Language>('en');
  const [splashVisible, setSplashVisible] = React.useState(true);
  const [activeView, setActiveView] = React.useState<'trinity' | 'khaata' | 'aihub'>('trinity');
  const [activeCaseStudy, setActiveCaseStudy] = React.useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen bg-neutral-50 text-neutral-900 overflow-x-hidden ${lang === 'ur' ? 'urdu-text' : ''}`}>
      <AnimatePresence>
        {splashVisible && (
          <SplashScreen 
            lang={lang} 
            onComplete={() => setSplashVisible(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCaseStudy && (
          <SmartCart 
            key={activeCaseStudy}
            lang={lang} 
            shopType={
              activeCaseStudy === 'veg' ? 'vegetable' : 
              activeCaseStudy === 'coco' ? 'coconut' : 'meat'
            }
            shopTitle={
              activeCaseStudy === 'veg' ? t.cases.vegetable.title : 
              activeCaseStudy === 'coco' ? t.cases.coconut.title : t.cases.meat.title
            }
            products={
              activeCaseStudy === 'veg' ? VEGETABLES : 
              activeCaseStudy === 'coco' ? COCONUTS : MEATS
            }
            onClose={() => setActiveCaseStudy(null)} 
          />
        )}
      </AnimatePresence>

      {!splashVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col min-h-screen"
        >
          {/* Header */}
          <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-black text-white p-2 rounded-lg">
                  <Layout size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight hidden sm:block">
                  {t.title}
                </h1>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex bg-neutral-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setActiveView('trinity')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'trinity' ? 'bg-white shadow-sm text-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Sparkles size={14} />
                    {t.trinity}
                  </button>
                  <button 
                    onClick={() => setActiveView('khaata')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'khaata' ? 'bg-white shadow-sm text-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Boxes size={14} />
                    {t.khaata}
                  </button>
                  <button 
                    onClick={() => setActiveView('aihub')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeView === 'aihub' ? 'bg-white shadow-sm text-blue-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Terminal size={14} />
                    {t.aiHub}
                  </button>
                </div>
                
                <button 
                  onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
                  className="flex items-center gap-2 bg-neutral-900 text-white hover:bg-black px-4 py-2 rounded-full transition-colors font-bold text-xs shadow-lg shadow-neutral-200"
                >
                  <Languages size={16} />
                  {lang === 'en' ? 'اردو' : 'English'}
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
            <AnimatePresence mode="wait">
              {activeView === 'trinity' && (
                <motion.div 
                  key="trinity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <section className="space-y-4">
                    <div className="max-w-2xl">
                      <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                        {t.tagline}
                      </h2>
                      <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-8"></div>
                    </div>
                    <TrinityScale lang={lang} />
                  </section>
                </motion.div>
              )}

              {activeView === 'khaata' && (
                <motion.div 
                  key="khaata"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-24"
                >
                  <CaseStudies lang={lang} onLaunch={(id) => setActiveCaseStudy(id)} />
                  <section className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-4xl font-black">{t.khaata}</h2>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Enterprise Edition</span>
                    </div>
                    <KhaataSystem lang={lang} />
                  </section>
                </motion.div>
              )}

              {activeView === 'aihub' && (
                <motion.div 
                  key="aihub"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <AIPowerHub lang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-neutral-200 py-16">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white p-2 rounded-lg">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">{t.title}</h3>
                </div>
                <p className="text-neutral-500 font-medium max-w-md">
                   An advanced ecosystem designed for the modern entrepreneur. Prototype by Google AI Studio, Automate by GitHub, and Scale by Vercel. Join the revolution.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"><Github size={20} /></a>
                  <a href="#" className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"><Twitter size={20} /></a>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold uppercase text-xs tracking-widest text-neutral-400">Power by</h4>
                <ul className="space-y-3 font-semibold text-neutral-600">
                  <li><a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Google AI Studio</a></li>
                  <li><a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">GitHub</a></li>
                  <li><a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Vercel</a></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold uppercase text-xs tracking-widest text-neutral-400">Links</h4>
                <ul className="space-y-3 font-semibold text-neutral-600">
                  <li><a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Gemini AI</a></li>
                  <li className="hover:text-blue-600 cursor-pointer">Digital Khaata</li>
                  <li className="hover:text-blue-600 cursor-pointer">Resources</li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-400 font-medium">
              &copy; 2026 {t.title}. All rights reserved globally.
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
