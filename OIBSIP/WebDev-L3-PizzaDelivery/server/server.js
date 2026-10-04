require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { randomUUID } = require('node:crypto')

const app = express()
const port = Number(process.env.PORT) || 5001

const menu = [
  { id: 'margherita', name: 'Margherita', description: 'San Marzano tomato, fior di latte, basil, extra virgin olive oil.', category: 'Classics', price: 15, rating: '4.9', badge: 'BESTSELLER', image: 'photo-1574071318508-1cdbab80d002' },
  { id: 'pepperoni', name: 'Pepperoni Piccante', description: 'Cup-and-char pepperoni, mozzarella, hot honey, oregano.', category: 'Classics', price: 18, rating: '5.0', badge: 'A LITTLE HEAT', image: 'photo-1628840042765-356cda07504e' },
  { id: 'funghi', name: 'Wild Mushroom', description: 'Roasted mushrooms, taleggio, thyme, garlic cream, parmesan.', category: 'Signature', price: 19, rating: '4.8', badge: '', image: 'photo-1571407970349-bc81e7e96d47' },
  { id: 'burrata', name: 'Burrata & Prosciutto', description: 'Silky burrata, prosciutto, rocket, balsamic, cracked pepper.', category: 'Signature', price: 22, rating: '4.9', badge: "CHEF'S PICK", image: 'photo-1579751626657-72bc17010498' },
  { id: 'garden', name: 'The Greenhouse', description: 'Zucchini, artichoke, spinach, olives, lemon ricotta.', category: 'Plant-based', price: 17, rating: '4.7', badge: 'PLANT-BASED', image: 'photo-1513104890138-7c749659a591' },
  { id: 'sausage', name: 'Sausage & Fennel', description: 'House sausage, shaved fennel, red onion, pecorino, chili oil.', category: 'Signature', price: 20, rating: '4.8', badge: '', image: 'photo-1604382355076-af4b0eb60143' },
]

const orders = []

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/menu', (_request, response) => {
  response.json(menu)
})

app.post('/api/orders', (request, response) => {
  const { customer, items } = request.body || {}
  const customerFields = ['name', 'phone', 'address']
  if (!customer || customerFields.some((field) => typeof customer[field] !== 'string' || !customer[field].trim())) {
    return response.status(400).json({ message: 'Please provide your name, phone number, and delivery address.' })
  }
  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ message: 'Add at least one pizza before checking out.' })
  }

  const orderItems = []
  for (const item of items) {
    const pizza = menu.find((entry) => entry.id === item.id)
    const quantity = Number(item.quantity)
    if (!pizza || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return response.status(400).json({ message: 'One of the selected pizzas or quantities is invalid.' })
    }
    orderItems.push({ id: pizza.id, name: pizza.name, price: pizza.price, quantity })
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal >= 35 ? 0 : 3.5
  const placedOrder = {
    id: randomUUID(),
    orderNumber: `F-${Date.now().toString().slice(-6)}`,
    customer: Object.fromEntries(customerFields.map((field) => [field, customer[field].trim()])),
    items: orderItems,
    subtotal,
    delivery,
    total: subtotal + delivery,
    createdAt: new Date().toISOString(),
  }
  orders.push(placedOrder)
  return response.status(201).json(placedOrder)
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'Something went wrong while processing your request.' })
})

app.listen(port, () => {
  console.log(`Forno API listening on http://localhost:${port}`)
})