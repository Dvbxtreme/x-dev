import json, re, os, random, sys
from datetime import datetime, timedelta

BLOG_FILE = os.path.join(os.path.dirname(__file__), "blog.html")

# Sprawdzenie czy auto-generacja jest włączona
with open(BLOG_FILE, "r", encoding="utf-8") as f:
    if "Blog jest ręcznie redagowany" in f.read():
        print("Auto-generacja wyłączona – blog jest ręcznie redagowany. Skrypt nie wykona żadnych zmian.")
        sys.exit(0)

TOPICS = [
    ("React 19 – nowe hooki i optymalizacje", "tech", "fas fa-atom", "#61dafb,#2d7cb5",
     "React 19 wprowadza use() hook, lepszy compiler i szybszy reconciler. Co zmieni się w Twoim kodzie?",
     "React 19 to największa aktualizacja od lat. Nowy hook use() pozwala czytać Promises i context bez warunków. Kompilator (React Forget) automatycznie memoizuje komponenty. Server Components stabilne. Actions do formularzy. useOptimistic dla optymistycznych aktualizacji. W X-DEV testujemy już React 19 w nowych projektach."),
    ("Vue 4 – co nowego w ekosystemie?", "tech", "fab fa-vuejs", "#42b883,#35495e",
     "Vue 4 przynosi nowy reactivity system, lepszy TypeScript i szybszy runtime. Sprawdź co się zmienia.",
     "Vue 4 opiera się na nowym silniku reactivity – Vapor Mode, który eliminuje Virtual DOM. Kompilacja do natywnych DOM operacji. Lepsza integracja z TypeScript – typowane emit, props i slots. Nowy router z typowanymi route params. Pinia jako oficjalny state manager. W X-DEV Vue używamy w projektach gdzie liczy się szybki start i czytelność kodu."),
    ("Node.js 24 – przewodnik po nowościach", "tech", "fab fa-node-js", "#339933,#026e00",
     "Node.js 24 wprowadza lepszy ESM, nowe API i wydajniejszy V8. Sprawdź co warto znać.",
     "Node.js 24 z V8 12.0 – nawet 30% szybszy w benchmarkach. Stabilny ESM bez flag eksperymentalnych. New built-in API: node:sql (wbudowane zapytania SQL), node:test (test runner), node:sea (Single Executable Applications). Lepsze wsparcie dla TypeScript przez loadery. W X-DEV Node.js to nasz główny backend runtime."),
    ("ESLint 10 – nowa konfiguracja i flat config", "tech", "fas fa-lint", "#4b32c3,#7c6ad9",
     "ESLint 10 z flat config jako domyślnym. Jak migrować i korzystać z nowych funkcji?",
     "ESLint 10 kończy erę .eslintrc.* – flat config (eslint.config.js) jest teraz domyślny. Szybsze lintowanie dzięki cache'owaniu. Nowe rules: @stylistic (formatowanie), security (bezpieczeństwo). Lepsza integracja z TypeScript. W X-DEV ESLint to standard quality gate w każdym projekcie."),
    ("Sztuczna inteligencja w testowaniu oprogramowania", "ai", "fas fa-flask", "#6c5ce7,#a29bfe",
     "AI zmienia testowanie: automatyczne generowanie testów, self-healing selectory i analiza coverage.",
     "Narzędzia AI do testowania: Applitools (visual testing z AI), Mabl (testy E2E z auto-healing), Testim (generowanie testów z ML). AI potrafi analizować nagrania, generować scenariusze i naprawiać zepsute selectory. W X-DEV używamy AI do generowania testów jednostkowych i E2E – przyspiesza to proces o 60%."),
    ("Web Components – czy wracają do łask?", "webdev", "fas fa-puzzle-piece", "#e34f26,#f06529",
     "Web Components przeżywają renesans dzięki Lit, Stencil i nowym standardom przeglądarkowym.",
     "Web Components to natywny standard – Custom Elements, Shadow DOM, HTML Templates. Frameworki: Lit (Google), Stencil (Ionic), Shoelace (komponenty). Zalety: framework-agnostic, natywne wsparcie, mały bundle. Wady: ograniczone bindingi, brak SSR. W X-DEV używamy Web Components dla widgetów i embeddable komponentów."),
    ("CSS Container Queries – responsywność komponentów", "webdev", "fab fa-css3-alt", "#1572b6,#33a9dc",
     "Container Queries zmieniają responsywność – dostosuj wygląd do rozmiaru kontenera, nie viewporta.",
     "Container Queries (@container) pozwalają stylować komponent na podstawie rozmiaru jego kontenera, a nie viewportu. Idealne dla reusable komponentów. Zastosowanie: karty produktów, dashboardy, grid layouts. @container style() pozwala nawet na query po wartościach CSS. W X-DEV używamy Container Queries w design systemach."),
    ("WebSockets vs SSE vs WebTransport – porównanie", "tech", "fas fa-wifi", "#0984e3,#74b9ff",
     "Trzy technologie real-time w web. Kiedy użyć której? Porównanie latencji, przepustowości i wsparcia.",
     "WebSocket – dwukierunkowy, pełne wsparcie, idealny dla czatów i gier. SSE – jednokierunkowy (server→client), prostszy, auto-reconnect. WebTransport – nowy standard oparty na QUIC, niska latencja, high throughput. Wybór: czat → WebSocket, notyfikacje → SSE, streaming wideo → WebTransport. W X-DEV Xbot używa WebSocketów, a dashboardy SSE."),
    ("PostgreSQL 18 – nowe możliwości", "tech", "fas fa-database", "#336791,#2b5d84",
     "PostgreSQL 18 z lepszym JSON, wektorami i replikacją. Co nowego dla developerów?",
     "PG 18 wprowadza: ulepszone json_query i json_table, indeksy wektorowe (pgvector w core), lepsza replikacja logiczna (parallel apply), szybsze VACUUM, MERGE z USING. Dla web developerów: JSON jako first-class citizen, lepsze full-text search. W X-DEV PostgreSQL to domyślny wybór bazy danych."),
    ("MongoDB 8 – nowości w bazie dokumentowej", "tech", "fas fa-database", "#47A248,#3c8f3c",
     "MongoDB 8 z szybszymi agregacjami, shardingiem i nowym query engine. Sprawdź zmiany.",
     "MongoDB 8: Query Engine v2 (2-5x szybsze agregacje), nowe operatory (group, window), Atomic Change Streams, szybszy replication. Lepszy time-series. Wbudowane narzędzia do analizy zapytań. W X-DEV MongoDB wybieramy dla projektów z elastycznym schematem danych."),
    ("Jak zacząć z Rust? Poradnik dla web developerów", "tech", "fas fa-cog", "#000000,#333333",
     "Rust zdobywa popularność w web. Sprawdź dlaczego warto nauczyć się tego języka w 2026.",
     "Rust daje wydajność C++ z bezpieczeństwem pamięciowym. W web: WASM (kompilacja do WebAssembly), Tauri (desktop apps), Axum (backend), Turbopack (bundler). Krzywa uczenia stroma, ale warto. W X-DEV używamy Rusta do WASM modułów i narzędzi CLI."),
    ("Go vs Rust – backend w 2026", "tech", "fas fa-code", "#00ADD8,#5bc0de",
     "Porównanie Go i Rust dla backendu. Kiedy wybrać Go, a kiedy Rust? Wydajność vs szybkość developmentu.",
     "Go – prostota, szybki development, świetne narzędzia (gotest, goroutines). Idealny dla REST API, mikroserwisów, narzędzi CLI. Rust – maksymalna wydajność, bezpieczeństwo pamięci, ale wolniejszy development. Dla WASM, systemów embedded, high-performance API. W X-DEV Go używamy dla wewnętrznych API, Rust dla modułów krytycznych wydajnościowo."),
    ("Dark mode – jak zrobić go dobrze?", "webdev", "fas fa-moon", "#2d3436,#636e72",
     "Dark mode to standard. Dowiedz się jak zaimplementować go bez flickerowania i z poszanowaniem preferencji usera.",
     "Dark mode: preferuje-color-scheme: dark/light, CSS custom properties, theme w localStorage. Kluczowe: brak flicker (prevent flash of wrong theme), płynne przejścia (transition na kolorach), kontrast (WCAG 2.1 AAA). W X-DEV dark mode to standard w każdym projekcie z bogatym UI."),
    ("i18n w aplikacjach webowych – kompletny przewodnik", "webdev", "fas fa-language", "#6c5ce7,#00cec9",
     "Internacjonalizacja web app: next-intl, i18next, react-i18next. Tłumaczenia, SSR, SEO i routing.",
     "i18n w 2026: next-intl (najlepszy dla Next.js), i18next (framework-agnostic), FormatJS (ICU messages). Kluczowe: routing z językiem (/pl/, /en/), SSR z tłumaczeniami, automatyczne wykrywanie locale, SEO z hreflang, sortowanie po kluczach. W X-DEV każda strona idzie z pełnym i18n – jak widzisz tutaj."),
    ("Dostępność (a11y) – dlaczego to ważne i jak robić to dobrze", "webdev", "fas fa-universal-access", "#6c5ce7,#a29bfe",
     "Accessibility to nie opcja – to standard. WCAG 2.2, ARIA, testy dostępności i narzędzia.",
     "WCAG 2.2 wprowadza nowe kryteria: focus appearance (wyraźny focus), accessible authentication (alternatywy dla captcha), target size (min 24x24). Narzędzia: axe DevTools, Lighthouse, WAVE, screen reader testy. W X-DEV a11y to część definition of done – każdy komponent musi przechodzić audyt dostępności."),
    ("Edge Functions – przetwarzanie na brzegu sieci", "tech", "fas fa-cloud", "#f38020,#e06b10",
     "Cloudflare Workers, Vercel Edge, Deno Deploy. Porównanie edge runtimów i przypadków użycia.",
     "Edge Functions uruchamiają kod w 300+ lokalizacjach na świecie. Średni czas odpowiedzi <20ms. Zastosowania: personalizacja, A/B testy, geolokalizacja, API gateway. Limity: 10-50ms CPU, 1-10ms startup. W X-DEV używamy Cloudflare Workers dla globalnych klientów."),
    ("Progressive Web Apps – case study wzrostu", "tech", "fas fa-mobile-alt", "#6c5ce7,#00cec9",
     "Jak PWA zwi�ksza zaanga�owanie? Case study: Twitter +350%, Pinterest +40%, Starbucks +100%.", "PWA to nie tylko technologia – to strategia biznesowa. Twitter Lite: +350% wzrostu tweetów, +65% więcej stron na sesję. Pinterest: +40% więcej czasu spędzonego, +44% więcej przychodu z reklam. Starbucks: +100% więcej zamówień przez przeglądarkę. W X-DEV PWA to standardowy element każdego projektu."),
    ("Jamstack – czy wciąż aktualny?", "webdev", "fas fa-layer-group", "#F0047F,#7928CA",
     "Jamstack ewoluuje. Od statycznych stron po distributed computing. Gdzie jest dzisiaj?",
     "Jamstack (JavaScript, API, Markup) ewoluował w 'distributed web'. Next.js, Remix, Astro – generatory które dają SSG, SSR, ISR w jednym. Hosting na Vercel, Netlify, Cloudflare Pages. W X-DEV używamy Jamstack dla projektów gdzie liczy się szybkość i bezpieczeństwo."),
    ("Astro – framework do contentowych stron", "webdev", "fas fa-star", "#ff5a1f,#bc3a00",
     "Astro łączy najlepsze z React, Vue, Svelte w jednym frameworku. Idealny dla blogów i stron firmowych.",
     "Astro to framework do budowy szybkich stron contentowych. Island architecture – wyspy interaktywności w morzu statycznego HTML. Zero JS domyślnie, tylko to co potrzebne. Obsługa wielu frameworków (React, Vue, Svelte, Lit). Content Collections dla blogów. W X-DEV rozważamy Astro dla klientów którzy potrzebują głównie treści."),
    ("HTMX – hipermedia zamiast SPA", "webdev", "fas fa-exchange-alt", "#36C,#369",
     "HTMX pozwala budować dynamiczne strony bez JavaScript. Sprawdź czy to przyszłość webu?",
     "HTMX rozszerza HTML o atrybuty: hx-get, hx-post, hx-target, hx-swap. Wymiania HTML przez AJAX – nie JSON. Prostsze niż SPA, ale ograniczone. Idealne dla: dashboardów, CRUD, stron z formularzami. W X-DEV używamy HTMX w projektach backendowych z Python/Node."),
    ("Web3 – czy blockchain ma sens w web developmentzie?", "tech", "fab fa-ethereum", "#627eea,#3a3a8a",
     "Web3 w 2026 – realne zastosowania czy hype? Smart kontrakty, NFT i dApps w praktyce biznesowej.",
     "Web3 ma realne zastosowania: supply chain, weryfikacja tożsamości, tokenizacja aktywów. Ale dla większości firm to wciąż za wcześnie. Smart kontrakty (Solidity, Rust) wymagają specjalistów. Koszty transakcyjne i UX są barierą. W X-DEV nie polecamy Web3 klientom bez wyraźnego uzasadnienia biznesowego."),
    ("UX Writing – jak pisać interfejsy?", "business", "fas fa-pen-fancy", "#e17055,#d63031",
     "Dobre UX Writing zwiększa konwersję. Mikrokopie, błędy, CTA – jak pisać żeby user kliknął.",
     "UX Writing to projektowanie treści w interfejsie. CTA: 'Zamów teraz' zamist 'Wyślij'. Błędy: 'Nie udało się zapisać. Spróbuj ponownie.' zamist 'Error 500'. Puste stany: 'Dodaj pierwszy produkt' zamist 'Brak danych'. W X-DEV każde UI ma audyt UX Writing przed wdrożeniem."),
    ("Przetwarzanie języka naturalnego w aplikacjach web", "ai", "fas fa-language", "#00cec9,#00b894",
     "NLP w web– chatboty, analiza sentymentu, tłumaczenia. Jak zintegrować OpenAI, Claude, Llama z Twoją apką?",
     "NLP API: OpenAI (GPT-5), Claude 4 (Anthropic), Llama 4 (Meta), Mistral. Zastosowania: czat, analiza sentymentu (opinie klientów), ekstrakcja danych (CV, faktury), tłumaczenia, generowanie treści. W X-DEV Xbot AI używa NLP do zrozumienia intencji użytkownika."),
    ("Systemy rekomendacji – jak działają i jak je wdrożyć?", "ai", "fas fa-thumbs-up", "#fd79a8,#e84393",
     "Rekomendacje produktów zwiększają sprzedaż. Collaborative filtering, content-based, hybrid.",
     "Systemy rekomendacji: collaborative filtering (użytkownicy podobni do Ciebie też kupili), content-based (podobne produkty), hybrid (połączenie). Narzędzia: TensorFlow Recommenders, Apache Mahout, Redis (dla prostych). W X-DEV wdrażamy rekomendacje dla sklepów internetowych – wzrost średniego koszyka o 25%."),
    ("Cloud cost optimization – jak nie przepłacać za chmurę?", "business", "fas fa-dollar-sign", "#00b894,#55efc4",
     "Koszty w chmurze rosną szybko. Jak optymalizować wydatki na AWS, Google Cloud, Azure?",
     "Cloud optimization: right-sizing (dobór odpowiednich instancji), reserved instances (oszczędność 30-60%), spot instances (90% taniej), auto-scaling (dopasowanie do ruchu), storage lifecycle (automatyczne archiwizacja). Monitoring: AWS Cost Explorer, CloudHealth, Vantage. W X-DEV optymalizujemy koszty chmury dla klientów – średnie oszczędności 40%."),
    ("Cyberbezpieczeństwo dla małych firm – praktyczny poradnik", "business", "fas fa-shield-alt", "#d63031,#e17055",
     "Małe firmy są najczęstszym celem ataków. Podstawowe zabezpieczenia które musisz wdrożyć.",
     "Podstawy cyberbezpieczeństwa dla małych firm: 1. Silne hasła + 2FA/MFA, 2. Regularne backup (3-2-1), 3. Aktualizacje oprogramowania, 4. Szyfrowanie danych, 5. VPN dla zdalnego dostępu. Koszt: od 0 (dobre praktyki) do 500 zł/mc (profesjonalne narzędzia). W X-DEV audyt bezpieczeństwa to pierwszy krok dla każdego klienta."),
    ("Jak zbudować zespół IT? Poradnik dla founderów", "business", "fas fa-users", "#6c5ce7,#a29bfe",
     "Zatrudnianie programistów – jak znaleźć, ocenić i zatrzymać talenty. Outsourcing vs in-house.",
     "Budowa zespołu IT: zdefiniuj potrzeby (skillset, seniority), wybierz model (in-house, outsourcing, B2B), proces rekrutacji (tech interview, task, pair programming). Onboarding (pierwsze 30 dni). Retencja (budżet szkoleniowy, flex time, ownership). W X-DEV pomagamy klientom zbudować zespół – od rekrutacji po zarządzanie."),
    ("Digital Transformation – jak zacząć?", "business", "fas fa-sync-alt", "#00cec9,#55efc4",
     "Transformacja cyfrowa krok po kroku. Audyt, strategia, wdrożenie, optymalizacja.",
     "Digital Transformation w 4 krokach: 1. Audyt (obecne procesy, narzędzia, potrzeby), 2. Strategia (cele, roadmap, budżet), 3. Wdrożenie (MVP, iteracje, feedback), 4. Optymalizacja (KPI, A/B testy, ciągłe ulepszanie). W X-DEV przeszliśmy przez to z dziesiątkami firm – klucz to małe kroki i szybkie wyniki."),
    ("Startup tech stack – co wybrać na początek?", "business", "fas fa-rocket", "#e17055,#fdcb6e",
     "Jaki stack technologiczny wybrać dla startupu? Szybkość developmentu vs skalowalność.",
     "Dla startupu: Next.js + Vercel (frontend), Supabase (backend + baza), Stripe (płatności), Resend (maile), Clerk (auth). Koszt: ~200 zł/mc na start. Skalowanie: gdy userzy rosną → dedykowany backend + własna baza. W X-DEV pomagamy startupom od pomysłu do MVP w 4-6 tygodni."),
    ("Jak mierzyć satysfakcję klientów? NPS, CSAT, CES", "business", "fas fa-chart-bar", "#fdcb6e,#f39c12",
     "Metryki satysfakcji klientów: Net Promoter Score, Customer Satisfaction, Customer Effort Score.",
     "NPS (Net Promoter Score) – 'Jak bardzo polecisz nas znajomemu?' (0-10). CSAT (Customer Satisfaction) – 'Jak oceniasz ostatnią interakcję?' (1-5). CES (Customer Effort Score) – 'Jak łatwo było rozwiązać problem?' (1-7). W X-DEV mierzymy NPS po każdym projekcie – cel to 70+."),
]

