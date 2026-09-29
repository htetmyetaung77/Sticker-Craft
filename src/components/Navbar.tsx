import React from 'react';
import { Sparkles, Image as ImageIcon, Film, Rocket, Languages, Send, Gift } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  activeTab: 'stickers' | 'gif' | 'bot-chat' | 'booster' | 'invite';
  setActiveTab: (tab: 'stickers' | 'gif' | 'bot-chat' | 'booster' | 'invite') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  freeTrialsLeft: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  freeTrialsLeft,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single clean text brand wordmark */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('stickers')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-white block leading-none">
              StickerCraft
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              & Booster Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clear active states) */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'stickers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>{t.navSticker}</span>
          </button>

          <button
            onClick={() => setActiveTab('gif')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'gif'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Film className="h-4 w-4" />
            <span>{t.navGif}</span>
          </button>

          {/* New Telegram Bot Live Chat Feature */}
          <button
            onClick={() => setActiveTab('bot-chat')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'bot-chat'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Send className="h-4 w-4 text-sky-400" />
            <span className="font-myanmar">{lang === 'my' ? 'Telegram Bot စမ်းသပ်ခန်း' : 'Live Bot Chat'}</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('booster')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'booster'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Rocket className="h-4 w-4" />
            <span>{t.navBooster}</span>
            {freeTrialsLeft > 0 ? (
              <span className="ml-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 text-[10px] font-bold">
                {lang === 'my' ? 'အစမ်း ၁ ကြိမ်' : 'Free Trial'}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('invite')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'invite'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Gift className="h-4 w-4 text-amber-400" />
            <span className="font-myanmar">{lang === 'my' ? 'သူငယ်ချင်း ဖိတ်ခေါ်မည်' : 'Invite Friends'}</span>
            <span className="ml-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-bold">
              +Trial
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Language toggle + Booster Quick Access) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('booster')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-950/40 transition-colors"
          >
            <Rocket className="h-3.5 w-3.5 text-amber-400" />
            <span>{freeTrialsLeft > 0 ? (lang === 'my' ? `အစမ်း ${freeTrialsLeft} ကြိမ်ရ` : `${freeTrialsLeft} Free Trial`) : (lang === 'my' ? 'ဝယ်ယူရန်' : 'Buy Credits')}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
            title="Switch Language / ဘာသာစကားပြောင်းရန်"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold">{lang === 'en' ? 'မြန်မာ' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950 px-3 py-2 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'stickers' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>{t.navSticker}</span>
        </button>
        <button
          onClick={() => setActiveTab('gif')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'gif' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Film className="h-3.5 w-3.5" />
          <span>{t.navGif}</span>
        </button>
        <button
          onClick={() => setActiveTab('bot-chat')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'bot-chat' ? 'bg-sky-600 text-white' : 'text-slate-400'
          }`}
        >
          <Send className="h-3.5 w-3.5 text-sky-400" />
          <span>{lang === 'my' ? 'Bot စမ်းသပ်ခန်း' : 'Bot Chat'}</span>
        </button>
        <button
          onClick={() => setActiveTab('booster')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'booster' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Rocket className="h-3.5 w-3.5" />
          <span>{t.navBooster}</span>
        </button>
        <button
          onClick={() => setActiveTab('invite')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'invite' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          <Gift className="h-3.5 w-3.5 text-amber-400" />
          <span>{lang === 'my' ? 'ဖိတ်ခေါ်မည်' : 'Invite'}</span>
        </button>
      </div>
    </header>
  );
};
