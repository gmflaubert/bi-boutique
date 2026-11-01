# B&I Boutique

A fashion e-commerce storefront for **B&I Boutique**, a curated women's fashion brand based in Kigali, Rwanda. Customers browse products, filter by category, add items to a cart, apply promo codes, enter their delivery location, and place orders via WhatsApp. A protected admin panel lets the shop owner manage products, orders, and promotions.

Data is stored in **Supabase** (Postgres) with Row Level Security. Authentication uses Supabase Auth. The shopping cart is stored in the browser's `localStorage`.

## Live Site

Deployed at [bi-boutique.wasmer.app](https://bi-boutique.wasmer.app). Repository: [github.com/gmflaubert/bi-boutique](https://github.com/gmflaubert/bi-boutique)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 with Vite 8 |
| Database & Auth | Supabase (Postgres + Auth + RLS) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| QR Codes | qrcode.react |
| Linting | oxlint |
| Fonts | Google Fonts — Playfair Display (headings), Inter (body) |

## Project Structure

```
bi-boutique/
├── index.html                  # Entry HTML — loads fonts, sets page title
├── vite.config.js              # Vite + React + Tailwind plugins
├── package.json
├── .env.example                # Supabase environment variables template
├── .oxlintrc.json              # Lint rules (react hooks, export conventions)
├── supabase/
│   └── schema.sql              # Database schema, RLS policies, and seed data
├── public/
│   ├── logo.jpg                # Store logo
│   ├── favicon.svg             # Browser tab icon
│   └── icons.svg               # SVG icon sprite
├── src/
│   ├── main.jsx                # App bootstrap — providers and router
│   ├── App.jsx                 # Route definitions, scroll-to-top, protected routes
│   ├── config.js               # Store config (name, WhatsApp number, categories)
│   ├── utils.js                # Helpers: localStorage, price formatting, WhatsApp messages, promo usage tracking
│   ├── index.css               # Tailwind v4 theme (colors, fonts) + global button/card styles
│   ├── lib/
│   │   └── supabase.js         # Supabase client initialization
│   ├── context/
│   │   ├── AuthContext.jsx      # Supabase Auth — login/logout/session management
│   │   ├── ProductContext.jsx   # Product CRUD via Supabase
│   │   ├── CartContext.jsx      # Shopping cart (localStorage)
│   │   ├── OrderContext.jsx     # Order management via Supabase
│   │   └── PromoContext.jsx     # Promo code CRUD + validation via Supabase
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky nav — logo, links, cart badge, admin link, mobile hamburger
│   │   ├── Footer.jsx           # Three-column footer — about, quick links, contact info
│   │   └── ProductCard.jsx      # Product grid card — image, sale badge, price, color swatches
│   └── pages/
│       ├── Home.jsx             # Hero, promo banner, current deals, categories, featured products, CTA
│       ├── Shop.jsx             # Full product grid with search, sort, and category filtering
│       ├── ProductDetail.jsx    # Product page — gallery, selectors, delivery location, cart + WhatsApp order
│       ├── About.jsx            # Brand story and values (accessible via footer link)
│       ├── Contact.jsx          # Contact cards + step-by-step "how to order" guide
│       ├── Cart.jsx             # Cart items, promo code, delivery location, order summary, WhatsApp checkout
│       └── admin/
│           ├── Login.jsx        # Admin login (Supabase Auth — email/password)
│           ├── Layout.jsx       # Admin shell — sidebar nav (desktop), icon bar (mobile), logout
│           ├── Dashboard.jsx    # Stats cards + recent orders table
│           ├── Products.jsx     # Product table + add/edit modal
│           ├── Orders.jsx       # Order list with status filter, delivery location, status management
│           └── Promos.jsx       # Promo code table + add/edit modal
└── dist/                        # Production build output
```

## Architecture

### Database (Supabase)

Three tables with Row Level Security:

| Table | Public Read | Public Write | Admin Read | Admin Write |
|---|---|---|---|---|
| `products` | Yes | No | Yes | Yes |
| `orders` | No | INSERT only | Yes | Yes |
| `promos` | Yes | No | Yes | Yes |

The full schema is in `supabase/schema.sql`.

### State Management

Five React Context providers nested in `main.jsx`:

```
BrowserRouter
  └─ AuthProvider       — Supabase Auth session management
     └─ ProductProvider — products fetched from Supabase on mount
        └─ CartProvider — shopping cart in localStorage
           └─ OrderProvider — orders fetched from Supabase (admin only)
              └─ PromoProvider — promos fetched from Supabase on mount
```

- **Products, Orders, Promos** — fetched from Supabase. CRUD operations go through Supabase with local state updated on success.
- **Cart** — stays in `localStorage`. It's client-side pre-checkout state with no need for server persistence.
- **Auth** — managed by Supabase Auth. Session is persisted by the Supabase client in localStorage.

### Routing

| Path | Component | Access |
|---|---|---|
| `/` | Home | Public |
| `/shop` | Shop | Public |
| `/shop?category=Dresses` | Shop (filtered) | Public |
| `/product/:id` | ProductDetail | Public |
| `/about` | About | Public (footer link only) |
| `/contact` | Contact | Public |
| `/cart` | Cart | Public |
| `/admin/login` | AdminLogin | Public |
| `/admin` | AdminLayout > Dashboard | Protected |
| `/admin/products` | AdminLayout > Products | Protected |
| `/admin/orders` | AdminLayout > Orders | Protected |
| `/admin/promos` | AdminLayout > Promos | Protected |

### Order Flow

1. Customer browses products, adds items to cart, and enters a delivery location.
2. Optionally applies a promo code — validated against the database (code, active status, expiry, minimum purchase) and one-time-per-user usage (tracked in localStorage).
3. Clicks "Order via WhatsApp" — the app builds a formatted message with items, promo, delivery location, and total.
4. A QR code modal appears with a direct WhatsApp link.
5. **Cart checkout:** the order is saved to the `orders` table in Supabase so it appears in the admin dashboard.
6. The shop owner receives the WhatsApp message and manages order status through the admin panel.

### Data Model

**Product** (Supabase `products` table)
```
{ id (UUID), name, description, price, originalPrice, images[], category,
  sizes[], colors[{name, hex}], inStock, featured, createdAt }
```

**Order** (Supabase `orders` table)
```
{ id (UUID), items[] (JSONB), total, customerPhone, deliveryLocation,
  promoCode, status, createdAt }
```

**Promo** (Supabase `promos` table)
```
{ id (UUID), code (unique), type ("percentage"|"fixed"), value,
  minPurchase, expiresAt, active }
```

**Cart Item** (localStorage only)
```
{ product, selectedSize, selectedColor, quantity }
```

## Features

### Customer-facing
- **Home page** — hero banner, **promo code banner** (shows active codes with their discounts), **"Current Deals" section** (products on sale), category navigation, featured products, CTA
- **Shop page** — full product grid with search, sort, and category filtering
- **Product detail** — image gallery, size/color/quantity selectors, **delivery location input**, Add to Cart, Order via WhatsApp with QR code
- **Shopping cart** — item list, **promo code input** (disabled Apply button until code is entered, one-time usage per user), **delivery location input** (required), order summary with discount, WhatsApp checkout
- **Responsive design** — mobile hamburger menu, responsive grids, touch-friendly controls

### Admin panel (`/admin`)
- **Authentication** — Supabase Auth (email/password) with session persistence
- **Dashboard** — stat cards (products, orders, revenue, promos), recent orders table
- **Products** — table view, add/edit modal (name, description, price, sale price, category, images, sizes, colors, stock/featured toggles)
- **Orders** — filterable by status, **shows delivery location**, status dropdown per order, delete
- **Promos** — table of promo codes, add/edit modal (code, type, value, min purchase, expiry, active)

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project

### 1. Clone & Install

```bash
git clone https://github.com/gmflaubert/bi-boutique.git
cd bi-boutique
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql` — this creates the tables, RLS policies, and seed data
3. Go to **Authentication > Users > Add user** to create your admin account (email + password)
4. Go to **Project Settings > API** and copy your **Project URL** and **anon/public key**

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run

```bash
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Default Data

The SQL schema seeds 8 products across 5 categories and 2 promo codes:

| Code | Type | Discount | Min Purchase |
|---|---|---|---|
| `WELCOME10` | Percentage | 10% | RWF 20,000 |
| `SAVE5000` | Fixed | RWF 5,000 | RWF 30,000 |

## Key Implementation Details

- **Supabase backend** — products, orders, and promos are stored in Postgres with RLS. The anon key is safe to expose in the frontend; RLS policies protect write access.
- **Supabase Auth** — admin login uses email/password authentication. Sessions are managed by the Supabase client.
- **Cart in localStorage** — the cart is browser-local, pre-checkout state. Cart items embed the full product snapshot at time of adding (standard e-commerce behavior).
- **WhatsApp integration** — orders are sent as formatted text messages via `wa.me` deep links, including delivery location. QR codes are generated client-side.
- **Delivery location** — customers enter their delivery address before ordering. It's included in the WhatsApp message and stored in the orders table.
- **Promo one-time usage** — each promo code can only be used once per browser, tracked via localStorage.
- **Promo Apply button** — disabled until the customer types a code.
- **Sale pricing** — products with an `originalPrice` greater than `price` show a discount badge. The home page features a "Current Deals" section.
- **Home promo banner** — active promo codes are displayed on the home page so customers know they're available.
- **Column mapping** — Supabase uses `snake_case` columns; the React contexts map to `camelCase` for JavaScript consumption.
