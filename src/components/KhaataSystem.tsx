import React from 'react';
import { motion } from 'motion/react';
import { Transaction, Language, TRANSLATIONS } from '../constants';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useKhaata } from '../lib/khataStore';

interface Props {
  lang: Language;
}

export const KhaataSystem: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const { getTransactions, saveTransaction, deleteTransaction, calculateBalance } = useKhaata();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: '',
    amount: '',
    type: 'credit' as 'credit' | 'debit'
  });

  const refresh = () => setTransactions(getTransactions());
  
  React.useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    saveTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date().toISOString().split('T')[0],
      category: 'General'
    });
    
    setFormData({ description: '', amount: '', type: 'credit' });
    setShowForm(false);
    refresh();
  };

  const balance = calculateBalance();

  return (
    <div className={`space-y-6 ${lang === 'ur' ? 'urdu-text' : ''}`}>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">{t.balance}</p>
            <h2 className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Rs. {Math.abs(balance).toLocaleString()}
            </h2>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span className="font-semibold">{t.addTransaction}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((transaction) => (
          <motion.div 
            layout
            key={transaction.id}
            className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`p-1.5 rounded-lg ${transaction.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {transaction.type === 'credit' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </span>
              <button 
                onClick={() => { deleteTransaction(transaction.id); refresh(); }}
                className="text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="font-bold text-neutral-800 text-lg">{transaction.description}</h4>
            <div className="flex justify-between items-end mt-4">
               <span className="text-neutral-400 text-sm">{transaction.date}</span>
               <span className={`text-xl font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                 {transaction.type === 'credit' ? '+' : '-'} {transaction.amount.toLocaleString()}
               </span>
            </div>
          </motion.div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6"
          >
            <h3 className="text-2xl font-bold text-center">{t.addTransaction}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600">{t.description}</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={lang === 'ur' ? 'تفصیل لکھیں' : 'Enter description'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600">{t.amount}</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={lang === 'ur' ? 'رقم درج کریں' : 'Enter amount'}
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'credit'})}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${formData.type === 'credit' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 'border-neutral-200 text-neutral-600'}`}
                >
                  {t.credit}
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'debit'})}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${formData.type === 'debit' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200' : 'border-neutral-200 text-neutral-600'}`}
                >
                  {t.debit}
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-bold hover:bg-neutral-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
