import { Transaction } from '../constants';

export const useKhaata = () => {
  const getTransactions = (): Transaction[] => {
    const data = localStorage.getItem('khaata_transactions');
    return data ? JSON.parse(data) : [];
  };

  const saveTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const transactions = getTransactions();
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    localStorage.setItem('khaata_transactions', JSON.stringify([...transactions, newTransaction]));
  };

  const deleteTransaction = (id: string) => {
    const transactions = getTransactions();
    localStorage.setItem('khaata_transactions', JSON.stringify(transactions.filter(t => t.id !== id)));
  };

  const calculateBalance = () => {
    const transactions = getTransactions();
    return transactions.reduce((acc, t) => {
      return t.type === 'credit' ? acc + t.amount : acc - t.amount;
    }, 0);
  };

  return { getTransactions, saveTransaction, deleteTransaction, calculateBalance };
};
