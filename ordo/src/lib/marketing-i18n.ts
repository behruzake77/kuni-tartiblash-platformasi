import type { Locale } from "@/lib/i18n";

type MDict = Record<string, string>;

const en: MDict = {
  "nav.product": "Product",
  "nav.features": "Features",
  "nav.how": "How it works",
  "nav.pricing": "Pricing",
  "nav.screens": "Screens",
  "nav.openApp": "Open app",
  "nav.getStarted": "Start free",
  "nav.signIn": "Sign in",

  "hero.badge": "Your day, under control",
  "hero.title1": "Take control of",
  "hero.title2": "every day",
  "hero.lead":
    "Ordo is the calm command layer for your day — set priorities, block time, run deep focus, build habits, and close the evening knowing what moved.",
  "hero.cta": "Start free",
  "hero.secondary": "See how it works",
  "hero.kbd": "Add a task, start focus, jump anywhere",

  "product.label": "Product",
  "product.title": "Today, fully in view",
  "product.sub":
    "Priorities, schedule, focus, and habits on one dark, quiet surface.",

  "features.label": "Features",
  "features.title": "Everything you need to run the day",
  "features.sub":
    "Not another endless task list. A single surface to plan, execute, and close.",
  "features.f1.t": "Daily priorities",
  "features.f1.d":
    "Pick the few things that actually matter today. Everything else waits — without guilt.",
  "features.f2.t": "Time blocking",
  "features.f2.d":
    "Shape the day hour by hour. Meetings, deep work, and buffers on one calm timeline.",
  "features.f3.t": "Focus sessions",
  "features.f3.d":
    "Start a timed deep-work block and see real minutes protected — not guessed.",
  "features.f4.t": "Habits that stick",
  "features.f4.d":
    "Morning and evening routines with gentle streaks. Consistency over intensity.",
  "features.f5.t": "Day close review",
  "features.f5.d":
    "End the day in two minutes: what shipped, what slipped, what carries to tomorrow.",
  "features.f6.t": "Smart day assist",
  "features.f6.d":
    "Light AI that helps plan the morning and summarize the evening — never a gimmick.",

  "how.label": "How it works",
  "how.title": "Morning plan. Day control. Clean close.",
  "how.sub":
    "A simple daily loop — from the first coffee to the last checkmark.",
  "how.s1.t": "Plan the morning",
  "how.s1.d":
    "Choose up to three priorities, block your focus windows, and line up habits before the day pulls you.",
  "how.s2.t": "Run the day",
  "how.s2.d":
    "Check off work, start focus timers, and keep the timeline honest as meetings land.",
  "how.s3.t": "Close with clarity",
  "how.s3.d":
    "Two-minute evening review: capture wins, roll unfinished items forward, set tomorrow’s first move.",

  "pricing.label": "Pricing",
  "pricing.title": "Simple pricing for daily use",
  "pricing.sub":
    "Start free. Upgrade when you want longer history, reviews, and smarter day assist.",
  "pricing.free": "Free",
  "pricing.pro": "Pro",
  "pricing.team": "Team",
  "pricing.forever": "forever",
  "pricing.month": "per month",
  "pricing.seat": "per seat / mo",
  "pricing.popular": "Most popular",
  "pricing.freeDesc": "Full day control for one person getting started.",
  "pricing.proDesc": "Deeper control — reviews, insights, and unlimited history.",
  "pricing.teamDesc": "Shared rhythms for small teams who plan the week together.",
  "pricing.ctaFree": "Start free",
  "pricing.ctaPro": "Go Pro",
  "pricing.ctaTeam": "Talk to us",

  "cta.title": "Own tomorrow morning tonight",
  "cta.sub":
    "Join people who stop reacting to the day — and start directing it.",
  "cta.primary": "Plan my day",
  "cta.secondary": "Sign in",

  "footer.tagline":
    "The calm command layer for your day — plan, focus, and close with intention.",
  "footer.rights": "All rights reserved.",
  "footer.loop": "Plan · Focus · Close",
};

