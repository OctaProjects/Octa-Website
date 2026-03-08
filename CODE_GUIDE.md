# Octa Website – Code Guide / دليل الكود

**English | العربية**

---

## Project Structure / هيكل المشروع

```
src/
├── main.jsx          # Entry point / نقطة الدخول
├── App.jsx           # Main app & routing / التطبيق الرئيسي والتوجيه
├── styles.css        # Global styles / الأنماط العامة
├── PartnerPage.jsx   # Partner sign-up page / صفحة التسجيل كشريك
├── DesignPage.jsx    # Creative Design service page / صفحة خدمات التصميم
├── WebDevelopmentPage.jsx  # Web dev service page / صفحة تطوير الويب
├── AboutPage.jsx     # About us & team / صفحة من نحن والفريق
└── assets/           # Images & media / الصور والوسائط
```

---

## main.jsx

| English | العربية |
|---------|---------|
| Renders the React app into `#root` | يعرض تطبيق React داخل العنصر `#root` |
| Imports global CSS | يستورد الأنماط العامة |
| Uses React StrictMode for dev checks | يستخدم StrictMode للتحقق أثناء التطوير |

---

## App.jsx – Main Logic

### Routing (Hash-based) / التوجيه (بناءً على الرابط)

| English | العربية |
|---------|---------|
| `normalizePage(hash)` – Converts URL hash to valid page key | يحول الـ hash في الرابط إلى مفتاح صفحة صالح |
| Allowed pages: home, about, services, contacts, faqs, partner, creative-design, web-development, it-helpdesk | الصفحات المدعومة: الرئيسية، من نحن، الخدمات، اتصل بنا، الأسئلة، الشريك، التصميم، تطوير الويب، الدعم الفني |

### State Variables / متغيرات الحالة

| Variable | English | العربية |
|----------|---------|---------|
| `page` | Current page ID | معرف الصفحة الحالية |
| `showPartner` | Whether Partner page is shown | هل صفحة الشريك معروضة |
| `theme` | 'light' or 'dark' | الوضع الفاتح أو الداكن |
| `isScrolled` | User has scrolled past header | المستخدم قام بالتمرير |
| `mobileMenuOpen` | Mobile nav menu open/closed | قائمة الهاتف مفتوحة/مغلقة |
| `activeSection` | Which section is in view (for nav highlight) | القسم الظاهر (لتمييز الرابط النشط) |
| `scrollProgress` | Scroll progress 0–100% | نسبة التمرير 0–100% |

### Effects (useEffect) / التأثيرات

| Effect | English | العربية |
|--------|---------|---------|
| Hash change | Listens to `hashchange`, updates page | يستمع لتغيير الرابط ويحدّث الصفحة |
| Theme | Applies theme to `<html>`, saves to localStorage | يطبق الثيم على الصفحة ويحفظه |
| Scroll to top | On page change, scroll to top | عند تغيير الصفحة، ي scroll للأعلى |
| Close mobile menu | On page change, close mobile nav | عند تغيير الصفحة، إغلاق القائمة |
| Scroll progress | Updates progress bar on scroll | يحدّث شريط التقدم عند التمرير |
| Section observer | Highlights nav link for visible section | يحدد الرابط النشط حسب القسم الظاهر |
| Arc animation | Sets SVG path length for draw effect | يحدد طول مسار SVG لحركة الرسم |
| Reveal animations | IntersectionObserver for scroll-reveal | يكشف العناصر عند ظهورها بالتمرير |

---

## styles.css – Sections

| Section | English | العربية |
|---------|---------|---------|
| `:root` | CSS variables for colors, theme | متغيرات الألوان والثيم |
| Header | Sticky header, nav, hamburger, theme toggle | الهيدر الثابت، القائمة، القائمة الجانبية، تبديل الثيم |
| Hero | Main hero with arc SVG | القسم الرئيسي مع رسم القوس |
| Sections | Products, Services, Contacts, FAQs | المنتجات، الخدمات، اتصل بنا، الأسئلة |
| Footer | Footer layout and links | تنسيق الفوتر والروابط |
| Responsive | Media queries for mobile/tablet/desktop | استعلامات للجوال والتابلت والديسكتوب |
| Animations | Keyframes for reveal, arc draw, etc. | الحركات للظهور والرسم وغيرها |

---

## Page Components

| Component | English | العربية |
|-----------|---------|---------|
| **PartnerPage** | Partner sign-up form inside arc | نموذج التسجيل كشريك داخل القوس |
| **DesignPage** | Creative design services (UX, Brand, Illustration, Print) | خدمات التصميم (واجهات، هوية، رسوم، طباعة) |
| **WebDevelopmentPage** | Web dev services (Apps, E‑commerce, API, Performance) | تطوير الويب (تطبيقات، تجارة إلكترونية، API، أداء) |
| **AboutPage** | Company story, vision, team grid | قصة الشركة، الرؤية، شبكة الفريق |

---

## CSS Variables (Theme)

| Variable | English | العربية |
|----------|---------|---------|
| `--bg` | Main background | الخلفية الرئيسية |
| `--text` | Primary text color | لون النص الرئيسي |
| `--muted` | Secondary text | النص الثانوي |
| `--primary` | Brand green (accents, arcs) | الأخضر للعلامة (التمييز، الأقواس) |
| `--accent` | CTA buttons, highlights | أزرار الإجراء والتحديد |
| `--panel` | Card/panel background | خلفية البطاقات |
| `--border` | Border color | لون الحدود |

---

## Responsive Breakpoints

| Breakpoint | English | العربية |
|------------|---------|---------|
| 360px | Extra small phones | هواتف صغيرة جداً |
| 480px | Small phones | هواتف صغيرة |
| 520px | Phones, single-column forms | هواتف، نماذج عمود واحد |
| 768px | Tablets, grids collapse | تابلت، انهيار الشبكات |
| 880px | Desktop nav, CTA visible | القائمة الكاملة، زر الشريك ظاهر |
| 980px | Wide layout grids | شبكات العرض العريض |

---

## Common Patterns

### Scroll Reveal

```
English: Elements get .will-reveal and .reveal-up. When they enter viewport, they get .is-visible and animate in.
العربية: العناصر تحصل على .will-reveal و .reveal-up. عند دخولها الشاشة تُضاف .is-visible وتتحرك للداخل.
```

### Arc SVG

```
English: SVG path with stroke-dasharray animation. --arc-len is set via JS from path.getTotalLength().
العربية: مسار SVG مع حركة stroke-dasharray. --arc-len يُحدد عبر JS من path.getTotalLength().
```

### Hash Routing

```
English: No React Router. Uses window.location.hash (#home, #about, etc.) and hashchange event.
العربية: لا يُستخدم React Router. يعتمد على window.location.hash وحادثة hashchange.
```
