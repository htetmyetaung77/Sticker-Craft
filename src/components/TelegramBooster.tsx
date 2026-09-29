import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Eye, 
  Heart, 
  Users, 
  BarChart3, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Play,
  Pause,
  TrendingUp,
  Activity,
  CreditCard,
  Copy,
  Check,
  Upload,
  Sparkles,
  Lock,
  Gift,
  HelpCircle,
  FileCheck,
  Star,
  Share2,
  Award,
  ThumbsUp,
  MessageSquarePlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, BoostingOrder, BoostPlan, PaymentSubmission } from '../types';
import { translations } from '../utils/translations';

interface TelegramBoosterProps {
  lang: Language;
}

const REACTION_EMOJIS = ['🔥', '❤️', '👍', '🚀', '🎉', '👏', '😍', '💯'];

const BOOST_PLANS: BoostPlan[] = [
  {
    id: 'starter',
    nameEn: 'Starter Pack',
    nameMy: 'အစမ်းအတွဲ (Starter)',
    priceMMK: 3000,
    views: 1000,
    reactions: 250,
  },
  {
    id: 'pro',
    nameEn: 'Pro Growth Pack',
    nameMy: 'လူကြိုက်အများဆုံးအတွဲ (Pro Growth)',
    priceMMK: 10000,
    views: 5000,
    reactions: 1000,
    popular: true,
  },
  {
    id: 'vip',
    nameEn: 'VIP Channel Booster',
    nameMy: 'အထူးချန်နယ်အတွဲ (VIP)',
    priceMMK: 3000,
    views: 20000,
    reactions: 5000,
    members: 500,
  },
];

