import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, TRANSLATIONS } from '../constants';
import { ShoppingBasket, CheckCircle2, Scale, X, Trash2, FileText, Printer } from 'lucide-react';
import { useKhaata } from '../lib/khataStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Product {
  id: string;
  en: string;
  ur: string;
  price: number;
  icon: string;
}

interface Props {
  lang: Language;
  onClose: () => void;
  products: Product[];
  shopTitle: string;
  shopType: 'vegetable' | 'coconut' | 'meat';
}

interface CartItem {
  prodId: string;
  weight: number;
  total: number;
}

export const SmartCart: React.FC<Props> = ({ lang, onClose, products, shopTitle, shopType }) => {
  const t = TRANSLATIONS[lang];
  const { saveTransaction } = useKhaata();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [selectedProd, setSelectedProd] = React.useState<string | null>(null);
  const [weight, setWeight] = React.useState<string>('1');
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const billRef = React.useRef<HTMLDivElement>(null);

  const theme = {
    vegetable: { primary: 'bg-green-600', secondary: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', shadow: 'shadow-green-200' },
    coconut: { primary: 'bg-amber-600', secondary: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-100', shadow: 'shadow-amber-200' },
    meat: { primary: 'bg-red-600', secondary: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', shadow: 'shadow-red-200' }
  }[shopType];

  const addToCart = () => {
    if (!selectedProd) return;
    const prod = products.find(v => v.id === selectedProd);
    if (!prod) return;

    const newItem: CartItem = {
      prodId: selectedProd,
      weight: parseFloat(weight),
      total: prod.price * parseFloat(weight)
    };

    setCart([...cart, newItem]);
    setSelectedProd(null);
    setWeight('1');
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const grandTotal = cart.reduce((acc, item) => acc + item.total, 0);

  const handleFinish = () => {
    if (cart.length === 0) return;
    
    saveTransaction({
      description: `${shopTitle} Sale: ${cart.length} items`,
      amount: grandTotal,
      type: 'credit',
      date: new Date().toISOString().split('T')[0],
      category: 'Sales'
    });
    
    onClose();
  };

  const exportPDF = async () => {
    if (!billRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(billRef.current, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200]
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${shopType}-receipt-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl ${lang === 'ur' ? 'urdu-text' : ''}`}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-neutral-50 w-full max-w-6xl h-[92vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-30 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all">
          <X size={24} className="text-neutral-500" />
        </button>

        {/* Inventory Section */}
        <div className="flex-1 p-10 overflow-y-auto no-scrollbar border-b lg:border-b-0 lg:border-r border-neutral-200">
          <div className="mb-10">
              <h2 className="text-4xl font-black text-neutral-900 mb-2">{shopTitle}</h2>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full animate-pulse ${theme.primary}`} />
                <p className="text-neutral-500 font-bold uppercase tracking-wider text-xs">Operational • Business Suite</p>
              </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
            {products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setSelectedProd(prod.id)}
                className={`group p-8 rounded-[40px] border-4 transition-all flex flex-col items-center gap-4 ${selectedProd === prod.id ? `${theme.primary} border-transparent text-white shadow-2xl ${theme.shadow} scale-95` : 'bg-white border-white hover:border-blue-50 hover:shadow-xl hover:-translate-y-1'}`}
              >
                <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">
                  {prod.icon}
                </span>
                <div className="text-center">
                  <p className="font-black text-xl">{lang === 'ur' ? prod.ur : prod.en}</p>
                  <p className={`text-sm font-bold opacity-70`}>Rs {prod.price.toLocaleString()}/{shopType === 'coconut' && prod.id !== 'malai' ? 'pc' : 'kg'}</p>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedProd && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 lg:sticky lg:bottom-0 lg:left-0 lg:translate-x-0 w-full max-w-xl p-8 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-2xl space-y-8 z-40"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-2xl font-black flex items-center gap-3 ${theme.text}`}>
                    <Scale size={28} />
                    {t.cart.weight}
                  </h3>
                  <div className="flex items-center bg-neutral-100 rounded-2xl p-2 shadow-inner">
                    <button onClick={() => setWeight(Math.max(0.25, parseFloat(weight) - 0.25).toString())} className="w-14 h-14 flex items-center justify-center font-black text-3xl hover:text-blue-600 transition-colors">-</button>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={e => setWeight(e.target.value)}
                      className="w-24 text-center bg-transparent font-black text-2xl outline-none"
                    />
                    <button onClick={() => setWeight((parseFloat(weight) + 0.25).toString())} className="w-14 h-14 flex items-center justify-center font-black text-3xl hover:text-blue-600 transition-colors">+</button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setSelectedProd(null)} className="flex-1 py-5 bg-neutral-100 text-neutral-600 rounded-3xl font-black transition-all hover:bg-neutral-200">
                    {t.cancel}
                  </button>
                  <button onClick={addToCart} className={`flex-[2] py-5 ${theme.primary} text-white rounded-3xl font-black text-xl shadow-2xl ${theme.shadow} hover:opacity-90 transition-all`}>
                    ADD TO CART
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Receipt Section */}
        <div className="w-full lg:w-[460px] bg-white p-10 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.03)] border-l border-neutral-100">
          <div className="flex items-center gap-4 mb-10">
            <div className={`p-4 ${theme.secondary} ${theme.text} rounded-2xl`}>
               <ShoppingBasket size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-neutral-900">{t.cart.total}</h2>
              <p className="text-neutral-400 font-bold text-xs uppercase tracking-tighter">Digital Transaction Hub</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar mb-8">
            <AnimatePresence initial={false}>
              {cart.map((item, i) => {
                const prod = products.find(v => v.id === item.prodId)!;
                return (
                  <motion.div 
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={i} 
                    className={`flex items-center justify-between p-5 ${theme.secondary} rounded-3xl border-2 border-transparent hover:border-black/5 transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{prod.icon}</span>
                      <div>
                        <p className="font-black text-lg text-neutral-900">{lang === 'ur' ? prod.ur : prod.en}</p>
                        <p className="text-xs font-black opacity-40">{item.weight} units × Rs {prod.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-black text-xl ${theme.text}`}>Rs {item.total.toLocaleString()}</span>
                      <button onClick={() => removeFromCart(i)} className="text-neutral-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-8 border-t-4 border-double border-neutral-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-400 font-black uppercase text-sm">Grand Total</span>
              <span className="text-4xl font-black text-neutral-900">Rs {grandTotal.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={exportPDF}
              disabled={cart.length === 0 || isGeneratingPDF}
              className="w-full py-5 bg-neutral-950 text-white rounded-3xl font-black flex items-center justify-center gap-4 transition-all hover:bg-black group shadow-xl"
            >
              <Printer size={24} className="group-hover:rotate-12 transition-transform" />
              {isGeneratingPDF ? 'PREPARING...' : t.cart.printBill}
            </button>
            <button 
              onClick={handleFinish}
              disabled={cart.length === 0}
              className={`w-full py-6 rounded-[32px] font-black text-2xl flex items-center justify-center gap-4 transition-all ${cart.length === 0 ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : `${theme.primary} text-white shadow-2xl ${theme.shadow} hover:scale-[1.02] active:scale-95`}`}
            >
              {t.cart.finishSale}
              <CheckCircle2 size={32} />
            </button>
          </div>
        </div>

        {/* Off-screen Invoice Template for PDF capture */}
        <div style={{ position: 'absolute', left: '-9999px', top: '0', pointerEvents: 'none' }}>
           <div ref={billRef} style={{ backgroundColor: '#ffffff', color: '#000000', padding: '32px', fontFamily: 'monospace', width: '350px', border: '1px solid #eeeeee' }}>
              <div style={{ textAlign: 'center', borderBottom: '4px double #000000', paddingBottom: '32px', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '-1px' }}>{shopTitle}</h1>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>DIGITAL BUSINESS SUITE</p>
                <div style={{ marginTop: '16px', fontSize: '10px', color: '#666666' }}>
                  <p style={{ margin: '0' }}>Receipt ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                  <p style={{ margin: '0' }}>{new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '40px', minHeight: '200px' }}>
                {cart.map((item, i) => {
                  const prod = products.find(v => v.id === item.prodId)!;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '8px', borderBottom: '1px dashed #cccccc', marginBottom: '8px' }}>
                       <div>
                         <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', margin: '0' }}>{prod.en}</p>
                         <p style={{ fontSize: '10px', color: '#888888', margin: '0' }}>{item.weight} @ {prod.price}</p>
                       </div>
                       <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0' }}>Rs {item.total}</p>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '4px solid #000000', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                  <span>TOTAL</span>
                  <span>Rs {grandTotal}</span>
                </div>
                <p style={{ fontSize: '10px', textAlign: 'center', paddingTop: '40px', textTransform: 'uppercase', fontWeight: 'bold', color: '#999999', letterSpacing: '2px' }}>
                  Thank You for your purchase
                </p>
                <div style={{ marginTop: '24px', paddingTop: '24px', textAlign: 'center', fontSize: '8px', fontWeight: 'bold', borderTop: '1px solid #eeeeee', color: '#cccccc' }}>
                   PROTOTYPE | AUTOMATE | SCALE<br />
                   AI STUDIO • GITHUB • VERCEL
                </div>
              </div>
           </div>
        </div>

      </motion.div>
    </div>
  );
};
