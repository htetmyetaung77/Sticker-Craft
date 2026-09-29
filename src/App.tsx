import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StickerMaker } from './components/StickerMaker';
import { GifMaker } from './components/GifMaker';
import { TelegramBotChat } from './components/TelegramBotChat';
import { TelegramBooster } from './components/TelegramBooster';
import { InviteFriends } from './components/InviteFriends';
import { StickerItem, Language } from './types';
import { INITIAL_PRESETS } from './utils/stickerPresets';
import { translations } from './utils/translations';
import { Sparkles, Heart, Rocket } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('my'); // Default to Myanmar as requested
  const [activeTab, setActiveTab] = useState<'stickers' | 'gif' | 'bot-chat' | 'booster' | 'invite'>('stickers');
  const [freeTrialsRemaining, setFreeTrialsRemaining] = useState(1);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        freeTrialsLeft={freeTrialsRemaining}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'stickers' && (
          <StickerMaker
            lang={lang}
            onAddToPack={() => {}}
            onNavigateToBooster={() => setActiveTab('booster')}
          />
        )}

        {activeTab === 'gif' && (
          <GifMaker lang={lang} />
        )}

        {activeTab === 'bot-chat' && (
          <TelegramBotChat
            lang={lang}
            onNavigateToBooster={() => setActiveTab('booster')}
            onNavigateToSticker={() => setActiveTab('stickers')}
          />
        )}

        {activeTab === 'booster' && (
          <TelegramBooster lang={lang} />
        )}

        {activeTab === 'invite' && (
          <InviteFriends
            lang={lang}
            freeTrialsRemaining={freeTrialsRemaining}
            onAddFreeTrial={(count = 1) => setFreeTrialsRemaining((prev) => prev + count)}
            onNavigateToBooster={() => setActiveTab('booster')}
            onNavigateToStickers={() => setActiveTab('stickers')}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-300">StickerCraft Studio</span>
            <span aria-hidden="true">·</span>
            <span>AI Sticker & GIF Engine</span>
            <span aria-hidden="true">·</span>
            <span>Telegram Channel Booster Hub</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('booster')}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Wave / AYA Pay: 09779944100
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
              className="hover:text-indigo-400 transition-colors font-medium font-myanmar"
            >
              {lang === 'en' ? 'မြန်မာဘာသာသို့ ပြောင်းရန်' : 'Switch to English'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
