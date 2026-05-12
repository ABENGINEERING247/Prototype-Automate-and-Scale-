/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

export type Language = 'en' | 'ur';

export interface TranslationSet {
  title: string;
  tagline: string;
  prototype: string;
  automate: string;
  scale: string;
  khaata: string;
  aiHub: string;
  trinity: string;
  digitalize: string;
  addTransaction: string;
  credit: string;
  debit: string;
  balance: string;
  description: string;
  amount: string;
  date: string;
  save: string;
  cancel: string;
  welcome: string;
  getStarted: string;
  cart: {
    title: string;
    inventory: string;
    total: string;
    finishSale: string;
    weight: string;
    price: string;
    printBill: string;
    emailReceipt: string;
    emailPlaceholder: string;
  };
  cases: {
    vegetable: { title: string; desc: string; step: string };
    coconut: { title: string; desc: string; step: string };
    meat: { title: string; desc: string; step: string };
  };
}

export const VEGETABLES = [
  { id: 'potato', en: 'Potato', ur: 'آلو', price: 80, icon: '🥔' },
  { id: 'tomato', en: 'Tomato', ur: 'ٹماٹر', price: 120, icon: '🍅' },
  { id: 'onion', en: 'Onion', ur: 'پیاز', price: 150, icon: '🧅' },
  { id: 'carrot', en: 'Carrot', ur: 'گاجر', price: 60, icon: '🥕' },
  { id: 'chilli', en: 'Green Chilli', ur: 'ہری مرچ', price: 200, icon: '🌶️' },
  { id: 'ginger', en: 'Ginger', ur: 'ادرک', price: 400, icon: '🫚' },
];

export const COCONUTS = [
  { id: 'green', en: 'Green Coconut', ur: 'ہرا ناریل', price: 180, icon: '🥥' },
  { id: 'brown', en: 'Brown Coconut', ur: 'بھورا ناریل', price: 120, icon: '🥥' },
  { id: 'water', en: 'Coconut Water', ur: 'ناریل کا پانی', price: 100, icon: '🥤' },
  { id: 'malai', en: 'Malai Piece', ur: 'ملائی', price: 50, icon: '🥣' },
];

export const MEATS = [
  { id: 'mutton', en: 'Mutton', ur: 'مٹن', price: 2200, icon: '🍖' },
  { id: 'beef', en: 'Beef', ur: 'بیف', price: 1100, icon: '🥩' },
  { id: 'chicken', en: 'Chicken', ur: 'چکن', price: 600, icon: '🍗' },
  { id: 'mince', en: 'Mince (Qeema)', ur: 'قیمہ', price: 1200, icon: '🥓' },
];

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    title: "Prototype, Automate and Scale",
    tagline: "Revolutionize your business operations with AI capabilities",
    prototype: "Prototype by Google AI Studio",
    automate: "Automate by GitHub",
    scale: "Scale by Vercel",
    khaata: "Digital Khaata System",
    aiHub: "AI Resource Hub",
    trinity: "Prototype & Scale",
    digitalize: "Digitalization Examples",
    addTransaction: "Add Transaction",
    credit: "Credit (In)",
    debit: "Debit (Out)",
    balance: "Current Balance",
    description: "Description",
    amount: "Amount",
    date: "Date",
    save: "Save",
    cancel: "Cancel",
    welcome: "Welcome to the Future of Business",
    getStarted: "Get Started",
    cart: {
      title: "Mobile Vegetable Cart",
      inventory: "Inventory",
      total: "Total Sale",
      finishSale: "Record Sale",
      weight: "Weight (kg)",
      price: "Price/kg",
      printBill: "Export PDF Receipt",
      emailReceipt: "Email Receipt",
      emailPlaceholder: "Enter customer email"
    },
    cases: {
      vegetable: { title: "Vegetable Cart", desc: "No more paper diaries. Record every 'SABZI' sale on the go.", step: "Inventory Auto-Update" },
      coconut: { title: "Coconut Stall", desc: "Scan and Pay. Track daily coconut stock and earnings.", step: "QR Payment Integrated" },
      meat: { title: "Meat Shop", desc: "Manage bulk orders for events and daily retail perfectly.", step: "Order Management" }
    }
  },
  ur: {
    title: "پروٹوٹائپ، آٹومیٹ اور اسکیل",
    tagline: "مصنوعی ذہانت کی صلاحیتوں کے ساتھ اپنے کاروباری معاملات میں انقلاب لائیں",
    prototype: "گوگل اے آئی اسٹوڈیو کے ذریعے پروٹوٹائپ",
    automate: "گٹ ہب کے ذریعے آٹومیشن",
    scale: "ورسل کے ذریعے اسکیل",
    khaata: "ڈیجیٹل کھاتہ سسٹم",
    aiHub: "اے آئی ریسورس ہب",
    trinity: "پروٹوٹائپ اور اسکیل",
    digitalize: "ڈیجیٹلائزیشن کی مثالیں",
    addTransaction: "لین دین شامل کریں",
    credit: "کریڈٹ (آمدنی)",
    debit: "ڈیبٹ (اخراجات)",
    balance: "موجودہ بیلنس",
    description: "تفصیل",
    amount: "رقم",
    date: "تاریخ",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    welcome: "کاروبار کے مستقبل میں خوش آمدید",
    getStarted: "شروع کریں",
    cart: {
      title: "سبزی کا ٹھیلا",
      inventory: "اسٹاک",
      total: "کل فروخت",
      finishSale: "فروخت درج کریں",
      weight: "وزن (کلو)",
      price: "قیمت فی کلو",
      printBill: "ڈیجیٹل رسید حاصل کریں",
      emailReceipt: "ای میل رسید",
      emailPlaceholder: "کسٹمر کا ای میل لکھیں"
    },
    cases: {
      vegetable: { title: "سبزی کا ٹھیلا", desc: "اب کاغذی ڈائری کی ضرورت نہیں۔ ہر سبزی کی فروخت کا فوری اندراج کریں۔", step: "اسٹاک کی خودکار اپ ڈیٹ" },
      coconut: { title: "ناریل کا اسٹال", desc: "اسکین کریں اور ادائیگی کریں۔ یومیہ ناریل کے اسٹاک اور آمدنی پر نظر رکھیں۔", step: "کیو آر پیمنٹ انٹیگریٹڈ" },
      meat: { title: "گوشت کی دکان", desc: "تقریبات کے بڑے آرڈرز اور روزانہ کی خوردہ فروخت کو بہترین طریقے سے سنبھالیں۔", step: "ارڈر مینجمنٹ" }
    }
  }
};

export const AI_TOOLS = [
  {
    name: "Gemini AI",
    link: "https://gemini.google.com",
    creator: "Google",
    color: "bg-blue-500",
    description: "Multi-modal reasoning by Google DeepMind."
  },
  {
    name: "ChatGPT",
    link: "https://chat.openai.com",
    creator: "OpenAI",
    color: "bg-emerald-600",
    description: "The world's most popular conversational AI."
  },
  {
    name: "Claude",
    link: "https://claude.ai",
    creator: "Anthropic",
    color: "bg-orange-600",
    description: "Reliable, interpretable, and steerable AI."
  },
  {
    name: "Grok AI",
    link: "https://x.ai",
    creator: "xAI",
    color: "bg-neutral-900",
    description: "Real-time knowledge and witty responses."
  },
  {
    name: "Jenny AI",
    link: "https://meetjenny.ai",
    creator: "Jenny",
    color: "bg-pink-500",
    description: "Personalized AI assistant for business efficiency."
  }
];