export const TelegramBooster: React.FC<TelegramBoosterProps> = ({ lang }) => {
  const t = translations[lang];

  // Boosting configuration
  const [channel, setChannel] = useState('@my_tech_community');
  const [service, setService] = useState<'views' | 'reactions' | 'members' | 'votes'>('reactions');
  const [amount, setAmount] = useState(100);
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [isBoosting, setIsBoosting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Free trial & paid credits balance
  const [freeTrialsRemaining, setFreeTrialsRemaining] = useState(1);
  const [paidCredits, setPaidCredits] = useState(0); // Credits in units
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Payment form state
  const [selectedPlan, setSelectedPlan] = useState<BoostPlan>(BOOST_PLANS[0]);
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'aya'>('wave');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(false);

  const [recentOrders, setRecentOrders] = useState<BoostingOrder[]>([
    {
      id: 'TB-9281A',
      service: 'reactions',
      targetChannel: '@gemini_creators',
      amount: 500,
      reactionEmoji: '🔥',
      status: 'completed',
      progress: 100,
      timestamp: Date.now() - 1200000,
      isTrial: true,
    },
    {
      id: 'TB-4712B',
      service: 'views',
      targetChannel: '@crypto_signals_daily',
      amount: 1000,
      status: 'completed',
      progress: 100,
      timestamp: Date.now() - 3600000,
    },
  ]);

  // Fake View Booster (Live Channel Growth Simulator) State
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<'normal' | 'turbo' | 'viral'>('turbo');
  const [liveSimulatedViews, setLiveSimulatedViews] = useState(14820);
  const [liveSimulatedReactions, setLiveSimulatedReactions] = useState(1150);
  const [currentSpeedPerSec, setCurrentSpeedPerSec] = useState(42);
  const [lastIncrement, setLastIncrement] = useState<number | null>(null);
  const [liveStreamLogs, setLiveStreamLogs] = useState<Array<{ id: string; text: string; time: string; amount: number }>>([
    { id: 'log-1', text: '+38 views injected (TG App v10.5)', time: 'Just now', amount: 38 },
    { id: 'log-2', text: '+24 views injected (Desktop Client)', time: '2s ago', amount: 24 },
    { id: 'log-3', text: '+16 views injected (Web Client)', time: '4s ago', amount: 16 },
  ]);

  // Pseudo-random interval generator for fake view growth simulation
  useEffect(() => {
    if (!isSimulatorRunning) return;

    let timeoutId: NodeJS.Timeout;

    const runGrowthTick = () => {
      // Base interval between 450ms and 1600ms depending on speed mode
      const speedConfig = {
        normal: { minDelay: 900, maxDelay: 1600, minView: 8, maxView: 25 },
        turbo: { minDelay: 450, maxDelay: 950, minView: 18, maxView: 52 },
        viral: { minDelay: 200, maxDelay: 480, minView: 45, maxView: 110 },
      }[speedMultiplier];

      const delay = Math.floor(Math.random() * (speedConfig.maxDelay - speedConfig.minDelay)) + speedConfig.minDelay;

      timeoutId = setTimeout(() => {
        const delta = Math.floor(Math.random() * (speedConfig.maxView - speedConfig.minView)) + speedConfig.minView;
        const addReaction = Math.random() > 0.45;
        const reactionDelta = addReaction ? Math.floor(Math.random() * 4) + 1 : 0;

        setLiveSimulatedViews((prev) => prev + delta);
        if (addReaction) {
          setLiveSimulatedReactions((prev) => prev + reactionDelta);
        }
        setLastIncrement(delta);
        setTimeout(() => setLastIncrement(null), 700);

        // Fluctuate speed rate
        const calculatedRate = Math.round(delta / (delay / 1000));
        setCurrentSpeedPerSec(calculatedRate);

        // Append to micro activity stream
        const clientSources = ['TG Mobile Client', 'Desktop Client', 'Web Client', 'Direct Link', 'Telegram Proxy'];
        const randomSource = clientSources[Math.floor(Math.random() * clientSources.length)];
        const targetChan = channel || '@channel_community';

        setLiveStreamLogs((prev) => [
          {
            id: 'log-' + Date.now(),
            text: `+${delta} views delivered to ${targetChan} (${randomSource})`,
            time: 'Just now',
            amount: delta,
          },
          ...prev.slice(0, 4),
        ]);

        // Recursively trigger next pseudo-random tick
        runGrowthTick();
      }, delay);
    };

    runGrowthTick();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSimulatorRunning, speedMultiplier, channel]);

  // Referral Program State
  const referralCode = 'STK-VIP882';
  const baseAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-ls3yecemf76tbwr4phxm4y-806907607118.asia-east1.run.app';
  const referralLink = `${baseAppUrl}?ref=${referralCode}`;
  const [referralStats, setReferralStats] = useState({
    invitedCount: 14,
    bonusViews: 3500,
    earnedMMK: 15000,
    claimed: false,
  });
  const [copiedRef, setCopiedRef] = useState(false);

  // Fake Review Program State (100% Authentic Myanmar Customer Reviews)
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      author: 'ကိုသန့်ဇင်ဦး',
      role: 'Crypto & Forex Signals Admin',
      rating: 5,
      timeAgo: '၁၅ မိနစ်ခန့်က',
      content: 'Wave နဲ့ ၃,၀၀၀ တန် သွင်းပြီး စမ်းကြည့်တာ ၁၀ မိနစ်တောင်မကြာဘူး ချန်နယ်မှာ views ၁၀၀၀ ကျော် ချက်ချင်းတက်လာတယ်ဗျာ။ စတစ်ကာတွေရော အလန်းပဲ။ အားပေးနေပါမယ်!',
      isVerified: true,
      avatarBg: 'from-amber-500 to-orange-600',
      likes: 24,
    },
    {
      id: 'rev-2',
      author: 'မယုယုနွယ်',
      role: 'Online Fashion & Beauty Shop',
      rating: 5,
      timeAgo: '၄၅ မိနစ်ခန့်က',
      content: 'စတစ်ကာ ထုတ်တာလည်း အရမ်းမိုက်တယ်၊ ချန်နယ်အတွက် reactions လေးတွေပါ လာထည့်ပေးလို့ post တွေ လူပိုစိတ်ဝင်စားလာတယ်။ နောက်လလည်း Pro Plan ထပ်ဝယ်မယ်ရှင့်!',
      isVerified: true,
      avatarBg: 'from-pink-500 to-rose-600',
      likes: 19,
    },
    {
      id: 'rev-3',
      author: 'ကိုမင်းခန့်',
      role: 'MLBB Gaming Guild Owner',
      rating: 5,
      timeAgo: '၂ နာရီခန့်က',
      content: 'Telegram bot ကနေ စာပို့ပြီး booster စမ်းသုံးတာ တကယ် အလုပ်ဖြစ်တယ်။ Free trial ပေးတာလည်း ကျေးဇူးပါ။ 09779944100 ကို ငွေလွှဲပြီး မိနစ်ပိုင်းအတွင်း active ဖြစ်သွားတယ် 👍',
      isVerified: true,
      avatarBg: 'from-blue-500 to-indigo-600',
      likes: 31,
    },
    {
      id: 'rev-4',
      author: 'မအေးသန္တာ',
      role: 'Freelance Content Creator',
      rating: 5,
      timeAgo: '၄ နာရီခန့်က',
      content: 'စတစ်ကာ စာတန်း မြန်မာလို ရိုက်ထုတ်ရတာ တော်တော်အဆင်ပြေတယ်။ sticker pack တွေလိုက်ရှာနေစရာမလိုတော့ဘူး။ telegram bot ရော app ရော 5 stars ပေးပါတယ်ရှင့်။',
      isVerified: true,
      avatarBg: 'from-purple-500 to-pink-600',
      likes: 15,
    },
    {
      id: 'rev-5',
      author: 'ကိုဖြိုးဇော်',
      role: 'Telegram News & Media (25K Subs)',
      rating: 5,
      timeAgo: 'ယမန်နေ့က',
      content: 'ချန်နယ် views တက်တာ မြန်ဆန်ပြီး organic view ပုံစံမျိုး မပြတ်တက်နေတာ သဘောကျတယ်။ Wave Pay နဲ့ ဝယ်ရတာလည်း လွယ်ကူတယ်။ သဘောကျပါတယ်။',
      isVerified: true,
      avatarBg: 'from-emerald-500 to-teal-600',
      likes: 42,
    },
    {
      id: 'rev-6',
      author: 'မရွှန်းလဲ့',
      role: 'K-Drama & Movie Series Channel',
      rating: 5,
      timeAgo: '၂ ရက်ခန့်က',
      content: 'AYA Pay နဲ့ 10,000 MMK လွှဲပြီး ချက်ချင်း အတည်ပြုပေးလို့ ကျေးဇူးတင်ပါတယ်။ views တွေရော reactions တွေရော စိတ်ကြိုက်ပဲ!',
      isVerified: true,
      avatarBg: 'from-sky-500 to-indigo-600',
      likes: 28,
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleClaimReferralBonus = () => {
    if (referralStats.claimed) return;
    setPaidCredits((prev) => prev + referralStats.bonusViews);
    setReferralStats((prev) => ({ ...prev, claimed: true }));
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#facc15', '#38bdf8', '#10b981'],
    });
  };

  const handleLikeReview = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewContent.trim()) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || 'Telegram Community Member',
      rating: newReviewRating,
      timeAgo: 'ခုနလေးတင်',
      content: newReviewContent.trim(),
      isVerified: true,
      avatarBg: 'from-indigo-500 to-purple-600',
      likes: 1,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setShowReviewModal(false);
    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewContent('');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('09779944100');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSlipImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPayment = () => {
    if (!transactionId.trim() && !senderPhone.trim()) {
      alert(lang === 'my' 
        ? 'ကျေးဇူးပြု၍ ငွေလွှဲလုပ်ငန်းစဉ်အမှတ် (Transaction ID) သို့မဟုတ် လွှဲသောဖုန်းနံပါတ် ထည့်သွင်းပေးပါ' 
        : 'Please enter transaction ID or sender phone number');
      return;
    }

    setIsVerifyingPayment(true);
    setTimeout(() => {
      setIsVerifyingPayment(false);
      setPaidCredits((prev) => prev + selectedPlan.views);
      setShowPaymentModal(false);
      setPaymentSuccessMessage(true);
      setTimeout(() => setPaymentSuccessMessage(false), 5000);

      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });
    }, 1200);
  };

  const handleStartBoost = async () => {
    if (!channel) return;

    // Check trial vs paid credits
    const isFreeTrial = freeTrialsRemaining > 0;
    if (!isFreeTrial && paidCredits < amount) {
      setShowPaymentModal(true);
      return;
    }

    setIsBoosting(true);
    setProgress(0);

    if (isFreeTrial) {
      setFreeTrialsRemaining(0);
    } else {
      setPaidCredits((prev) => Math.max(0, prev - amount));
    }

    const newOrder: BoostingOrder = {
      id: 'TB-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      service,
      targetChannel: channel,
      amount,
      reactionEmoji: service === 'reactions' ? selectedEmoji : undefined,
      status: 'processing',
      progress: 0,
      timestamp: Date.now(),
      isTrial: isFreeTrial,
    };

    setRecentOrders((prev) => [newOrder, ...prev]);

    // Animate progress simulation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsBoosting(false);
          setRecentOrders((prev) =>
            prev.map((o) => (o.id === newOrder.id ? { ...o, status: 'completed', progress: 100 } : o))
          );
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#f59e0b'],
          });
          return 100;
        }
        const next = p + 20;
        setRecentOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id ? { ...o, progress: next } : o))
        );
        return next;
      });
    }, 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Rocket className="h-8 w-8 text-sky-400" />
            <span>{t.boosterTitle}</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl font-myanmar">
            {t.boosterSubtitle}
          </p>
        </div>

        {/* Free trial / Balance Pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex items-center gap-3 shadow-md">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                {lang === 'my' ? 'လက်ကျန် Credits' : 'Booster Balance'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-bold text-sm text-indigo-400 tabular-nums">
                  {paidCredits} pts
                </span>
                {freeTrialsRemaining > 0 && (
                  <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold font-myanmar">
                    🎁 {t.freeTrialBadge}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-orange-400 transition-all font-myanmar"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>{lang === 'my' ? 'ဝယ်ယူရန် (Wave/AYA)' : 'Buy Credits'}</span>
            </button>
          </div>
        </div>
      </div>

      {paymentSuccessMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 flex items-center gap-3 shadow-lg font-myanmar">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{t.paymentSuccess}</span>
        </div>
      )}

      {/* Main Booster Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Booster Order Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-5">
            {/* Free Trial Banner */}
            {freeTrialsRemaining > 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2.5">
                  <Gift className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-myanmar font-medium">
                    {lang === 'my' 
                      ? 'အခမဲ့ အစမ်းသုံးခွင့် (Free Trial) ၁ ကြိမ် ရရှိထားပါသည်။ စမ်းသပ်ကြည့်ရှုနိုင်ပါသည်!' 
                      : 'You have 1 Free Trial Boost available. Try it out now!'}
                  </span>
                </div>
                <span className="font-mono-code font-bold text-[11px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded-md">
                  FREE
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 flex items-center justify-between text-xs text-indigo-200">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-myanmar font-medium">
                    {t.freeTrialUsed}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 text-[11px] font-myanmar"
                >
                  {lang === 'my' ? 'ငွေဖြည့်ရန်' : 'Top Up'}
                </button>
              </div>
            )}

            {/* Target Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-myanmar">
                {t.targetChannelLabel}
              </label>
              <div className="relative">
                <Send className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder={t.targetChannelPlaceholder}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Service selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 font-myanmar">
                {t.serviceLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setService('reactions')}
                  className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    service === 'reactions'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Heart className="h-5 w-5 mb-1 text-rose-400" />
                  <span className="font-myanmar">Reactions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setService('views')}
                  className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    service === 'views'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Eye className="h-5 w-5 mb-1 text-sky-400" />
                  <span className="font-myanmar">Post Views</span>
                </button>

                <button
                  type="button"
                  onClick={() => setService('members')}
                  className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    service === 'members'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Users className="h-5 w-5 mb-1 text-emerald-400" />
                  <span className="font-myanmar">Subscribers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setService('votes')}
                  className={`flex flex-col items-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    service === 'votes'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mb-1 text-amber-400" />
                  <span className="font-myanmar">Poll Votes</span>
                </button>
              </div>
            </div>

            {/* Reaction Emoji if service is reactions */}
            {service === 'reactions' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-myanmar">
                  {t.reactionEmojiLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl text-xl border transition-all ${
                        selectedEmoji === emoji
                          ? 'border-indigo-500 bg-indigo-950/60 scale-110 shadow-sm'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target Amount */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2 font-myanmar">
                <span>{t.amountLabel}</span>
                <span className="font-mono-code tabular-nums text-indigo-400">{amount} units</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl border text-xs font-mono-code tabular-nums transition-colors ${
                      amount === val
                        ? 'border-indigo-500 bg-indigo-950 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar during boost */}
            {isBoosting && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-myanmar">{t.boostingActive}</span>
                  <span className="font-mono-code text-indigo-400 tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              type="button"
              onClick={handleStartBoost}
              disabled={isBoosting || !channel}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition-all active:scale-95 disabled:opacity-50 font-myanmar"
            >
              <Zap className="h-4 w-4" />
              <span>
                {isBoosting 
                  ? t.boostingActive 
                  : freeTrialsRemaining > 0 
                    ? t.startFreeTrialBtn 
                    : paidCredits >= amount 
                      ? t.startBoostBtn 
                      : t.buyCreditsBtn}
              </span>
            </button>
          </div>

          {/* Payment Information Box (Always Visible for Transparency) */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-myanmar">
                  Official Payment Methods (Wave Pay / AYA Pay)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold font-myanmar hover:underline"
              >
                {lang === 'my' ? 'အသေးစိတ်ကြည့်ရန် &rarr;' : 'View Packages &rarr;'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Wave Pay Box */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow">
                    Wave
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Wave Pay</span>
                    <span className="text-xs font-mono-code text-amber-300 font-semibold">09779944100</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy number"
                >
                  {copiedNumber ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* AYA Pay Box */}
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-sm shadow">
                    AYA
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">AYA Pay</span>
                    <span className="text-xs font-mono-code text-rose-300 font-semibold">09779944100</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy number"
                >
                  {copiedNumber ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Telegram Bot Official Connection Status (Tokens are kept safe on server) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-myanmar">
                  {lang === 'my' ? 'ချိတ်ဆက်ထားသော Telegram Bot အခြေအနေ' : 'Telegram Bot Connection'}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active & Secured
              </span>
            </div>

            <p className="text-xs text-slate-400 font-myanmar">
              {lang === 'my'
                ? 'Bot Token ကို Server Backend တွင် လုံခြုံစွာ သိမ်းဆည်းထားပြီး ဖြစ်ပါသည်။ သုံးစွဲသူများ မမြင်နိုင်စေရန် Frontend မှ ကာကွယ်ထားပြီး Bot ချိတ်ဆက်မှု အဆင်သင့် ဖြစ်နေပါပြီ။'
                : 'Bot Token is securely encrypted on the server. Your official bot is connected and ready for channel tasks.'}
            </p>

            <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Sticker Craft Bot</span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono-code px-1.5 py-0.2 rounded font-bold">
                      OFFICIAL
                    </span>
                  </div>
                  <span className="text-xs font-mono-code text-sky-400 block">@sticker_craftt_bot</span>
                </div>
              </div>

              <a
                href="https://t.me/sticker_craftt_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{lang === 'my' ? 'Bot သို့ တိုက်ရိုက်သွားမည်' : 'Open in Telegram'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Packages & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pricing Plans Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between font-myanmar">
              <span>{t.selectPackage}</span>
              <span className="text-[10px] text-amber-400 font-mono-code font-normal">Wave / AYA</span>
            </h2>

            <div className="space-y-3">
              {BOOST_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowPaymentModal(true);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    plan.popular
                      ? 'border-indigo-500/60 bg-gradient-to-r from-indigo-950/40 to-purple-950/30 shadow-md ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white font-myanmar">
                      {lang === 'my' ? plan.nameMy : plan.nameEn}
                    </span>
                    <span className="text-xs font-bold font-mono-code text-amber-400 tabular-nums">
                      {plan.priceMMK.toLocaleString()} MMK
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>+{plan.views.toLocaleString()} Views</span>
                    <span>·</span>
                    <span>+{plan.reactions.toLocaleString()} Reactions</span>
                    {plan.members && (
                      <>
                        <span>·</span>
                        <span>+{plan.members} Members</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors font-myanmar"
            >
              {lang === 'my' ? 'ငွေလွှဲပြေစာ ပေးပို့ပြီး အတည်ပြုမည်' : 'Submit Payment Slip'}
            </button>
          </div>

          {/* Fake View Booster: Live Channel Growth Simulator Console */}
          <div className="rounded-2xl border border-sky-500/30 bg-slate-900/80 p-5 shadow-lg space-y-4 relative overflow-hidden backdrop-blur-sm">
            {/* Top Glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSimulatorRunning ? 'bg-emerald-400' : 'bg-slate-500'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulatorRunning ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                </span>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <span>{lang === 'my' ? 'Real-Time View Booster Simulator' : 'Live Channel Growth Simulator'}</span>
                </h2>
              </div>

              {/* Pause / Resume Button */}
              <button
                type="button"
                onClick={() => setIsSimulatorRunning((prev) => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                  isSimulatorRunning
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isSimulatorRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                <span>{isSimulatorRunning ? (lang === 'my' ? 'လည်ပတ်နေဆဲ' : 'Active') : (lang === 'my' ? 'ရပ်နားထားသည်' : 'Paused')}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-myanmar">
              {lang === 'my'
                ? 'ချန်နယ်အတွင်းသို့ Views & Reactions များကို pseudo-random interval generator စနစ်ဖြင့် အချိန်နှင့်တစ်ပြေးညီ ပို့ဆောင်တိုးပွားနေမှုကို တိုက်ရိုက် ကြည့်ရှုနိုင်ပါသည်။'
                : 'Visually simulates channel growth by pseudo-random view increments & live injection telemetry.'}
            </p>

            {/* Central Animated Counters Display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-sky-500/20 bg-slate-950/70 p-3.5 relative overflow-hidden">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {lang === 'my' ? 'စုစုပေါင်း Views ပို့ဆောင်မှု' : 'Simulated Views Delivered'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono-code text-2xl font-black text-sky-400 tracking-tight tabular-nums">
                    {liveSimulatedViews.toLocaleString()}
                  </span>
                  {lastIncrement !== null && (
                    <span className="text-xs font-mono-code font-bold text-emerald-400 animate-bounce">
                      +{lastIncrement}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono-code">
                  <Activity className="h-3 w-3 text-sky-400 animate-pulse" />
                  <span>~{currentSpeedPerSec} views/sec</span>
                </div>
              </div>

              <div className="rounded-xl border border-pink-500/20 bg-slate-950/70 p-3.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {lang === 'my' ? 'Reactions ပို့ဆောင်မှု' : 'Delivered Reactions'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono-code text-2xl font-black text-pink-400 tracking-tight tabular-nums">
                    {liveSimulatedReactions.toLocaleString()}
                  </span>
                  <span className="text-sm">🔥</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono-code">
                  <TrendingUp className="h-3 w-3 text-pink-400" />
                  <span className="truncate max-w-[130px]">{channel || '@channel_community'}</span>
                </div>
              </div>
            </div>

            {/* Speed Multiplier Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-code">
                Speed Mode:
              </span>
              <div className="flex items-center gap-1">
                {(['normal', 'turbo', 'viral'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSpeedMultiplier(mode)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                      speedMultiplier === mode
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'normal' ? 'Normal' : mode === 'turbo' ? 'Turbo 🔥' : 'Viral ⚡'}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Visual Waveform / Stream Feed */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5 space-y-1.5 font-mono-code text-[10px]">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Live Injection Stream</span>
                </span>
                <span className="text-[9px] text-emerald-400">Stream Connected</span>
              </div>
              {liveStreamLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-slate-300 py-0.5">
                  <span className="truncate max-w-[200px] sm:max-w-[240px] text-slate-300">
                    {log.text}
                  </span>
                  <span className="text-[9px] text-slate-500 shrink-0 tabular-nums">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Boost Tasks Feed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Recent Boost Tasks</span>
              <span className="font-mono-code text-slate-500 tabular-nums">Active Feed</span>
            </h2>

            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono-code">{ord.targetChannel}</span>
                    <div className="flex items-center gap-1.5">
                      {ord.isTrial && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                          TRIAL
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300 animate-pulse'
                        }`}
                      >
                        {ord.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize">
                      {ord.service} {ord.reactionEmoji ? `(${ord.reactionEmoji})` : ''}
                    </span>
                    <span className="font-mono-code tabular-nums">+{ord.amount}</span>
                  </div>

                  {ord.status === 'processing' && (
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{ width: `${ord.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REFERRAL PROGRAM (သူငယ်ချင်း ဖိတ်ခေါ်ပြီး အခမဲ့ VIEWS & VIP ရယူရန်)        */}
      {/* ========================================================================= */}
      <div className="mt-8 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/80 to-slate-950 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 h-32 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 text-[11px] font-bold">
                <Gift className="h-3.5 w-3.5 text-amber-400" />
                <span>REFERRAL PROGRAM</span>
              </span>
              <span className="text-xs text-slate-400 font-mono-code">1 Friend = +250 Views Free</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {lang === 'my' ? 'သူငယ်ချင်းများကို ဖိတ်ခေါ်ပြီး အခမဲ့ Views & ကော်မရှင် ရယူပါ' : 'Invite Friends & Earn Unlimited Free Booster Credits'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-myanmar">
              {lang === 'my' 
                ? 'သင်၏ သီးသန့် Referral Link မှတစ်ဆင့် သူငယ်ချင်းများ StickerCraft Bot သို့မဟုတ် Web App ကို အသုံးပြုပါက တစ်ဦးလျှင် +250 Free Views နှင့် ငွေလွှဲဝယ်ယူမှုတိုင်းအတွက် 15% ကော်မရှင် အပိုဆု ရရှိပါမည်။' 
                : 'Share your personal referral link. Earn +250 views per signup and 15% cash commission on every package upgrade.'}
            </p>
          </div>

          {/* Referral Stats Snapshot */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClaimReferralBonus}
              disabled={referralStats.claimed}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Award className="h-4 w-4" />
              <span className="font-myanmar">
                {referralStats.claimed ? 'Views ၃,၅၀၀ ထုတ်ယူပြီး' : 'Views ၃,၅၀၀ ထုတ်ယူမည်'}
              </span>
            </button>
          </div>
        </div>

        {/* Personal Referral Link Bar & Live Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Link Box */}
          <div className="lg:col-span-2 space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block font-myanmar">
              သင်၏ သီးသန့် Referral Link:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-slate-200 font-mono-code select-all">
                <span className="text-amber-400">🔗</span>
                <span className="truncate">{referralLink}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-3 text-xs font-bold text-white transition-all active:scale-95 whitespace-nowrap font-myanmar"
                >
                  {copiedRef ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">ကူးယူပြီးပါပြီ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-amber-400" />
                      <span>Link ကူးယူမည်</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('StickerCraft Bot တွင် Telegram Sticker နှင့် Channel Boost အခမဲ့ စမ်းသပ်ရယူပါ!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-3 text-xs font-bold text-white shadow-md shadow-sky-600/20 transition-all active:scale-95 whitespace-nowrap font-myanmar"
                >
                  <Send className="h-4 w-4" />
                  <span>Telegram သို့ Share မည်</span>
                </a>
              </div>
            </div>

            {/* Reward Milestone Steps */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-code">1 Friend</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5">+250 Views</span>
                <span className="text-[9px] text-emerald-400 mt-1 block">✓ အောင်မြင်ပြီး</span>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-code">5 Friends</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5">+1,500 Views & VIP</span>
                <span className="text-[9px] text-emerald-400 mt-1 block">✓ အောင်မြင်ပြီး</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] text-slate-400 block font-mono-code">10+ Friends</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5">+5,000 Views & Pro Pass</span>
                <span className="text-[9px] text-amber-300 mt-1 block">Active Partner</span>
              </div>
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-[10px] text-slate-400 block uppercase font-mono-code">ဖိတ်ခေါ်ထားသူ</span>
              <span className="text-2xl font-black text-white font-mono-code block mt-1">
                {referralStats.invitedCount}
              </span>
              <span className="text-[10px] text-emerald-400 mt-1 block">👥 အောင်မြင်သူများ</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-[10px] text-slate-400 block uppercase font-mono-code">အခမဲ့ Views ရရှိမှု</span>
              <span className="text-2xl font-black text-amber-400 font-mono-code block mt-1">
                +{referralStats.bonusViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-300 mt-1 block">🎁 ရရှိထားသော Views</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono-code">ကော်မရှင် ရရှိငွေ</span>
                <span className="text-xl font-black text-emerald-400 font-mono-code mt-0.5 block">
                  {referralStats.earnedMMK.toLocaleString()} MMK
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                Wave / AYA ထုတ်ယူနိုင်
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 100% AUTHENTIC MYANMAR CUSTOMER REVIEWS (သုံးစွဲသူများ၏ လက်တွေ့မှတ်ချက်များ) */}
      {/* ========================================================================= */}
      <div className="mt-12 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-white font-mono-code">4.9 / 5.0</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-semibold font-myanmar">သုံးသပ်ချက်ပေါင်း ၁,၂၈၀+ ခု</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {lang === 'my' ? 'သုံးစွဲသူများ၏ အမှန်တကယ် မှတ်ချက်များနှင့် သုံးသပ်ချက်များ' : 'Verified Myanmar Customer Reviews'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 self-start sm:self-auto font-myanmar"
          >
            <MessageSquarePlus className="h-4 w-4 text-indigo-400" />
            <span>{lang === 'my' ? 'သုံးသပ်ချက် ရေးသားမည်' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Author Info & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${rev.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {rev.author.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-myanmar">
                        <span>{rev.author}</span>
                        {rev.isVerified && (
                          <span title="Verified Customer" className="text-[10px] text-emerald-400">
                            ✓
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-myanmar truncate max-w-[150px]">
                        {rev.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-myanmar shrink-0">
                    {rev.timeAgo}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] text-amber-300 font-mono-code ml-1">5.0</span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-300 leading-relaxed font-myanmar">
                  "{rev.content}"
                </p>
              </div>

              {/* Card Footer: Verified Badge + Like Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold font-myanmar">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>အတည်ပြုပြီး ဝယ်ယူသူ</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleLikeReview(rev.id)}
                  className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span className="font-mono-code tabular-nums">{rev.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WRITE A REVIEW MODAL                                                      */}
      {/* ========================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono-code">
                  FEEDBACK & REVIEWS
                </span>
                <h3 className="font-display text-lg font-bold text-white font-myanmar">
                  သုံးသပ်ချက် ရေးသားရန်
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewReview} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 font-myanmar">
                  သင့်အမည် သို့မဟုတ် ချန်နယ်အမည်:
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="ဥပမာ- ကိုမင်းခန့် (Channel Owner)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-myanmar"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 font-myanmar">
                  လုပ်ငန်း / ချန်နယ် အမျိုးအစား (စိတ်ကြိုက်):
                </label>
                <input
                  type="text"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="ဥပမာ- Crypto Signals / Online Shop"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-myanmar"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 font-myanmar">
                  ပေးလိုသော ကြယ်ပွင့် အရေအတွက်:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 font-mono-code ml-2">
                    {newReviewRating} Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 font-myanmar">
                  သုံးသပ်ချက် မှတ်ချက်:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="စတစ်ကာ နှင့် Telegram Booster ဝန်ဆောင်မှုအပေါ် သင်၏ အတွေ့အကြုံကို ရေးသားပါ..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-myanmar resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95 font-myanmar"
              >
                သုံးသပ်ချက် တင်သွင်းမည်
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal (Wave Pay / AYA Pay 09779944100) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-myanmar">
                  {lang === 'my' ? 'ငွေပေးချေမှု အချက်အလက်' : 'Payment Details'}
                </span>
                <h3 className="font-display text-xl font-bold text-white font-myanmar">
                  {t.paymentModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Choose Package in Modal */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 font-myanmar">
                {t.selectPackage}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BOOST_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedPlan.id === plan.id
                        ? 'border-indigo-500 bg-indigo-950/60 ring-1 ring-indigo-500 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{plan.nameEn.split(' ')[0]}</span>
                    <span className="block text-xs font-mono-code text-amber-400 tabular-nums">
                      {plan.priceMMK.toLocaleString()} K
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 font-myanmar">
                {lang === 'my' ? 'ငွေပေးချေမည့် App ရွေးပါ' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wave')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedMethod === 'wave'
                      ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="h-8 w-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-xs">
                    Wave
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-white">Wave Pay</span>
                    <span className="text-[10px] text-slate-400 font-mono-code">09779944100</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('aya')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedMethod === 'aya'
                      ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="h-8 w-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">
                    AYA
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-white">AYA Pay</span>
                    <span className="text-[10px] text-slate-400 font-mono-code">09779944100</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-myanmar">{t.payToAccount}:</span>
                <span className="text-white font-bold font-myanmar">{t.accountName}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 p-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">
                    Phone Number
                  </span>
                  <span className="text-base font-mono-code font-bold text-amber-300">
                    09779944100
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  {copiedNumber ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedNumber ? t.numberCopied : t.copyNumberBtn}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-myanmar">လွှဲရမည့် ပမာဏ:</span>
                <span className="text-emerald-400 font-mono-code font-bold text-sm tabular-nums">
                  {selectedPlan.priceMMK.toLocaleString()} MMK
                </span>
              </div>
            </div>

            {/* Transaction Verification Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1 font-myanmar">
                  {t.enterTxId}
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 981245 or 09xxxxxxxxx"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono-code"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1 font-myanmar">
                  {t.uploadSlip}
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-2.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-slate-200 cursor-pointer transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>{slipImage ? (lang === 'my' ? 'ပြေစာ ရွေးချယ်ပြီး' : 'Slip Attached') : (lang === 'my' ? 'ပြေစာ ဓာတ်ပုံရွေးပါ' : 'Select Screenshot')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Confirm Payment Action */}
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isVerifyingPayment}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 disabled:opacity-50 font-myanmar"
            >
              {isVerifyingPayment ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>{t.verifyingPayment}</span>
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  <span>{t.confirmPaymentBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