CACHE_FILE = os.path.join(os.path.dirname(__file__), ".post_cache.json")

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    return {"last_date": None, "used_indices": []}

def save_cache(cache):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

def next_date(cache):
    today = datetime.now().strftime("%Y-%m-%d")
    if cache["last_date"] is None:
        return today
    if cache["last_date"] < today:
        return today
    last = datetime.strptime(cache["last_date"], "%Y-%m-%d")
    return (last + timedelta(days=1)).strftime("%Y-%m-%d")

def pick_topics(cache, count=2):
    available = [i for i in range(len(TOPICS)) if i not in cache["used_indices"]]
    if len(available) < count:
        cache["used_indices"] = []
        available = list(range(len(TOPICS)))
    chosen = random.sample(available, count)
    cache["used_indices"].extend(chosen)
    return [TOPICS[i] for i in chosen]

def post_to_js(p):
    title, cat, icon, color, excerpt, content = p
    content_escaped = content.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    excerpt_escaped = excerpt.replace("\\", "\\\\").replace("'", "\\'")
    title_escaped = title.replace("\\", "\\\\").replace("'", "\\'")
    return f"""  {{
    title: '{title_escaped}',
    date: '{DATE}',
    category: '{cat}',
    excerpt: '{excerpt_escaped}',
    content: '{content_escaped}',
    color: '{color}',
    icon: '{icon}'
  }}"""

cache = load_cache()
DATE = next_date(cache)
posts_to_add = pick_topics(cache, 2)
post_objects = [post_to_js(p) for p in posts_to_add]

with open(BLOG_FILE, "r", encoding="utf-8") as f:
    html = f.read()

insertion = ",\n".join(post_objects)
html = html.replace(
    "const posts = [",
    f"const posts = [\n{insertion},",
    1
)

with open(BLOG_FILE, "w", encoding="utf-8") as f:
    f.write(html)

cache["last_date"] = DATE
save_cache(cache)

added_titles = [t[0] for t in posts_to_add]
print(f"[{DATE}] Dodano 2 wpisy:")
for t in added_titles:
    print(f"  - {t}")

NEXT = (datetime.strptime(DATE, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
print(f"\nNastępne uruchomienie doda wpisy na dzień: {NEXT}")
print(f"Łącznie tematów w puli: {len(TOPICS)}")
