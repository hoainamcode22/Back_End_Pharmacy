# Pharmacy Frontend (React + Vite)

Customer-facing UI for an online pharmacy styled like Long Châu/Pharmacity. It includes product browsing, cart/checkout, orders, profile, prescription upload, and support chat. Backend wiring comes next.

## Quick start

```cmd
cd Front_end
npm install
npm run dev
```

Environment: set `VITE_API_BASE` in a `.env` file if you have a backend (default falls back to demo data in some flows).

## Features

- Sticky full-width header with logo, address chip, menu, cart badge, and logout
- Hero banner with search and category pills
- Product shelves: clean 5-card grid (sm:2, md:3, lg:5)
- Product detail with “Thêm vào giỏ” and “Hỗ trợ ngay” (prefills chat)
- Cart page with qty adjust/remove, total, and checkout button
- Checkout with address, note, payment method (COD/MOMO)
- Orders list with status badge and ETA when shipping
- Profile form (name, phone, address)
- Prescription upload/list/detail (localStorage demo)
- Support chat with optional attachment via query string
- Responsive layout; max content width 1280px

## Main routes

- `/shop` – HeroHeader + stacked ProductShelf sections
- `/product/:id` – Product detail, price, actions, comments
- `/cart` – Items with +/-/remove, total, proceed to checkout
- `/checkout` – Address/note/payment; submit → orders
- `/orders` – History with status via `OrderStatusBadge`
- `/profile` – Edit name/phone/address
- `/prescriptions` – List my uploaded prescriptions (demo)
- `/prescriptions/upload` – Upload image + note (demo)
- `/support` – Simple chat; accepts `?type=product|prescription&id=...&name=...&price=...&image=...`

## Components

- `Header.jsx` – sticky header; used by `UserLayout.jsx`
- `HeroHeader.jsx` – banner + search + category pills
- `ProductShelf.jsx` – section head + 5-col grid + “Xem thêm”
- `ProductCard.jsx` – image/name/desc/price + primary CTA
- `OrderStatusBadge.jsx` – pending/confirmed/shipping/completed/canceled
- `ContactSection.jsx`, `Footer.jsx` – support + 3-column footer

## Styling

- Font stack: Inter/Roboto/Segoe UI
- Primary color: `#2563eb`; light backgrounds `#f8fafc`
- Consistent radius/shadows; button hover states
- See `src/index.css` for theme tokens and component classes

## API contract (frontend expectations)

Base URL: `${import.meta.env.VITE_API_BASE || ''}`

- `GET /api/products?keyword=&category=&limit=` → `{ items: Product[], total }`
- `GET /api/products/:id` → `Product`
- `GET /api/cart` → `{ items: [{ id, qty, product: Product }] }`
- `POST /api/cart` body `{ productId, qty }`
- `PUT /api/cart/:itemId` body `{ qty }`
- `DELETE /api/cart/:itemId`
- `POST /api/checkout` body `{ address, note, paymentMethod }` → `{ orderId }`
- `GET /api/orders` → `{ items: Order[] }`
- `GET /api/me` → `{ id, name, phone, address }`
- `PUT /api/me` body `{ name, phone, address }`

Notes

- Authorization header is supported via `setAuthToken(token)` in `src/api.jsx`.
- Prescriptions, comments, and chat use localStorage for now; replace with real endpoints when available.

## Next steps

1. Implement backend endpoints above and set `VITE_API_BASE`.
2. Replace localStorage demos (prescriptions/comments/chat) with real APIs.
3. Add analytics, deeper search/filters, and SEO/meta tags as needed.
4. Harden forms/validation and error messages for production.
