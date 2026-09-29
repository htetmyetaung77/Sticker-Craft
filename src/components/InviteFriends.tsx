import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  Send, 
  Users, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Rocket, 
  QrCode, 
  RefreshCw, 
  ArrowRight,
  UserCheck,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';

interface InviteFriendsProps {
  lang: Language;
  freeTrialsRemaining: number;
  onAddFreeTrial: (count?: number) => void;
  onNavigateToBooster: () => void;
  onNavigateToStickers: () => void;
}

interface InvitedFriend {
  id: string;
  name: string;
  avatarBg: string;
  platform: 'telegram' | 'web';
  joinedTime: string;
  status: 'rewarded' | 'pending';
  rewardGiven: string;
}

export const InviteFriends: React.FC<InviteFriendsProps> = ({
  lang,
  freeTrialsRemaining,
  onAddFreeTrial,
  onNavigateToBooster,
  onNavigateToStickers,
}) => {
  // Generate or retrieve persistent user referral code
  const [referralCode, setReferralCode] = useState<string>(() => {
    const saved = localStorage.getItem('stickercraft_user_ref');
    if (saved) return saved;
    const generated = 'STK-' + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('stickercraft_user_ref', generated);
    return generated;
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isSimulatingInvite, setIsSimulatingInvite] = useState(false);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  // App Base URL for referral link
  const appBaseUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-pre-ls3yecemf76tbwr4phxm4y-806907607118.asia-east1.run.app' 
        : window.location.origin) 
    : 'https://ais-pre-ls3yecemf76tbwr4phxm4y-806907607118.asia-east1.run.app';

  const referralLink = `${appBaseUrl}?ref=${referralCode}`;
  const telegramBotRefLink = `https://t.me/sticker_craftt_bot?start=ref_${referralCode}`;

  // Invited friends history
  const [friendsList, setFriendsList] = useState<InvitedFriend[]>([
    {
      id: 'f-1',
      name: 'ကိုသန့်ဇင် (@thant_crypto)',
      avatarBg: 'from-amber-500 to-orange-600',
      platform: 'telegram',
      joinedTime: '၁၀ မိနစ်ခန့်က',
      status: 'rewarded',
      rewardGiven: '+1 Free Trial Credit',
    },
    {
      id: 'f-2',
      name: 'မယုယု (@yuyu_shop_ygn)',
      avatarBg: 'from-pink-500 to-rose-600',
      platform: 'web',
      joinedTime: '၄၅ မိနစ်ခန့်က',
      status: 'rewarded',
      rewardGiven: '+1 Free Trial Credit',
    },
    {
      id: 'f-3',
      name: 'ကိုမင်းခန့် (@minkhant_mlbb)',
      avatarBg: 'from-blue-500 to-indigo-600',
      platform: 'telegram',
      joinedTime: '၂ နာရီခန့်က',
      status: 'rewarded',
      rewardGiven: '+1 Free Trial Credit',
    },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRegenerateCode = () => {
    const newCode = 'STK-' + Math.floor(100000 + Math.random() * 900000);
    setReferralCode(newCode);
    localStorage.setItem('stickercraft_user_ref', newCode);
    confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
  };

  // Simulate friend joining via referral link & rewarding the inviter
  const handleSimulateFriendInvite = () => {
    if (isSimulatingInvite) return;
    setIsSimulatingInvite(true);

    const sampleNames = [
      'ကိုဖြိုးဇော် (@phyo_media)',
      'မအေးသန္တာ (@ayethandar_art)',
      'ကိုကျော်စွာ (@kyaw_channel)',
      'မဆုမြတ် (@su_myat_daily)',
      'ကိုအောင်သူ (@aungthu_trader)',
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomPlatform = Math.random() > 0.5 ? 'telegram' : 'web';

    setTimeout(() => {
      setIsSimulatingInvite(false);

      // Reward inviter with additional free trial credits!
      onAddFreeTrial(1);

      const newFriend: InvitedFriend = {
        id: 'f-' + Date.now(),
        name: randomName,
        avatarBg: 'from-emerald-500 to-teal-600',
        platform: randomPlatform,
        joinedTime: 'ခုနလေးတင်',
        status: 'rewarded',
        rewardGiven: '+1 Free Trial Credit',
      };

      setFriendsList((prev) => [newFriend, ...prev]);

      const toastMsg = lang === 'my'
        ? `🎉 ${randomName} မှ သင်၏ လင့်ခ်ဖြင့် ဝန်ဆောင်မှုကို စတင်သုံးစွဲလိုက်ပါပြီ! သင့်ထံသို့ Free Trial Credit +1 လက်ဆောင် ရရှိပါသည်!`
        : `🎉 ${randomName} used your referral link! You earned +1 Free Trial Credit!`;
      
      setRewardToast(toastMsg);
      setTimeout(() => setRewardToast(null), 6000);

      confetti({
        particleCount: 70,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {rewardToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-slideUp flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Gift className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white font-myanmar">ဆုလာဘ် ရရှိပါပြီ!</h4>
            <p className="text-xs text-slate-300 mt-0.5 font-myanmar leading-relaxed">{rewardToast}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setRewardToast(null)} 
            className="text-slate-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {/* Glow Spheres */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>INVITE & EARN FREE REWARDS</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'my' 
                ? 'သူငယ်ချင်းများကို ဖိတ်ခေါ်ပြီး Free Trial Credits များ အကန့်အသတ်မရှိ ရယူပါ' 
                : 'Invite Friends & Earn Unlimited Free Trial Boost Credits'}
            </h1>

            <p className="text-sm text-slate-300 font-myanmar leading-relaxed">
              {lang === 'my'
                ? 'သင့်အတွက် သီးသန့်ထုတ်ပေးထားသော Referral Link ကို သူငယ်ချင်းများထံ မျှဝေပါ။ သင်ဖိတ်ခေါ်သော သူငယ်ချင်းတစ်ဦး စတင်အသုံးပြုတိုင်း သင့်ထံသို့ Free Trial Credit (+1 ကြိမ် / +1,000 Views တန်ဖိုး) ကို ချက်ချင်း အပိုဆု ရရှိမည် ဖြစ်ပါသည်။'
                : 'Share your personal referral link. Each friend who signs up and tests the app will reward you with +1 Free Trial Credit (valued at 1,000 views) instantly!'}
            </p>
          </div>

          {/* Current Balance & Quick Stats Card */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-5 sm:p-6 shadow-xl space-y-4 shrink-0 lg:w-80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-code">
              သင့်လက်ကျန် ဘောနပ်စ်
            </span>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-mono-code text-3xl font-black text-emerald-400 tabular-nums">
                  {freeTrialsRemaining}
                </span>
                <span className="text-xs text-slate-400 ml-2 font-myanmar">Free Trial ကြိမ်</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300 font-myanmar">
              <div className="flex justify-between">
                <span className="text-slate-400">ဖိတ်ခေါ်ပြီးသူ စုစုပေါင်း:</span>
                <span className="font-bold text-white font-mono-code">{friendsList.length} ဦး</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">အခမဲ့ Views ရရှိမှု:</span>
                <span className="font-bold text-amber-400 font-mono-code">+{friendsList.length * 1000} Views</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToBooster}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 font-myanmar"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Free Trial အသုံးပြုမည်</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Referral Link Box + Rewards Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Link Generator & Sharing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unique Link Box */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Share2 className="h-4 w-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  {lang === 'my' ? 'သင်၏ သီးသန့် Referral Link' : 'Your Unique Referral Link'}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleRegenerateCode}
                title="လင့်ခ် အသစ်ပြန်ထုတ်မည်"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors font-myanmar"
              >
                <RefreshCw className="h-3 w-3" />
                <span>ပြန်လည်ထုတ်ယူမည်</span>
              </button>
            </div>

            {/* Referral Link Input Bar */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-slate-200 font-mono-code select-all overflow-hidden">
                  <span className="text-indigo-400 shrink-0">🔗</span>
                  <span className="truncate">{referralLink}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95 whitespace-nowrap font-myanmar"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">ကူးယူပြီးပါပြီ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Link ကူးယူမည်</span>
                    </>
                  )}
                </button>
              </div>

              {/* Referral Code Box */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                <div className="flex items-center gap-2">
                  <span>Referral Code:</span>
                  <span className="font-mono-code font-bold text-amber-400">{referralCode}</span>
                  <button 
                    type="button" 
                    onClick={handleCopyCode} 
                    className="hover:text-white transition-colors text-[11px]"
                  >
                    {copiedCode ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrCode((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>{showQrCode ? 'QR ဖျောက်မည်' : 'QR Code ကြည့်မည်'}</span>
                </button>
              </div>
            </div>

            {/* QR Code Preview (Optional) */}
            {showQrCode && (
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-center space-y-3 animate-fadeIn">
                <div className="inline-block p-3 rounded-xl bg-white shadow-md">
                  {/* Clean SVG QR Code Representation */}
                  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="140" height="140" fill="white"/>
                    <rect x="10" y="10" width="40" height="40" fill="#0f172a"/>
                    <rect x="18" y="18" width="24" height="24" fill="white"/>
                    <rect x="24" y="24" width="12" height="12" fill="#4f46e5"/>

                    <rect x="90" y="10" width="40" height="40" fill="#0f172a"/>
                    <rect x="98" y="18" width="24" height="24" fill="white"/>
                    <rect x="104" y="24" width="12" height="12" fill="#4f46e5"/>

                    <rect x="10" y="90" width="40" height="40" fill="#0f172a"/>
                    <rect x="18" y="98" width="24" height="24" fill="white"/>
                    <rect x="24" y="104" width="12" height="12" fill="#4f46e5"/>

                    <rect x="60" y="15" width="12" height="12" fill="#0f172a"/>
                    <rect x="60" y="35" width="12" height="12" fill="#4f46e5"/>
                    <rect x="60" y="55" width="12" height="12" fill="#0f172a"/>
                    <rect x="60" y="75" width="12" height="12" fill="#0f172a"/>
                    <rect x="60" y="95" width="12" height="12" fill="#4f46e5"/>
                    <rect x="60" y="115" width="12" height="12" fill="#0f172a"/>

                    <rect x="25" y="60" width="12" height="12" fill="#0f172a"/>
                    <rect x="40" y="60" width="12" height="12" fill="#4f46e5"/>
                    <rect x="80" y="60" width="12" height="12" fill="#0f172a"/>
                    <rect x="100" y="60" width="12" height="12" fill="#0f172a"/>
                    <rect x="120" y="60" width="12" height="12" fill="#4f46e5"/>

                    <rect x="80" y="80" width="16" height="16" fill="#0f172a"/>
                    <rect x="105" y="85" width="16" height="16" fill="#4f46e5"/>
                    <rect x="85" y="105" width="16" height="16" fill="#4f46e5"/>
                    <rect x="110" y="110" width="16" height="16" fill="#0f172a"/>
                  </svg>
                </div>
                <p className="text-xs text-slate-400 font-myanmar">
                  ဖုန်းကင်မရာဖြင့် Scan ဖတ်၍ တိုက်ရိုက် အသုံးပြုနိုင်ပါသည်။
                </p>
              </div>
            )}

            {/* Quick Share Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-myanmar">
                အခြား Social App များသို့ တိုက်ရိုက် Share မည်:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(telegramBotRefLink)}&text=${encodeURIComponent('StickerCraft တွင် AI Telegram Sticker နှင့် Channel Boost အခမဲ့ စမ်းသပ်ရယူပါ!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3 px-4 text-xs font-bold text-white shadow-md shadow-sky-600/20 transition-all active:scale-95 font-myanmar"
                >
                  <Send className="h-4 w-4" />
                  <span>Telegram သို့ Share မည်</span>
                </a>

                <button
                  type="button"
                  onClick={handleSimulateFriendInvite}
                  disabled={isSimulatingInvite}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 py-3 px-4 text-xs font-bold transition-all active:scale-95 font-myanmar disabled:opacity-50"
                >
                  <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span>{isSimulatingInvite ? 'စစ်ဆေးနေပါသည်...' : 'စမ်းသပ်ဖိတ်ခေါ်မှု စမ်းမည် (+1 Free Trial)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reward Tiers System */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span>{lang === 'my' ? 'ဖိတ်ခေါ်မှု ဆုလာဘ် အဆင့်များ' : 'Referral Reward Milestones'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono-code">Tier 1</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    1 Friend
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-myanmar">+1 Free Trial Credit</h4>
                <p className="text-[11px] text-slate-400 font-myanmar">
                  သူငယ်ချင်း ၁ ဦး သုံးစွဲတိုင်း Free Trial +1 ကြိမ် (1,000 Views တန်ဖိုး) ရရှိမည်။
                </p>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>ရရှိပြီး (Active)</span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono-code">Tier 2</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    3 Friends
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-myanmar">+3 Free Trials & VIP</h4>
                <p className="text-[11px] text-slate-400 font-myanmar">
                  သူငယ်ချင်း ၃ ဦးပြည့်ပါက VIP Sticker Pack အားလုံးကို အခမဲ့ ဖွင့်လှစ်ပေးမည်။
                </p>
                <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>ရရှိပြီး (Active)</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 font-mono-code">Tier 3</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    5+ Friends
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-myanmar">15% Cash Commission</h4>
                <p className="text-[11px] text-slate-400 font-myanmar">
                  သူငယ်ချင်း Package ဝယ်ယူတိုင်း Wave/AYA Pay ဖြင့် ငွေထုတ်ယူနိုင်သော ကော်မရှင် ရရှိမည်။
                </p>
                <div className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 pt-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Partner Tier</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Friends Joined Feed & Activity */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" />
                <span>{lang === 'my' ? 'ဖိတ်ခေါ်ထားသော သူငယ်ချင်းများ' : 'Invited Friends History'}</span>
              </h3>
              <span className="font-mono-code text-xs text-emerald-400 font-bold">
                {friendsList.length} Active
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-myanmar">
              သင်၏လင့်ခ်မှတစ်ဆင့် စတင်အသုံးပြုခဲ့ကြသော သူငယ်ချင်းများနှင့် ရရှိခဲ့သော Free Trial Credits များ:
            </p>

            <div className="space-y-3">
              {friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${friend.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                      {friend.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-myanmar">
                        {friend.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="capitalize">{friend.platform === 'telegram' ? '✈️ Telegram' : '🌐 Web App'}</span>
                        <span>·</span>
                        <span>{friend.joinedTime}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono-code">
                    {friend.rewardGiven}
                  </span>
                </div>
              ))}
            </div>

            {/* Test Invite Button */}
            <button
              type="button"
              onClick={handleSimulateFriendInvite}
              disabled={isSimulatingInvite}
              className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 font-myanmar disabled:opacity-50"
            >
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isSimulatingInvite ? 'ဖိတ်ခေါ်နေပါသည်...' : 'စမ်းသပ်ဖိတ်ခေါ်မှု ပြုလုပ်မည် (+1 Free Trial)'}</span>
            </button>
          </div>

          {/* How It Works Explainer */}
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-5 space-y-3 text-xs text-slate-400 font-myanmar">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>စည်းကမ်းသတ်မှတ်ချက်များ</span>
            </h4>
            <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
              <li>ဖိတ်ခေါ်သော သူငယ်ချင်းတိုင်းသည် Telegram Bot သို့မဟုတ် Web App ကို အမှန်တကယ် စမ်းသပ်သုံးစွဲရန် လိုအပ်ပါသည်။</li>
              <li>Free Trial Credits များကို Telegram Booster တွင် အကန့်အသတ်မရှိ တိုက်ရိုက် ထည့်သွင်းအသုံးပြုနိုင်ပါသည်။</li>
              <li>ကော်မရှင်ငွေများကို Wave Pay သို့မဟုတ် AYA Pay နံပါတ် (09779944100) ဖြင့် အချိန်မရွေး ထုတ်ယူနိုင်ပါသည်။</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