const uz: MDict = {
  ...en,
  "nav.product": "Mahsulot",
  "nav.features": "Imkoniyatlar",
  "nav.how": "Qanday ishlaydi",
  "nav.pricing": "Narxlar",
  "nav.screens": "Ekranlar",
  "nav.openApp": "Ilovani ochish",
  "nav.getStarted": "Bepul boshlash",
  "nav.signIn": "Kirish",

  "hero.badge": "Kuningiz nazoratda",
  "hero.title1": "Har bir kunni",
  "hero.title2": "o‘zingiz boshqaring",
  "hero.lead":
    "Ordo — kun uchun tinch buyruq qatlami: prioritetlar, vaqt bloklari, chuqur fokusus, odatlar va kechki yakun.",
  "hero.cta": "Bepul boshlash",
  "hero.secondary": "Qanday ishlashini ko‘rish",
  "hero.kbd": "Vazifa qo‘shing, fokususni boshlang, istalgan joyga o‘ting",

  "product.label": "Mahsulot",
  "product.title": "Bugun — to‘liq ko‘rinishda",
  "product.sub":
    "Prioritet, jadval, fokus va odatlar — bitta qorong‘u, tinch sathda.",

  "features.label": "Imkoniyatlar",
  "features.title": "Kunni boshqarish uchun hamma narsa",
  "features.sub":
    "Yana bir cheksiz vazifa ro‘yxati emas. Rejalashtirish, bajarish va yakunlash uchun bitta sath.",
  "features.f1.t": "Kundalik prioritetlar",
  "features.f1.d":
    "Bugun haqiqatan muhim bo‘lgan bir necha ishni tanlang. Qolgani kutadi — aybsiz.",
  "features.f2.t": "Vaqt bloklari",
  "features.f2.d":
    "Kunni soatma-soat shakllantiring. Uchrashuv, chuqur ish va bufer — bitta tinch timeline’da.",
  "features.f3.t": "Fokus sessiyalari",
  "features.f3.d":
    "Vaqtli chuqur ish blokini boshlang va himoyalangan daqiqalarni ko‘ring.",
  "features.f4.t": "Yopishadigan odatlar",
  "features.f4.d":
    "Ertalab va kechki ritualar, yumshoq seriyalar. Intensivlik emas — izchillik.",
  "features.f5.t": "Kun yakuni",
  "features.f5.d":
    "Ikki daqiqada yakun: nima bo‘ldi, nima qoldi, ertaga nima birinchi.",
  "features.f6.t": "Aqlli yordamchi",
  "features.f6.d":
    "Ertalabki reja va kechki xulosa uchun yengil AI — hech qachon shou emas.",

  "how.label": "Qanday ishlaydi",
  "how.title": "Ertalab reja. Kun nazorati. Tiniq yakun.",
  "how.sub":
    "Oddiy kundalik sikl — birinchi qahvadan oxirgi belgigacha.",
  "how.s1.t": "Ertalabni rejalashtiring",
  "how.s1.d":
    "Uchta prioritetgacha tanlang, fokus oynalarini bloklang, odatlarni safga turing.",
  "how.s2.t": "Kunni boshqaring",
  "how.s2.d":
    "Ishlarni belgilang, fokus taymerini boshlang, jadvalni rost tuting.",
  "how.s3.t": "Aniqlik bilan yoping",
  "how.s3.d":
    "Ikki daqiqalik kechki sharh: yutuqlar, qolganlar, ertangi birinchi qadam.",

  "pricing.label": "Narxlar",
  "pricing.title": "Kundalik foyda uchun oddiy narx",
  "pricing.sub":
    "Bepul boshlang. Uzun tarix, sharhlar va aqlli yordam kerak bo‘lsa — yangilang.",
  "pricing.free": "Bepul",
  "pricing.pro": "Pro",
  "pricing.team": "Jamoa",
  "pricing.forever": "abadiy",
  "pricing.month": "oyiga",
  "pricing.seat": "o‘rin / oy",
  "pricing.popular": "Eng mashhur",
  "pricing.freeDesc": "Bitta odam uchun to‘liq kun nazorati.",
  "pricing.proDesc": "Chuqurroq nazorat — sharhlar, tahlil, cheksiz tarix.",
  "pricing.teamDesc": "Haftani birga rejalashtiradigan kichik jamoalar uchun.",
  "pricing.ctaFree": "Bepul boshlash",
  "pricing.ctaPro": "Pro olish",
  "pricing.ctaTeam": "Bog‘lanish",

  "cta.title": "Ertangi tongni bugun egallang",
  "cta.sub":
    "Kunga reaktsiya qilishni to‘xtatib, uni boshqaradiganlar qatoriga qo‘shiling.",
  "cta.primary": "Kunimni rejalashtirish",
  "cta.secondary": "Kirish",

  "footer.tagline":
    "Kun uchun tinch buyruq qatlami — reja, fokus va yakun.",
  "footer.rights": "Barcha huquqlar himoyalangan.",
  "footer.loop": "Reja · Fokus · Yakun",
};

