import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addItem,
  closeCart,
  openCart,
  removeSingleItem,
  selectCartIsOpen,
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from './store/cartSlice'
import GlobalStyle from './styles/GlobalStyle'
import { normalizeRestaurant } from './utils/restaurants'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import NotFoundPage from './pages/NotFoundPage'

const API_URL = 'https://api-ebac.vercel.app/api/efood/restaurantes'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const isCartOpen = useSelector(selectCartIsOpen)
  const totalItems = useSelector(selectCartItemsCount)
  const totalPrice = useSelector(selectCartTotal)

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

  const handleAddToCart = (restaurant, product) => {
    dispatch(
      addItem({
        ...product,
        restaurantName: restaurant.title,
      }),
    )
  }

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route
          path="/"
          element={<HomePage restaurants={restaurants} isLoading={isLoading} error={error} />}
        />
        <Route
          path="/restaurantes/:restaurantId"
          element={
            <RestaurantPage
              restaurants={restaurants}
              isLoading={isLoading}
              error={error}
              totalItems={totalItems}
              totalPrice={totalPrice}
              cartItems={cartItems}
              isCartOpen={isCartOpen}
              onOpenCart={() => dispatch(openCart())}
              onCloseCart={() => dispatch(closeCart())}
              onAddToCart={handleAddToCart}
              onDecreaseItem={(productId) => dispatch(removeSingleItem(productId))}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
