import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Rocket, 
  Crown, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Bot, 
  User, 
  Image as ImageIcon,
  Smile,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { generateStickerSvg, MYANMAR_STICKER_PHRASES } from '../utils/stickerPresets';

interface TelegramBotChatProps {
  lang: Language;
  onNavigateToBooster: () => void;
  onNavigateToSticker: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  stickerSvg?: string;
  stickerTitle?: string;
  timestamp: string;
  buttons?: { label: string; action: string }[];
}

export const TelegramBotChat: React.FC<TelegramBotChatProps> = ({
  lang,
  onNavigateToBooster,
  onNavigateToSticker,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: lang === 'my' 
        ? '✨ မင်္ဂလာပါ! <b>StickerCraft & Booster Bot (@sticker_craftt_bot)</b> တိုက်ရိုက် စမ်းသပ်ခန်းမှ ကြိုဆိုပါသည်။\n\nTelegram စတစ်ကာ အလန်းစားများ ထုတ်လုပ်ရန်၊ ချန်နယ်များအတွက် Boost စမ်းသပ်ရန်နှင့် VIP အတွဲများ ဝယ်ယူရန် အောက်ပါ ခလုတ်များကို နှိပ်ပါ သို့မဟုတ် စာတို ရိုက်ပို့ပေးပါ:'
        : '✨ Welcome to <b>StickerCraft & Booster Bot (@sticker_craftt_bot)</b> Live Studio!\n\nGenerate expressive Telegram stickers, test channel boosting, or unlock VIP packs below:',
      timestamp: 'Just now',
      buttons: [
        { label: '🎨 AI Sticker ထုတ်မည်', action: 'gen_sticker' },
        { label: '🚀 Channel Boost စမ်းမည်', action: 'boost_trial' },
        { label: '👑 VIP ဝယ်ယူရန် (Wave/AYA)', action: 'view_vip' },
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Bot Auto-Response Simulation with real Telegram Sticker Engine
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (text === '/start' || text.toLowerCase() === 'hi') {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: '✨ <b>StickerCraft Bot Menu</b>\n\nလိုချင်သော စတစ်ကာ စာတန်းကို ရိုက်ထည့်နိုင်ပါသည် (ဥပမာ- "မိုက်တယ်ဟေ့", "ချစ်တယ်နော်") သို့မဟုတ် အောက်ပါ ရွေးချယ်မှုများကို သုံးပါ:',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: '🔥 မိုက်တယ်ဟေ့', action: 'phrase_cool' },
              { label: '❤️ ချစ်တယ်နော်', action: 'phrase_love' },
              { label: '🚀 Channel Boost', action: 'boost_trial' },
              { label: '👥 Referral Program', action: 'show_ref' },
              { label: '⭐ Customer Reviews', action: 'show_reviews' },
            ],
          },
        ]);
      } else if (text === '/ref' || text.includes('referral') || text.includes('ဖိတ်')) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: `🎁 <b>Referral Program (သူငယ်ချင်း ဖိတ်ခေါ်ပြီး Views အခမဲ့ယူပါ)</b>\n\nသင့်အတွက် သီးသန့် Invite Link:\n<code>https://ais-pre-ls3yecemf76tbwr4phxm4y-806907607118.asia-east1.run.app?ref=USER_VIP882</code>\n\n🎯 <b>ဆုလာဘ် အစီအစဉ်များ:</b>\n• ၁ ဦး ဖိတ်လျှင်: <b>+250 Free Views</b>\n• ၅ ဦး ဖိတ်လျှင်: <b>+1,500 Views & VIP Pack</b>\n• ၁၀ ဦး ဖိတ်လျှင်: <b>+5,000 Views & Pro Partner</b>\n\n💰 ဝယ်ယူမှုတိုင်းအတွက် 15% ကော်မရှင် (Wave / AYA) ရရှိပါမည်!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: '📋 Link ကူးယူမည်', action: 'copy_ref_bot' },
              { label: '🚀 Channel Boost စမ်းမည်', action: 'boost_trial' },
            ],
          },
        ]);
      } else if (text === '/reviews' || text.includes('review') || text.includes('သုံးသပ်')) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: `⭐ <b>သုံးစွဲသူများ၏ အမှန်တကယ် သုံးသပ်ချက်များ (Customer Reviews)</b>\n⭐⭐⭐⭐⭐ <b>4.9 / 5.0</b> (သုံးသပ်ချက် ၁,၂၈၀+ ခု)\n\n👤 <b>ကိုသန့်ဇင်ဦး (Crypto Trader):</b>\n<i>"Wave နဲ့ ၃,၀၀၀ တန် သွင်းပြီး စမ်းတာ ၁၀ မိနစ်အတွင်း views ၁၀၀၀ ကျော် တက်လာတယ်။ စတစ်ကာတွေရော အလန်းပဲ!"</i> ⭐⭐⭐⭐⭐\n\n👤 <b>မယုယုနွယ် (Online Shop):</b>\n<i>"reactions လေးတွေပါ လာထည့်ပေးလို့ post တွေ လူပိုစိတ်ဝင်စားလာတယ်။ 5 stars ရှင့်!"</i> ⭐⭐⭐⭐⭐\n\n👤 <b>ကိုမင်းခန့် (Gaming Guild Owner):</b>\n<i>"09779944100 ကို ငွေလွှဲပြီး မိနစ်ပိုင်းအတွင်း active ဖြစ်သွားတယ် 👍"</i> ⭐⭐⭐⭐⭐`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: '⚡ Telegram Booster သို့ သွားမည်', action: 'nav_booster' },
              { label: '🎨 စတစ်ကာ ထုတ်မည်', action: 'gen_sticker' },
            ],
          },
        ]);
      } else if (text.toLowerCase().includes('boost') || text.includes('/boost')) {
        const orderId = 'TB-' + Math.floor(10000 + Math.random() * 90000);
        const boostMsgId = 'boost-' + Date.now();
        
        // Initial 15% progress
        setMessages((prev) => [
          ...prev,
          {
            id: boostMsgId,
            sender: 'bot',
            text: `🚀 <b>Channel Boost အော်ဒါ စတင်ပါပြီ!</b>\n\n🎯 <b>Target:</b> <code>@my_channel</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n⚡ <b>အခြေအနေ:</b> စတင် ဆောင်ရွက်နေဆဲ (15%)\n📊 <b>Delivered:</b> 150 / 1,000 Views\n⏱️ <b>Speed:</b> 350 views/min\n\n<i>ခေတ္တစောင့်ဆိုင်းပေးပါ...</i>`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // 65% progress after 2.2s
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === boostMsgId
                ? {
                    ...m,
                    text: `⚡ <b>Channel Boost ပို့ဆောင်နေဆဲ...</b>\n\n🎯 <b>Target:</b> <code>@my_channel</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n⚡ <b>အခြေအနေ:</b> ပို့ဆောင်နေဆဲ (65%)\n📊 <b>Delivered:</b> 650 / 1,000 Views\n⏱️ <b>Speed:</b> 500 views/min\n\n<i>မကြာမီ ပြီးစီးပါမည်...</i>`,
                  }
                : m
            )
          );

          // 100% completed after 2.5s
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === boostMsgId
                  ? {
                      ...m,
                      text: `✅ <b>Channel Boost အောင်မြင်စွာ ပို့ဆောင်ပြီးပါပြီ!</b> 🎉\n\n🎯 <b>Target:</b> <code>@my_channel</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n⚡ <b>အခြေအနေ:</b> <b>Completed (100% အပြည့်)</b>\n📊 <b>Delivered:</b> 1,000 / 1,000 Views Delivered!\n✨ <b>Reactions:</b> +250 Added\n\n<i>ထပ်မံ Boost ပြုလုပ်လိုပါက Telegram Booster သို့ သွားရောက်နိုင်ပါသည်။</i>`,
                      buttons: [
                        { label: '🚀 နောက်ထပ် Boost ပြုလုပ်မည်', action: 'boost_trial' },
                        { label: '👑 VIP ဝယ်ယူရန် (Wave/AYA)', action: 'view_vip' },
                      ],
                    }
                  : m
              )
            );
            confetti({
              particleCount: 45,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#06b6d4', '#10b981', '#f59e0b'],
            });
          }, 2500);
        }, 2200);
      } else if (text === '/daily' || text.includes('bonus') || text.includes('ဘောနပ်စ်')) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: '🎁 <b>နေ့စဉ် Bonus Boost Credits ရရှိပါပြီ!</b> 🎉\n\n✨ <b>+250 Free Views & +50 Reactions</b> ကို သင်၏ အကောင့်ထဲသို့ ထည့်သွင်းပေးလိုက်ပါပြီ!\n\nအသုံးပြုရန် အောက်ပါ ခလုတ်ကို နှိပ်ပါ:',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: '🚀 Channel သို့ Boost သုံးမည်', action: 'boost_trial' },
              { label: '🎨 စတစ်ကာ ထုတ်မည်', action: 'gen_sticker' },
            ],
          },
        ]);
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } else if (text === '/random' || text.includes('random')) {
        const surprisePrompts = [
          'စူပါကူးလ် နေကာမျက်မှန်နှင့် ပန်ဒါနီ (မိုက်တယ်ဟေ့ 🔥)',
          'အသည်းပုံ ရင်ခွင်ပိုက် ကြောင်ကလေး (ချစ်တယ်နော် ❤️)',
          'မျက်ရည်ကျအောင် ရယ်နေသော ဖားပြုတ်မီမ်း (ဟဲဟဲ 😂)',
          'သူဌေးမင်း ရွှေကျားစတစ်ကာ (သူဌေးမင်း 💰)',
          'အားတင်းထား ပန်ဒါစစ်သည် (အားတင်းထား 💪)',
        ];
        const randomP = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
        const svg = generateStickerSvg(randomP, '3d-cute', 'cool', randomP.slice(0, 16));
        
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: `🎲 <b>Surprise Telegram Sticker ထွက်ရှိပါပြီ!</b>\n<i>"${randomP}"</i>`,
            stickerSvg: svg,
            stickerTitle: randomP,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: '🎲 နောက်တစ်ခု ထပ်ထုတ်မည်', action: 'random_again' },
              { label: '🚀 Channel Boost စမ်းမည်', action: 'boost_trial' },
            ],
          },
        ]);
      } else if (text.toLowerCase().includes('vip') || text.includes('ဝယ်') || text.includes('/vip')) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: '👑 <b>VIP Premium Packages (Wave Pay / AYA Pay)</b>\n\n• <b>Starter Pack</b>: 3,000 MMK (VIP စတစ်ကာများ အားလုံးဖွင့်လှစ်ခွင့်)\n• <b>Pro Growth</b>: 10,000 MMK (VIP + 5,000 Views Boost)\n\n📲 <b>ငွေလွှဲရန် နံပါတ်: 09779944100</b>\n(Wave Pay / AYA Pay)\n\nငွေလွှဲပြီးပါက Transaction ID ရိုက်ပို့ပေးပါက ချက်ချင်း အတည်ပြုပေးပါမည်!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [{ label: '📋 ဖုန်းနံပါတ် 09779944100 ကူးယူမည်', action: 'copy_vip_phone' }],
          },
        ]);
      } else {
        // Generate crisp Telegram sticker for user prompt
        const emotion = text.includes('ချစ်') || text.includes('love') ? 'love' : (text.includes('😂') || text.includes('ဟဲ') ? 'laughing' : 'cool');
        const style = text.includes('anime') ? 'anime' : (text.includes('cyber') ? 'cyberpunk' : '3d-cute');
        const svg = generateStickerSvg(text, style, emotion, text.slice(0, 18));

        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: `🎨 <b>Telegram စတစ်ကာ ထုတ်လုပ်ပြီးစီးပါပြီ!</b>\n<i>"${text}"</i>`,
            stickerSvg: svg,
            stickerTitle: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: '✨ နောက်တစ်ခု ထပ်ထုတ်မည်', action: 'gen_sticker' },
              { label: '🚀 Channel Boost စမ်းမည်', action: 'boost_trial' },
            ],
          },
        ]);
      }
    }, 700);
  };

  const handleButtonClick = (action: string) => {
    if (action === 'gen_sticker') {
      handleSendMessage('ကြောင်ကလေး ချစ်စရာ Telegram Sticker (Cute Neko Cat)');
    } else if (action === 'random_again') {
      handleSendMessage('/random');
    } else if (action === 'phrase_cool') {
      handleSendMessage('မိုက်တယ်ဟေ့ 🔥');
    } else if (action === 'phrase_love') {
      handleSendMessage('ချစ်တယ်နော် ❤️');
    } else if (action === 'phrase_laugh') {
      handleSendMessage('ဟဲဟဲ 😂');
    } else if (action === 'boost_trial') {
      handleSendMessage('/boost @my_telegram_channel');
    } else if (action === 'show_ref') {
      handleSendMessage('/ref');
    } else if (action === 'show_reviews') {
      handleSendMessage('/reviews');
    } else if (action === 'copy_ref_bot') {
      const link = `${window.location.origin}?ref=USER_VIP882`;
      navigator.clipboard.writeText(link);
      alert(lang === 'my' ? 'Referral Link ကို ကူးယူပြီးပါပြီ!' : 'Copied referral link!');
    } else if (action === 'view_vip') {
      handleSendMessage('/vip');
    } else if (action === 'nav_booster') {
      onNavigateToBooster();
    } else if (action === 'copy_vip_phone') {
      navigator.clipboard.writeText('09779944100');
      alert(lang === 'my' ? '09779944100 ကို ကူးယူပြီးပါပြီ (Wave / AYA Pay)' : 'Copied 09779944100 to clipboard!');
    }
  };

  const handleDownloadSticker = (svgData: string, title: string) => {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_telegram_sticker.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Telegram Live Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-sky-500/30 bg-slate-900/90 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/20"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white flex items-center gap-1.5 font-display">
                <span>Sticker Craft Bot</span>
                <CheckCircle2 className="h-4 w-4 text-sky-400" />
              </h1>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono-code px-2 py-0.5 rounded-full font-bold">
                @sticker_craftt_bot
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="text-emerald-400 font-medium">● 24/7 Online</span>
              <span>·</span>
              <span>Telegram Sticker & Booster Engine</span>
            </p>
          </div>
        </div>

        {/* Real Telegram Bot Action Button */}
        <a
          href="https://t.me/sticker_craftt_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/20 transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="font-myanmar">{lang === 'my' ? 'Telegram App တွင် တိုက်ရိုက်ဖွင့်မည်' : 'Open in Telegram App'}</span>
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </div>

      {/* Telegram Chat Viewport */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Telegram Chat Wallpaper Background */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative"
          style={{
            backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isBot ? 'self-start' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isBot 
                    ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl shadow-md border ${
                    isBot 
                      ? 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tl-sm' 
                      : 'bg-indigo-600 border-indigo-500 text-white rounded-tr-sm'
                  }`}>
                    {msg.text && (
                      <div 
                        className="text-xs sm:text-sm leading-relaxed font-myanmar whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    )}

                    {/* Rendered Telegram Sticker Preview in Chat */}
                    {msg.stickerSvg && (
                      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col items-center">
                        <div 
                          className="w-48 h-48 sm:w-56 sm:h-56 p-2 cursor-pointer transition-transform hover:scale-105"
                          dangerouslySetInnerHTML={{ __html: msg.stickerSvg }}
                        />

                        {/* Quick Sticker Actions */}
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadSticker(msg.stickerSvg!, msg.stickerTitle || 'sticker')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                          >
                            <Download className="h-3 w-3 text-emerald-400" />
                            <span>Download 512x512</span>
                          </button>

                          <a
                            href="https://t.me/sticker_craftt_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-xs font-semibold text-sky-300 border border-sky-500/30 transition-colors"
                          >
                            <Send className="h-3 w-3" />
                            <span>Send to Bot</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <span className="block text-[10px] text-slate-400 mt-2 text-right">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Inline Action Buttons */}
                  {msg.buttons && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.buttons.map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleButtonClick(btn.action)}
                          className="px-3 py-1.5 rounded-xl border border-sky-500/30 bg-slate-900/90 hover:bg-sky-950/40 text-xs font-semibold text-sky-300 shadow-sm transition-all hover:border-sky-400 active:scale-95 font-myanmar"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="h-4 w-4 text-sky-400 animate-bounce" />
              <span className="font-myanmar">Sticker Craft Bot စတစ်ကာ ထုတ်လုပ်နေပါသည်...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Burmese Phrases Tray */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 font-myanmar">အမြန်ရွေးရန်:</span>
          {MYANMAR_STICKER_PHRASES.slice(0, 8).map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(phrase)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-myanmar whitespace-nowrap transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={lang === 'my' ? 'စတစ်ကာ စာတန်း သို့မဟုတ် အကြောင်းအရာ ရိုက်ထည့်ပါ (ဥပမာ- မိုက်တယ်ဟေ့)...' : 'Type sticker prompt or phrase...'}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-myanmar"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center gap-1.5 text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline font-myanmar">ပို့မည်</span>
          </button>
        </div>
      </div>
    </div>
  );
};