const ru: MDict = {
  ...en,
  "nav.product": "Продукт",
  "nav.features": "Возможности",
  "nav.how": "Как это работает",
  "nav.pricing": "Цены",
  "nav.screens": "Экраны",
  "nav.openApp": "Открыть приложение",
  "nav.getStarted": "Начать бесплатно",
  "nav.signIn": "Войти",

  "hero.badge": "Ваш день под контролем",
  "hero.title1": "Возьмите контроль над",
  "hero.title2": "каждым днём",
  "hero.lead":
    "Ordo — спокойный командный слой дня: приоритеты, тайм-блоки, глубокий фокус, привычки и вечерний обзор.",
  "hero.cta": "Начать бесплатно",
  "hero.secondary": "Как это работает",
  "hero.kbd": "Добавить задачу, начать фокус, перейти куда угодно",

  "product.label": "Продукт",
  "product.title": "Сегодня — полностью в поле зрения",
  "product.sub":
    "Приоритеты, расписание, фокус и привычки на одной тёмной, тихой поверхности.",

  "features.label": "Возможности",
  "features.title": "Всё, чтобы вести день",
  "features.sub":
    "Не ещё один бесконечный список задач. Одна поверхность для плана, исполнения и закрытия.",
  "features.f1.t": "Ежедневные приоритеты",
  "features.f1.d":
    "Выберите немногое, что правда важно сегодня. Остальное подождёт — без вины.",
  "features.f2.t": "Тайм-блоки",
  "features.f2.d":
    "Соберите день по часам. Встречи, deep work и буферы — на одной спокойной шкале.",
  "features.f3.t": "Фокус-сессии",
  "features.f3.d":
    "Запустите timed deep-work и видьте реальные защищённые минуты.",
  "features.f4.t": "Привычки, которые держатся",
  "features.f4.d":
    "Утренние и вечерние ритуалы с мягкими сериями. Постоянство важнее интенсивности.",
  "features.f5.t": "Итог дня",
  "features.f5.d":
    "Закройте день за две минуты: что сдвинулось, что нет, что переходит на завтра.",
  "features.f6.t": "Умный помощник",
  "features.f6.d":
    "Лёгкий ИИ для утреннего плана и вечернего саммари — без трюков.",

  "how.label": "Как это работает",
  "how.title": "Утренний план. Контроль дня. Чистое закрытие.",
  "how.sub": "Простой дневной цикл — от первого кофе до последней галочки.",
  "how.s1.t": "Спланируйте утро",
  "how.s1.d":
    "Выберите до трёх приоритетов, заблокируйте окна фокуса, выстройте привычки.",
  "how.s2.t": "Ведите день",
  "how.s2.d":
    "Отмечайте дела, запускайте таймеры, держите timeline честным.",
  "how.s3.t": "Закройте с ясностью",
  "how.s3.d":
    "Двухминутный вечерний обзор: победы, остатки, первый шаг завтра.",

  "pricing.label": "Цены",
  "pricing.title": "Простые цены для ежедневного использования",
  "pricing.sub":
    "Начните бесплатно. Обновитесь, когда нужна длинная история, обзоры и умный ассистент.",
  "pricing.free": "Бесплатно",
  "pricing.pro": "Pro",
  "pricing.team": "Команда",
  "pricing.forever": "навсегда",
  "pricing.month": "в месяц",
  "pricing.seat": "место / мес",
  "pricing.popular": "Популярный",
  "pricing.freeDesc": "Полный контроль дня для одного человека.",
  "pricing.proDesc": "Глубже: обзоры, аналитика и безлимитная история.",
  "pricing.teamDesc": "Общие ритмы для небольших команд.",
  "pricing.ctaFree": "Начать бесплатно",
  "pricing.ctaPro": "Взять Pro",
  "pricing.ctaTeam": "Связаться",

  "cta.title": "Завладейте завтрашним утром сегодня",
  "cta.sub":
    "Присоединяйтесь к тем, кто перестал реагировать на день — и начал им управлять.",
  "cta.primary": "Спланировать день",
  "cta.secondary": "Войти",

  "footer.tagline":
    "Спокойный командный слой дня — план, фокус и закрытие.",
  "footer.rights": "Все права защищены.",
  "footer.loop": "План · Фокус · Итог",
};

const DICTS: Record<Locale, MDict> = { en, uz, ru };

export function mt(locale: Locale, key: string): string {
  return DICTS[locale]?.[key] ?? en[key] ?? key;
}
