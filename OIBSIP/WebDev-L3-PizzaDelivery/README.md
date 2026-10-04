# Forno Pizza

A responsive pizza ordering demo built with React, Vite, and Express.

## Features

- Search and filter the pizza menu.
- Add and remove items in a cart saved in the browser.
- Submit a delivery order and receive an order confirmation.
- Server-side order validation and total calculation.

## Run locally

Use Node.js, then install dependencies in both folders:

```powershell
cd server
npm install
npm run dev
```

In a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed by the client, normally `http://localhost:5173/`. The client proxies `/api` requests to the server on port `5001`.

## API

- `GET /api/health` checks server availability.
- `GET /api/menu` returns the menu.
- `POST /api/orders` validates and submits an order.

Orders are held in server memory and are cleared when the server restarts. This demo does not process payments or persist orders to a database.
