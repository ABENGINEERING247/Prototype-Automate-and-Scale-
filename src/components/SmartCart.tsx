import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, TRANSLATIONS } from '../constants';
import { ShoppingBasket, CheckCircle2, Scale, X, Trash2, FileText, Printer, Mail, Loader2 } from 'lucide-react';
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
  const [email, setEmail] = React.useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const billRef = React.useRef<HTMLDivElement>(null);

  const theme = {
    vegetable: { primary: 'bg-green-600', secondary: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', shadow: 'shadow-green-200', ghost: 'bg-green-500/10' },
    coconut: { primary: 'bg-amber-600', secondary: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-100', shadow: 'shadow-amber-200', ghost: 'bg-amber-500/10' },
    meat: { primary: 'bg-red-600', secondary: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', shadow: 'shadow-red-200', ghost: 'bg-red-500/10' }
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

  const handleFinish = async () => {
    if (cart.length === 0) return;
    
    if (email) {
      setIsSendingEmail(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSendingEmail(false);
    }

    saveTransaction({
      description: `${shopTitle} Sale: ${cart.length} items${email ? ` (Receipt sent to ${email})` : ''}`,
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] bg-white flex flex-col ${lang === 'ur' ? 'urdu-text' : ''}`}
    >
      {/* Top Navigation Bar */}
      <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-3 hover:bg-neutral-100 rounded-2xl transition-colors"
          >
            <X size={24} className="text-neutral-900" />
          </button>
          <div className="h-8 w-px bg-neutral-100" />
          <div>
            <h1 className="text-2xl font-black text-neutral-900 leading-none">{shopTitle}</h1>
            <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1.5">Business Mode • v2.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-neutral-400 font-bold text-[10px] uppercase">Cashier Active</span>
            <span className="text-neutral-900 font-black text-sm">Operator #1049</span>
          </div>
          <div className={`w-12 h-12 ${theme.primary} rounded-2xl flex items-center justify-center text-white`}>
            <ShoppingBasket size={24} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Selection Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-neutral-50/50 no-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-neutral-900">{t.cart.inventory}</h2>
              <div className="flex gap-2">
                {['All', 'Favorites', 'Recent'].map(filter => (
                  <button key={filter} className={`px-5 py-2.5 rounded-xl text-sm font-black border transition-all ${filter === 'All' ? 'bg-black text-white border-black shadow-lg shadow-black/20' : 'bg-white text-neutral-500 border-neutral-200 hover:border-black'}`}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProd(prod.id)}
                  className={`group relative p-10 rounded-[48px] border-4 transition-all flex flex-col items-center justify-center gap-6 ${selectedProd === prod.id ? `${theme.primary} border-transparent text-white shadow-2xl ${theme.shadow} scale-[0.98]` : 'bg-white border-white hover:border-black/5 hover:shadow-2xl hover:-translate-y-2'}`}
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-7xl transition-transform duration-500 group-hover:scale-110 ${selectedProd === prod.id ? 'bg-white/20' : 'bg-neutral-50'}`}>
                    {prod.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-black text-2xl mb-1">{lang === 'ur' ? prod.ur : prod.en}</p>
                    <p className={`text-sm font-black transition-colors ${selectedProd === prod.id ? 'text-white/70' : 'text-neutral-400'}`}>
                      Rs {prod.price.toLocaleString()} <span className="opacity-50">/ {shopType === 'coconut' && prod.id !== 'malai' ? 'pc' : 'kg'}</span>
                    </p>
                  </div>
                  {selectedProd === prod.id && (
                    <div className="absolute top-6 right-6">
                      <div className="bg-white text-black p-2 rounded-full shadow-lg">
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel / Checkout */}
        <div className="w-[480px] border-l border-neutral-100 bg-white flex flex-col shadow-[-40px_0_60px_rgba(0,0,0,0.02)]">
          <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xl font-black">{t.cart.total}</h2>
            <div className="bg-neutral-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-neutral-500">
              Items: {cart.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                <ShoppingBasket size={64} className="mb-4" />
                <p className="font-black text-lg">Your cart is empty</p>
                <p className="text-sm">Select items from the inventory to start billing</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {cart.map((item, i) => {
                  const prod = products.find(v => v.id === item.prodId)!;
                  return (
                    <motion.div 
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={i} 
                      className={`flex items-center justify-between p-6 ${theme.secondary} rounded-[32px] border-2 border-transparent hover:border-black/5 transition-all group`}
                    >
                      <div className="flex items-center gap-5">
                        <span className="text-4xl">{prod.icon}</span>
                        <div>
                          <p className="font-black text-lg text-neutral-900 leading-none mb-1">{lang === 'ur' ? prod.ur : prod.en}</p>
                          <p className="text-[10px] font-black opacity-30 tracking-wider">Qty: {item.weight} units</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className={`font-black text-xl ${theme.text}`}>Rs {item.total.toLocaleString()}</span>
                        <button onClick={() => removeFromCart(i)} className="p-2 bg-white rounded-xl shadow-sm text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="p-8 space-y-6 bg-neutral-50/50 border-t border-neutral-100">
            {selectedProd ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-black ${theme.text}`}>Set Quantity</h3>
                  <div className="flex items-center bg-white rounded-2xl p-2 shadow-sm border border-neutral-100">
                    <button onClick={() => setWeight(Math.max(0.25, parseFloat(weight) - 0.25).toString())} className="w-12 h-12 flex items-center justify-center font-black text-2xl hover:text-blue-600">-</button>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={e => setWeight(e.target.value)}
                      className="w-20 text-center bg-transparent font-black text-xl outline-none"
                    />
                    <button onClick={() => setWeight((parseFloat(weight) + 0.25).toString())} className="w-12 h-12 flex items-center justify-center font-black text-2xl hover:text-blue-600">+</button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setSelectedProd(null)} className="flex-1 py-4 bg-white border border-neutral-200 rounded-2xl font-black hover:bg-neutral-50 transition-all">
                    {t.cancel}
                  </button>
                  <button onClick={addToCart} className={`flex-[2] py-4 ${theme.primary} text-white rounded-2xl font-black text-xl shadow-xl ${theme.shadow} hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest`}>
                    Add to Bill
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[32px] border border-neutral-200 space-y-4">
                  <div className="flex items-center gap-3 text-neutral-400 font-bold text-[10px] uppercase tracking-widest">
                    <Mail size={14} className="text-neutral-900" />
                    Customer Receipt
                  </div>
                  <input 
                    type="email"
                    placeholder={t.cart.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-base font-bold outline-none ring-2 ring-transparent focus:ring-black/5 transition-all"
                  />
                </div>

                <div className="flex justify-between items-center px-2">
                  <span className="text-neutral-400 font-black uppercase text-xs tracking-widest">Subtotal</span>
                  <span className="text-4xl font-black text-neutral-900">Rs {grandTotal.toLocaleString()}</span>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={exportPDF}
                    disabled={cart.length === 0 || isGeneratingPDF || isSendingEmail}
                    className="flex-1 h-20 bg-neutral-900 text-white rounded-[28px] font-black flex flex-col items-center justify-center gap-1 transition-all hover:bg-black group disabled:opacity-50"
                  >
                    <Printer size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-[10px] uppercase tracking-tighter">{t.cart.download}</span>
                  </button>
                  <button 
                    onClick={handleFinish}
                    disabled={cart.length === 0 || isSendingEmail}
                    className={`flex-[3] h-20 rounded-[28px] font-black text-xl flex items-center justify-center gap-4 transition-all ${cart.length === 0 || isSendingEmail ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : `${theme.primary} text-white shadow-2xl ${theme.shadow} hover:scale-[1.02] active:scale-95`}`}
                  >
                    {isSendingEmail ? (
                      <Loader2 size={32} className="animate-spin" />
                    ) : (
                      <>
                        {t.cart.finishSale}
                        <CheckCircle2 size={32} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Invoice Template for PDF capture */}
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
  );
};
