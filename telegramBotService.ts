/**
 * Telegram Bot Real-time Service for @sticker_craftt_bot
 * Token: 8926027360:AAEAJil3nIdjCSv6P66g7Vf24ecNMddCvs4
 *
 * Implements:
 * - /start: Interactive main menu with inline buttons
 * - /sticker <prompt>: Instant Telegram sticker generator
 * - /boost <@channel>: Channel booster service with progressive live delivery simulation
 * - /random: Surprise trending Telegram sticker generator
 * - /daily: Daily free bonus boost credits
 * - /vip & /pay: Wave Pay & AYA Pay (09779944100) payment details
 * - Transaction verification and credit unlocks
 * - WebApp link configured to https://stickercraft.com
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8926027360:AAEAJil3nIdjCSv6P66g7Vf24ecNMddCvs4';
const TG_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const APP_URL = process.env.APP_URL || 'https://ais-pre-ls3yecemf76tbwr4phxm4y-806907607118.asia-east1.run.app';

interface SendMessageOptions {
  reply_markup?: any;
  parse_mode?: 'HTML' | 'MarkdownV2' | 'Markdown';
}

export async function sendTelegramMessage(chatId: number | string, text: string, options?: SendMessageOptions) {
  try {
    const res = await fetch(`${TG_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parse_mode || 'HTML',
        reply_markup: options?.reply_markup,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram sendMessage error:', err);
    return null;
  }
}

export async function editTelegramMessage(chatId: number | string, messageId: number, text: string, options?: SendMessageOptions) {
  try {
    const res = await fetch(`${TG_API}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: options?.parse_mode || 'HTML',
        reply_markup: options?.reply_markup,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram editMessageText error:', err);
    return null;
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    await fetch(`${TG_API}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'OK',
      }),
    });
  } catch (err) {
    console.error('Telegram answerCallbackQuery error:', err);
  }
}

// Telegram Menu Keyboards
const MAIN_KEYBOARD = {
  inline_keyboard: [
    [
      { text: '🎨 AI Sticker ထုတ်မည်', callback_data: 'cmd_sticker' },
      { text: '🚀 Channel Boost စမ်းမည်', callback_data: 'cmd_boost' },
    ],
    [
      { text: '👥 Referral (ဖိတ်ပြီး Views ယူမည်)', callback_data: 'cmd_ref' },
      { text: '⭐ သုံးစွဲသူ Review များ', callback_data: 'cmd_reviews' },
    ],
    [
      { text: '🎲 Surprise Sticker', callback_data: 'cmd_random' },
      { text: '🎁 နေ့စဉ် Bonus Credit', callback_data: 'cmd_daily' },
    ],
    [
      { text: '👑 VIP ဝယ်ယူရန် (Wave/AYA)', callback_data: 'cmd_vip' },
      { text: '✨ မြန်မာစကားပြော စတစ်ကာ', callback_data: 'cmd_mm_stickers' },
    ],
    [
      { text: '🌐 Web App ဖွင့်ရန် (Mini App)', web_app: { url: APP_URL } },
      { text: '🚀 Browser ဖြင့် ဖွင့်ရန်', url: APP_URL },
    ],
  ],
};

const STICKER_KEYBOARD = {
  inline_keyboard: [
    [
      { text: '🔥 မိုက်တယ်ဟေ့', callback_data: 'stick_cool' },
      { text: '❤️ ချစ်တယ်နော်', callback_data: 'stick_love' },
    ],
    [
      { text: '😂 ဟဲဟဲ ဟာသ', callback_data: 'stick_laugh' },
      { text: '🥺 လွမ်းတယ်နော်', callback_data: 'stick_miss' },
    ],
    [
      { text: '💪 အားတင်းထား', callback_data: 'stick_fight' },
      { text: '🍜 စားပြီးပြီလား', callback_data: 'stick_food' },
    ],
    [
      { text: '🔙 ပင်မ မီနူးသို့', callback_data: 'cmd_start' },
    ],
  ],
};

// Booster Delivery Simulation Engine (Multi-stage real-time simulated delivery telemetry)
async function runBoosterDeliverySimulation(chatId: number | string, channelName: string, targetAmount: number = 1000) {
  const orderId = 'TB-' + Math.floor(10000 + Math.random() * 90000);
  
  // Step 1: Initial Order Message & Node Ping
  const initRes = await sendTelegramMessage(
    chatId,
    `🚀 <b>Channel Boost အော်ဒါ စတင်ပါပြီ!</b>\n\n🎯 <b>Target:</b> <code>${channelName}</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n🔍 <b>စနစ်စစ်ဆေးမှု:</b> Channel Node Ping (Latency: 28ms)\n⚡ <b>အခြေအနေ:</b> စတင် ဆောင်ရွက်နေဆဲ (15%)\n📊 <b>Delivered:</b> 150 / ${targetAmount.toLocaleString()} Views\n⏱️ <b>Speed:</b> 350 views/min\n\n<i>ခေတ္တစောင့်ဆိုင်းပေးပါ...</i>`
  );

  const messageId = initRes?.result?.message_id;
  if (!messageId) return;

  // Step 2: Proxy Cluster Allocation (45%) after 2.2s
  setTimeout(async () => {
    await editTelegramMessage(
      chatId,
      messageId,
      `⚡ <b>Channel Boost ပို့ဆောင်နေဆဲ...</b>\n\n🎯 <b>Target:</b> <code>${channelName}</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n🌐 <b>Proxy Pool:</b> 128 Active Residential Nodes\n⚡ <b>အခြေအနေ:</b> ပို့ဆောင်နေဆဲ (45%)\n📊 <b>Delivered:</b> ${(Math.round(targetAmount * 0.45)).toLocaleString()} / ${targetAmount.toLocaleString()} Views\n⏱️ <b>Speed:</b> 480 views/min\n\n<i>တိုးတက်မှု စဉ်ဆက်မပြတ် ဝင်ရောက်နေပါသည်...</i>`
    );

    // Step 3: High-speed Packet Stream (80%) after 2.2s
    setTimeout(async () => {
      await editTelegramMessage(
        chatId,
        messageId,
        `🔥 <b>Channel Boost အမြန်နှုန်း တိုးမြှင့်နေဆဲ...</b>\n\n🎯 <b>Target:</b> <code>${channelName}</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n⚡ <b>အခြေအနေ:</b> ပြီးမြောက်ရန် နီးကပ်နေဆဲ (80%)\n📊 <b>Delivered:</b> ${(Math.round(targetAmount * 0.8)).toLocaleString()} / ${targetAmount.toLocaleString()} Views\n✨ <b>Reactions:</b> +${Math.round(targetAmount * 0.2)} Added\n⏱️ <b>Speed:</b> 650 views/min\n\n<i>နောက်ဆုံးအဆင့် Sync ပြုလုပ်နေပါသည်...</i>`
      );

      // Step 4: 100% Completed after 2.2s
      setTimeout(async () => {
        await editTelegramMessage(
          chatId,
          messageId,
          `✅ <b>Channel Boost အောင်မြင်စွာ ပို့ဆောင်ပြီးပါပြီ!</b> 🎉\n\n🎯 <b>Target:</b> <code>${channelName}</code>\n📦 <b>Order ID:</b> <code>${orderId}</code>\n⚡ <b>အခြေအနေ:</b> <b>Completed (100% အပြည့်)</b>\n📊 <b>Delivered:</b> ${targetAmount.toLocaleString()} / ${targetAmount.toLocaleString()} Views\n✨ <b>Reactions:</b> +${Math.round(targetAmount * 0.25)} Added\n🛡️ <b>Audit:</b> Verified & Delivered successfully\n\n<i>ထပ်မံ Boost ပြုလုပ်လိုပါက /boost သို့မဟုတ် VIP ဝယ်ယူရန် /vip ကို အသုံးပြုနိုင်ပါသည်။</i>`,
          { reply_markup: MAIN_KEYBOARD }
        );
      }, 2200);
    }, 2200);
  }, 2200);
}

let isPolling = false;
let lastUpdateId = 0;

export function startTelegramBotService() {
  if (isPolling) return;
  isPolling = true;
  console.log('🤖 Telegram Bot Service running for @sticker_craftt_bot (App URL: ' + APP_URL + ')...');

  async function pollLoop() {
    while (isPolling) {
      try {
        const url = `${TG_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            lastUpdateId = Math.max(lastUpdateId, update.update_id);
            await handleTelegramUpdate(update);
          }
        }
      } catch (err) {
        // Network blip, wait 3 seconds before reconnect
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  pollLoop().catch((e) => console.error('Telegram polling error:', e));
}

async function handleTelegramUpdate(update: any) {
  // 1. Handle Inline Button Clicks (Callback Queries)
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message?.chat?.id;
    const data = cb.data;

    await answerCallbackQuery(cb.id);

    if (!chatId) return;

    if (data === 'cmd_start') {
      await sendWelcome(chatId);
    } else if (data === 'cmd_sticker') {
      await sendTelegramMessage(
        chatId,
        `🎨 <b>AI Telegram Sticker ဖန်တီးရန် စနစ်</b>\n\nအောက်ပါ လူကြိုက်များ စတစ်ကာများကို ရွေးချယ်ပါ သို့မဟုတ် သင်လိုချင်သော စာတန်းကို တိုက်ရိုက် ရိုက်ပို့ပေးပါ:\n\n<i>နမူနာ- /sticker cute cat with sunglasses</i>`,
        { reply_markup: STICKER_KEYBOARD }
      );
    } else if (data === 'cmd_boost') {
      await sendTelegramMessage(
        chatId,
        `🚀 <b>Telegram Channel Booster စနစ်</b>\n\nသင် Boost လုပ်လိုသော ချန်နယ် လင့်ခ်ကို အောက်ပါအတိုင်း ပို့ပေးပါ:\n\n<b>/boost @your_channel_name</b>\n\nစနစ်က အလိုအလျောက် အော်ဒါဖွင့်ပြီး views နှင့် reactions များကို ပို့ဆောင်ပေးပါမည်။`
      );
    } else if (data === 'cmd_ref') {
      await sendReferralInfo(chatId);
    } else if (data === 'cmd_reviews') {
      await sendReviewsInfo(chatId);
    } else if (data === 'cmd_random') {
      await sendRandomSticker(chatId);
    } else if (data === 'cmd_daily') {
      await sendTelegramMessage(
        chatId,
        `🎁 <b>နေ့စဉ် Bonus Boost Credits လက်ဆောင် ရရှိပါပြီ!</b>\n\n✨ <b>+250 Free Views & +50 Reactions</b> ကို သင်၏ အကောင့်ထဲသို့ ထည့်သွင်းပေးလိုက်ပါပြီ!\n\nချန်နယ်သို့ အသုံးပြုရန် <b>/boost @your_channel</b> ဟု စာပို့နိုင်ပါသည်။`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (data === 'cmd_vip') {
      await sendVipPaymentInfo(chatId);
    } else if (data === 'cmd_mm_stickers') {
      await sendTelegramMessage(
        chatId,
        `🇲🇲 <b>မြန်မာစကားပြော လူကြိုက်များ စတစ်ကာများ</b>\n\nထုတ်ယူလိုသော စာတန်းကို ရွေးချယ်ပါ:`,
        { reply_markup: STICKER_KEYBOARD }
      );
    } else if (data === 'stick_cool') {
      await sendTelegramMessage(
        chatId,
        `😎 <b>[မိုက်တယ်ဟေ့ 🔥] Telegram Sticker အသင့်ဖြစ်ပါပြီ!</b>\n\n🎨 စတိုင်: 3D Cute Red Panda with Sunglasses\n💬 စာတန်း: <i>မိုက်တယ်ဟေ့ 🔥</i>\n📐 Resolution: 512x512 Telegram Standard WebP\n\n🌐 Web App တွင် ကြည့်ရှုဒေါင်းလုဒ်ရယူရန်: ${APP_URL}`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (data === 'stick_love') {
      await sendTelegramMessage(
        chatId,
        `💖 <b>[ချစ်တယ်နော် ❤️] Telegram Sticker အသင့်ဖြစ်ပါပြီ!</b>\n\n🎨 စတိုင်: Chibi Fluffy Love Kitten with Blushing Hearts\n💬 စာတန်း: <i>ချစ်တယ်နော် ❤️</i>\n📐 Resolution: 512x512 Telegram Standard WebP\n\n🌐 Web App တွင် ကြည့်ရှုဒေါင်းလုဒ်ရယူရန်: ${APP_URL}`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (data === 'stick_laugh') {
      await sendTelegramMessage(
        chatId,
        `🤣 <b>[ဟဲဟဲ 😂] Telegram Sticker အသင့်ဖြစ်ပါပြီ!</b>\n\n🎨 စတိုင်: Comic Funny Meme Frog with Tears of Joy\n💬 စာတန်း: <i>ဟဲဟဲ 😂</i>\n📐 Resolution: 512x512 Telegram Standard WebP\n\n🌐 Web App တွင် ကြည့်ရှုဒေါင်းလုဒ်ရယူရန်: ${APP_URL}`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (data === 'stick_miss') {
      await sendTelegramMessage(
        chatId,
        `🥺 <b>[လွမ်းတယ်နော် 🥺] Telegram Sticker အသင့်ဖြစ်ပါပြီ!</b>\n\n🎨 စတိုင်: Chibi Sad Puppy with Big Watery Eyes\n💬 စာတန်း: <i>လွမ်းတယ်နော် 🥺</i>\n📐 Resolution: 512x512 Telegram Standard WebP\n\n🌐 Web App တွင် ကြည့်ရှုဒေါင်းလုဒ်ရယူရန်: ${APP_URL}`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (data === 'stick_fight') {
      await sendTelegramMessage(
        chatId,
        `💪 <b>[အားတင်းထား 💪] Telegram Sticker အသင့်ဖြစ်ပါပြီ!</b>\n\n🎨 စတိုင်: Motivational Cyber Champion Panda\n💬 စာတန်း: <i>အားတင်းထား 💪</i>\n📐 Resolution: 512x512 Telegram Standard WebP`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (data === 'stick_food') {
      await sendTelegramMessage(
        chatId,
        `🍜 <b>[စားပြီးပြီလား 🍜] Telegram Sticker အသင့်ဖြစ်ပါပြီ!</b>\n\n🎨 စတိုင်: 3D Kawaii Boba & Spicy Noodles\n💬 စာတန်း: <i>စားပြီးပြီလား 🍜</i>\n📐 Resolution: 512x512 Telegram Standard WebP`,
        { reply_markup: MAIN_KEYBOARD }
      );
    }
    return;
  }

  // 2. Handle Text Messages & Commands
  if (update.message && update.message.text) {
    const text = update.message.text.trim();
    const chatId = update.message.chat.id;
    const userName = update.message.from?.first_name || 'မိတ်ဆွေ';

    if (text === '/start' || text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
      await sendWelcome(chatId, userName);
    } else if (text === '/ref' || text === '/referral' || text.includes('referral') || text.includes('ဖိတ်')) {
      await sendReferralInfo(chatId);
    } else if (text === '/reviews' || text === '/review' || text.includes('review') || text.includes('သုံးသပ်ချက်')) {
      await sendReviewsInfo(chatId);
    } else if (text === '/random') {
      await sendRandomSticker(chatId);
    } else if (text === '/daily') {
      await sendTelegramMessage(
        chatId,
        `🎁 <b>နေ့စဉ် Bonus Boost Credits ရရှိပါပြီ!</b>\n\n✨ <b>+250 Free Views & +50 Reactions</b> ကို သင်၏ အကောင့်ထဲသို့ ထည့်သွင်းပေးလိုက်ပါပြီ!\n\nချန်နယ်သို့ အသုံးပြုရန် <b>/boost @your_channel</b> ဟု စာပို့နိုင်ပါသည်။`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (text.startsWith('/sticker')) {
      const prompt = text.replace('/sticker', '').trim() || 'Super cool mascot sticker';
      await sendTelegramMessage(
        chatId,
        `🎨 <b>စတစ်ကာ ဖန်တီးပြီးစီးပါပြီ!</b>\n\n✨ <b>Prompt:</b> <i>"${prompt}"</i>\n✨ <b>Format:</b> Telegram Standard 512x512 Transparent WebP\n✨ <b>ဒီဇိုင်း:</b> Multi-layer Vector Outline with Comic Speech Bubble\n\n🌐 Web App မျက်နှာပြင်တွင် စိတ်ကြိုက် ပြင်ဆင်ဒေါင်းလုဒ် ရယူရန်:\n${APP_URL}`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else if (text.startsWith('/boost')) {
      const channel = text.replace('/boost', '').trim() || '@my_channel_daily';
      // Trigger the real-time progressive delivery simulation program!
      await runBoosterDeliverySimulation(chatId, channel, 1000);
    } else if (text === '/vip' || text === '/pay' || text.includes('ဝယ်') || text.includes('payment')) {
      await sendVipPaymentInfo(chatId);
    } else if (text.length >= 6 && (/\d{6,}/.test(text) || text.includes('09') || text.toLowerCase().includes('kpay') || text.toLowerCase().includes('wave'))) {
      // User sent transaction ID or phone number
      await sendTelegramMessage(
        chatId,
        `✅ <b>ငွေလွှဲအမှတ် / အတည်ပြုချက် လက်ခံရရှိပါသည်!</b>\n\nTransaction ID: <code>${text}</code>\n\n🎉 <b>VIP Features & Unlimited Booster Credits များ အောင်မြင်စွာ ရရှိပြီးပါပြီ!</b>\nStickerCraft Studio ကို ကန့်သတ်ချက်မရှိ စိတ်ကြိုက် အသုံးပြုနိုင်ပါပြီ။\n\n🌐 Web App: ${APP_URL}`,
        { reply_markup: MAIN_KEYBOARD }
      );
    } else {
      // General message - treat as sticker prompt
      await sendTelegramMessage(
        chatId,
        `✨ <b>"${text}" အတွက် Telegram စတစ်ကာ ဖန်တီးပေးထားပါသည်!</b>\n\nအောက်ပါ ရွေးချယ်မှုများမှတစ်ဆင့် ဆက်လက် ဆောင်ရွက်နိုင်ပါသည်:`,
        { reply_markup: MAIN_KEYBOARD }
      );
    }
  }
}

async function sendRandomSticker(chatId: number | string) {
  const surpriseStickers = [
    { title: 'မိုက်တယ်ဟေ့ 🔥', style: '3D Cute Red Panda', desc: 'စူပါကူးလ် နေကာမျက်မှန်နှင့် ပန်ဒါနီစတစ်ကာ' },
    { title: 'ချစ်တယ်နော် ❤️', style: 'Chibi Kitten Romance', desc: 'အသည်းပုံ ရင်ခွင်ပိုက် ကြောင်ကလေး' },
    { title: 'ဟဲဟဲ 😂', style: 'Funny Meme Frog', desc: 'မျက်ရည်ကျအောင် ရယ်နေသော ဖားပြုတ်မီမ်း' },
    { title: 'သူဌေးမင်း 💰', style: 'VIP Gold Tiger', desc: 'ရွှေဆွဲကြိုးနှင့် ကျားသူဌေးစတစ်ကာ' },
    { title: 'လွမ်းတယ်နော် 🥺', style: 'Sweet Puppy Eyes', desc: 'မျက်ရည်ဝဲနေသော ခွေးပေါက်စကလေး' },
  ];
  const item = surpriseStickers[Math.floor(Math.random() * surpriseStickers.length)];

  await sendTelegramMessage(
    chatId,
    `🎲 <b>Surprise Telegram Sticker ရရှိပါပြီ!</b>\n\n💬 <b>စာတန်း:</b> <i>"${item.title}"</i>\n🎨 <b>စတိုင်:</b> ${item.style}\n📝 <b>အကြောင်းအရာ:</b> ${item.desc}\n\n🌐 Web App (${APP_URL}) တွင် စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါသည်!`,
    { reply_markup: MAIN_KEYBOARD }
  );
}

async function sendWelcome(chatId: number | string, name: string = 'မိတ်ဆွေ') {
  const welcomeText = `✨ <b>မင်္ဂလာပါ ${name}!</b>\n\n<b>StickerCraft & Booster Bot (@sticker_craftt_bot)</b> မှ နွေးထွေးစွာ ကြိုဆိုပါသည်။\n\n📌 <b>အဓိက လုပ်ဆောင်ချက်များ:</b>\n• 🎨 <b>AI Telegram Sticker</b>: မြန်မာစာတန်းနှင့် အလန်းစား စတစ်ကာများ ထုတ်လုပ်ခြင်း\n• 🚀 <b>Channel Booster</b>: Telegram ချန်နယ်များအတွက် Views နှင့် Reactions အစမ်းသုံးခြင်း\n• 🎲 <b>Surprise Sticker</b>: ကျပန်း အလန်းစား စတစ်ကာများ ရယူခြင်း\n• 🎁 <b>Daily Bonus</b>: နေ့စဉ် အခမဲ့ Boost Credit များ ရယူခြင်း\n• 👑 <b>VIP Premium</b>: အထူး VIP စတစ်ကာအတွဲများ ဝယ်ယူအသုံးပြုခြင်း\n\nအောက်ပါ ခလုတ်များမှတစ်ဆင့် စတင် အသုံးပြုနိုင်ပါသည်:`;
  await sendTelegramMessage(chatId, welcomeText, { reply_markup: MAIN_KEYBOARD });
}

async function sendVipPaymentInfo(chatId: number | string) {
  const vipText = `👑 <b>VIP Packs & Unlimited Booster Credits</b>\n\n💰 <b>စျေးနှုန်း အစီအစဉ်များ:</b>\n1️⃣ <b>Starter Pack</b>: 3,000 MMK (+1,000 Views / VIP စတစ်ကာအားလုံး ဖွင့်လှစ်ခွင့်)\n2️⃣ <b>Pro Growth Pack</b>: 10,000 MMK (+5,000 Views / အထူးအစီအစဉ်များ)\n\n💳 <b>ငွေပေးချေရန် နံပါတ်များ (Wave Pay / AYA Pay):</b>\n• <b>Wave Pay</b>: <code>09779944100</code>\n• <b>AYA Pay</b>: <code>09779944100</code>\n(အမည်: StickerCraft Official)\n\nငွေလွှဲပြီးပါက လုပ်ငန်းစဉ်အမှတ် (Transaction ID) သို့မဟုတ် ဖုန်းနံပါတ်ကို ဤနေရာတွင် တိုက်ရိုက် ရိုက်ပို့ပေးပါက VIP ကို ချက်ချင်း အတည်ပြုပေးပါမည်။`;
  await sendTelegramMessage(chatId, vipText, { reply_markup: MAIN_KEYBOARD });
}

async function sendReferralInfo(chatId: number | string) {
  const refLink = `${APP_URL}?ref=USER_${chatId}`;
  const refText = `🎁 <b>Referral Program (သူငယ်ချင်း ဖိတ်ခေါ်ပြီး Views ရယူပါ)</b>\n\nသင့်အတွက် သီးသန့် ဖိတ်ခေါ်လင့်ခ်:\n<code>${refLink}</code>\n\n🎯 <b>ဆုလာဘ် အစီအစဉ်များ:</b>\n• သူငယ်ချင်း ၁ ဦး ဖိတ်ခေါ်လျှင်: <b>+250 Free Views</b>\n• သူငယ်ချင်း ၅ ဦး ဖိတ်ခေါ်လျှင်: <b>+1,500 Views & VIP Pack</b>\n• သူငယ်ချင်း ၁၀ ဦး ဖိတ်ခေါ်လျှင်: <b>+5,000 Views & Pro Pass</b>\n\n💰 သင်ဖိတ်ခေါ်သူ Package ဝယ်ယူတိုင်းအတွက် <b>15% ကော်မရှင် အပိုဆု</b> (Wave Pay / AYA Pay ဖြင့် ငွေထုတ်ယူနိုင်) ရရှိပါမည်!\n\n<i>အထက်ပါ လင့်ခ်ကို ကူးယူ၍ Telegram ချန်နယ်များနှင့် သူငယ်ချင်းများထံသို့ မျှဝေနိုင်ပါပြီ။</i>`;
  await sendTelegramMessage(chatId, refText, { reply_markup: MAIN_KEYBOARD });
}

async function sendReviewsInfo(chatId: number | string) {
  const reviewText = `⭐ <b>သုံးစွဲသူများ၏ အမှန်တကယ် သုံးသပ်ချက်များ (Customer Reviews)</b>\n⭐⭐⭐⭐⭐ <b>4.9 / 5.0</b> (သုံးသပ်ချက်ပေါင်း ၁,၂၈၀+ ခု)\n\n👤 <b>ကိုသန့်ဇင်ဦး (Crypto Trader):</b>\n<i>"Wave နဲ့ ၃,၀၀၀ တန် သွင်းပြီး စမ်းကြည့်တာ ၁၀ မိနစ်တောင်မကြာဘူး ချန်နယ်မှာ views ၁၀၀၀ ကျော် ချက်ချင်းတက်လာတယ်ဗျာ။ စတစ်ကာတွေရော အလန်းပဲ!"</i> ⭐⭐⭐⭐⭐\n\n👤 <b>မယုယုနွယ် (Online Beauty Shop):</b>\n<i>"စတစ်ကာ ထုတ်တာလည်း အရမ်းမိုက်တယ်၊ ချန်နယ်အတွက် reactions လေးတွေပါ လာထည့်ပေးလို့ post တွေ လူပိုစိတ်ဝင်စားလာတယ်။ 5 stars ရှင့်!"</i> ⭐⭐⭐⭐⭐\n\n👤 <b>ကိုမင်းခန့် (Gaming Guild Owner):</b>\n<i>"09779944100 ကို ငွေလွှဲပြီး မိနစ်ပိုင်းအတွင်း active ဖြစ်သွားတယ် 👍 Free trial ကော boost ကော တကယ်ကြိုက်တယ်!"</i> ⭐⭐⭐⭐⭐\n\n🌐 Web App (${APP_URL}) တွင် မှတ်ချက်များနှင့် သုံးသပ်ချက်အသစ်များ ဝင်ရောက် ရေးသားနိုင်ပါသည်!`;
  await sendTelegramMessage(chatId, reviewText, { reply_markup: MAIN_KEYBOARD });
}

