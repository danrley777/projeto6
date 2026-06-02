import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GlobalStyle from './styles/GlobalStyle'
import { normalizeRestaurant } from './utils/restaurants'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'

const API_URL = 'https://api-ebac.vercel.app/api/efood/restaurantes'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadRestaurants() {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Nao foi possivel carregar os restaurantes.')
        }

        const data = await response.json()

        if (isMounted) {
          setRestaurants(data.map(normalizeRestaurant))
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Nao foi possivel carregar os dados da API do eFood.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadRestaurants()

    return () => {
      isMounted = false
    }
  }, [])

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleAddToCart = (restaurant, product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          restaurantName: restaurant.title,
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
  }

  const handleRemoveSingleItem = (productId) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== productId) {
          return [item]
        }

        if (item.quantity === 1) {
          return []
        }

        return [{ ...item, quantity: item.quantity - 1 }]
      }),
    )
  }

  const handleClearCart = () => {
    setCartItems([])
    setIsCartOpen(false)
  }

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              restaurants={restaurants}
              isLoading={isLoading}
              error={error}
              cartItemsCount={cartItemsCount}
              onOpenCart={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/restaurantes/:restaurantId"
          element={
            <RestaurantPage
              restaurants={restaurants}
              isLoading={isLoading}
              error={error}
              cartItems={cartItems}
              cartItemsCount={cartItemsCount}
              cartTotal={cartTotal}
              isCartOpen={isCartOpen}
              onOpenCart={() => setIsCartOpen(true)}
              onCloseCart={() => setIsCartOpen(false)}
              onAddToCart={handleAddToCart}
              onRemoveSingleItem={handleRemoveSingleItem}
              onClearCart={handleClearCart}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
