import { useEffect, useMemo, useState } from 'react'
import './App.css'

const fallbackMenu = [
  { id: 'margherita', name: 'Margherita', description: 'San Marzano tomato, fior di latte, basil, extra virgin olive oil.', category: 'Classics', price: 15, rating: '4.9', badge: 'BESTSELLER', image: 'photo-1574071318508-1cdbab80d002' },
  { id: 'pepperoni', name: 'Pepperoni Piccante', description: 'Cup-and-char pepperoni, mozzarella, hot honey, oregano.', category: 'Classics', price: 18, rating: '5.0', badge: 'A LITTLE HEAT', image: 'photo-1628840042765-356cda07504e' },
  { id: 'funghi', name: 'Wild Mushroom', description: 'Roasted mushrooms, taleggio, thyme, garlic cream, parmesan.', category: 'Signature', price: 19, rating: '4.8', badge: '', image: 'photo-1571407970349-bc81e7e96d47' },
  { id: 'burrata', name: 'Burrata & Prosciutto', description: 'Silky burrata, prosciutto, rocket, balsamic, cracked pepper.', category: 'Signature', price: 22, rating: '4.9', badge: 'CHEF\'S PICK', image: 'photo-1579751626657-72bc17010498' },
  { id: 'garden', name: 'The Greenhouse', description: 'Zucchini, artichoke, spinach, olives, lemon ricotta.', category: 'Plant-based', price: 17, rating: '4.7', badge: 'PLANT-BASED', image: 'photo-1513104890138-7c749659a591' },
  { id: 'sausage', name: 'Sausage & Fennel', description: 'House sausage, shaved fennel, red onion, pecorino, chili oil.', category: 'Signature', price: 20, rating: '4.8', badge: '', image: 'photo-1604382355076-af4b0eb60143' },
]

const categories = ['All pizzas', 'Classics', 'Signature', 'Plant-based']
const imageUrl = (id, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const formatPrice = (amount) => `$${Number(amount).toFixed(2)}`

function App() {
  const [menu, setMenu] = useState(fallbackMenu)
  const [activeCategory, setActiveCategory] = useState('All pizzas')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('forno-cart') || '{}')
    } catch {
      return {}
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/menu')
      .then((response) => {
        if (!response.ok) throw new Error('Menu service unavailable')
        return response.json()
      })
      .then((items) => { if (Array.isArray(items) && items.length) setMenu(items) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('forno-cart', JSON.stringify(cart))
  }, [cart])

  const visibleMenu = useMemo(() => menu.filter((item) => {
    const categoryMatch = activeCategory === 'All pizzas' || item.category === activeCategory
    const searchMatch = `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
    return categoryMatch && searchMatch
  }), [menu, activeCategory, search])

  const cartItems = menu.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] }))
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const delivery = subtotal === 0 || subtotal >= 35 ? 0 : 3.5
  const total = subtotal + delivery

  function updateCart(itemId, amount) {
    setCart((current) => {
      const quantity = (current[itemId] || 0) + amount
      const next = { ...current }
      if (quantity <= 0) delete next[itemId]
      else next[itemId] = quantity
      return next
    })
    setOrder(null)
    setError('')
  }

  async function placeOrder(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const customer = Object.fromEntries(formData.entries())
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, items: cartItems.map(({ id, quantity }) => ({ id, quantity })) }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to place your order.')
      setOrder(result)
      setCart({})
      setCheckoutOpen(false)
      setCartOpen(true)
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to the order service. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="site-shell">
      <div className="announcement"><span className="announcement-dot" /> FRESH FROM THE OVEN, EVERY DAY <span className="announcement-divider">/</span> FREE DELIVERY OVER $35</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Forno home"><span className="brand-mark">f.</span><span>forno<span className="brand-period">.</span></span></a>
        <nav className="main-nav" aria-label="Main navigation"><a className="nav-active" href="#menu">Order pizza</a><a href="#story">Our story</a><a href="#footer">Find us</a></nav>
        <div className="header-actions"><span className="open-status"><span /> Open until 10 pm</span><button className="cart-button" type="button" onClick={() => { setOrder(null); setCartOpen(true) }} aria-label={`Open cart, ${itemCount} items`}><span className="bag-icon" aria-hidden="true">▱</span><span>Your order</span><span className="cart-count">{itemCount}</span></button></div>
      </header>

      <main id="top">
        <section className="hero" aria-label="Featured pizza">
          <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> LITTLE OVEN. BIG FEELING.</p><h1>Good things<br />take <em>crust.</em></h1><p className="hero-description">Slow-fermented dough, bright Italian tomatoes, and the kind of cheese pull that makes everyone lean in.</p><a className="hero-link" href="#menu">Find your pizza <span aria-hidden="true">↘</span></a><div className="hero-notes"><span>48-hour dough</span><span>·</span><span>Fired at 900°F</span><span>·</span><span>Made with love</span></div></div>
          <div className="hero-visual"><img src={imageUrl('photo-1513104890138-7c749659a591', 1300)} alt="Freshly baked pizza topped with basil and melted cheese" /><div className="hero-stamp"><span>GOOD<br />MOOD<br />FOOD</span><span className="stamp-star">✳</span></div><div className="hero-caption"><span>01 / OUR HOUSE FAVORITE</span><span>THE MARGHERITA</span></div></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> MADE TO BE SHARED (OR NOT)</p><h2>Pick your <em>happy.</em></h2></div><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a pizza" aria-label="Search pizzas" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}</label></div>
          <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Pizza categories">{categories.map((category) => <button key={category} type="button" role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><span className="menu-count">{visibleMenu.length} handmade favorites</span></div>
          <div className="pizza-grid">{visibleMenu.map((item, index) => <article className="pizza-card" key={item.id} style={{ '--card-order': index }}><div className="pizza-image-wrap"><img className="pizza-image" src={imageUrl(item.image)} alt={`${item.name} pizza`} loading="lazy" />{item.badge && <span className="pizza-badge">{item.badge}</span>}<button className="quick-add" type="button" onClick={() => updateCart(item.id, 1)} aria-label={`Add ${item.name} to order`}>+</button></div><div className="pizza-info"><div className="pizza-title-row"><h3>{item.name}</h3><span className="rating">★ {item.rating}</span></div><p>{item.description}</p><div className="pizza-bottom"><span className="pizza-price">{formatPrice(item.price)}</span><span className="pizza-size">12” · serves 1–2</span></div></div></article>)}</div>
          {visibleMenu.length === 0 && <div className="empty-results"><span>Nothing in the oven for that search.</span><button type="button" onClick={() => { setSearch(''); setActiveCategory('All pizzas') }}>Show all pizzas</button></div>}
        </section>

        <section className="story-strip" id="story"><span className="story-kicker">A LITTLE MORE ABOUT US</span><p>Not fast food. <em>Feel-good food.</em></p><span className="story-detail">Long fermentation. Local produce. No shortcuts.</span><a href="#footer" aria-label="Learn more about Forno">↗</a></section>
      </main>

      <footer className="site-footer" id="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">f.</span><span>forno<span className="brand-period">.</span></span></a><span>14 Mercer Street, New York, NY</span><span>Tue–Sun · 11:30 am–10 pm</span><a href="tel:+12125550148">(212) 555-0148</a><span className="footer-copy">© 2026 Forno Pizza Co.</span></footer>

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label="Your order"><div className="drawer-header"><div><p className="eyebrow">THE GOOD STUFF</p><h2>{order ? 'You’re all set.' : 'Your order'}</h2></div><button className="close-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close order">×</button></div>{order ? <div className="order-success"><div className="success-mark">✓</div><p className="eyebrow">ORDER {order.orderNumber}</p><h3>Oven’s on.</h3><p>Your order is in. We’ll have it at your door in about 30–40 minutes.</p><div className="order-receipt"><span>Order total</span><strong>{formatPrice(order.total)}</strong><span>Delivering to</span><strong>{order.customer.address}</strong></div><button className="checkout-button" type="button" onClick={() => { setCartOpen(false); setOrder(null) }}>Back to the menu <span>↗</span></button></div> : <>{cartItems.length ? <><div className="drawer-items">{cartItems.map((item) => <div className="drawer-item" key={item.id}><img src={imageUrl(item.image, 220)} alt=""/><div className="drawer-item-details"><h3>{item.name}</h3><span>{formatPrice(item.price)}</span><div className="quantity-control"><button type="button" onClick={() => updateCart(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => updateCart(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div><span>Delivery</span><span>{delivery === 0 ? 'On us' : formatPrice(delivery)}</span></div><div className="summary-total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div><button className="checkout-button" type="button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setError('') }}>Checkout <span>↗</span></button><p className="delivery-note">{subtotal >= 35 ? 'Nice. Delivery is on us.' : `Add ${formatPrice(35 - subtotal)} for free delivery.`}</p></div></> : <div className="empty-cart"><span className="empty-cart-icon">＋</span><h3>{order ? 'Order placed' : 'Your table is waiting.'}</h3><p>{order ? 'Your order confirmation is above.' : 'Add something warm and wonderful from the menu.'}</p><button type="button" onClick={() => setCartOpen(false)}>Explore the menu <span>↗</span></button></div>}</>}</aside></div>}

      {checkoutOpen && <div className="overlay checkout-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false) }}><section className="checkout-modal" aria-labelledby="checkout-title"><div className="drawer-header"><div><p className="eyebrow">THE LAST LITTLE STEP</p><h2 id="checkout-title">Where to?</h2></div><button className="close-button" type="button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">×</button></div><form className="checkout-form" onSubmit={placeOrder}><label>Your name<input name="name" required autoComplete="name" placeholder="Alex Morgan" /></label><label>Phone number<input name="phone" required type="tel" autoComplete="tel" placeholder="(555) 000-0000" /></label><label>Delivery address<input name="address" required autoComplete="street-address" placeholder="Street, apartment, city" /></label><div className="checkout-total"><span>{itemCount} {itemCount === 1 ? 'pizza' : 'pizzas'} · delivery included</span><strong>{formatPrice(total)}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="checkout-button" type="submit" disabled={loading}>{loading ? 'Sending your order…' : 'Place my order'} <span>↗</span></button><p className="secure-note">Pay on delivery · No payment details needed</p></form></section></div>}
    </div>
  )
}

export default App
