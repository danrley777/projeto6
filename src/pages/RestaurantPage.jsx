import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import CartDrawer from '../components/CartDrawer'
import FeedbackBlock from '../components/FeedbackBlock'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { clearCart } from '../store/cartSlice'
import NotFoundPage from './NotFoundPage'

const Cover = styled.section`
  height: 280px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.$image});
  background-position: center;
  background-size: cover;
`

const CoverContent = styled.div`
  width: min(100%, 1024px);
  height: 100%;
  margin: 0 auto;
  padding: 24px 16px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Category = styled.p`
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 100;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 900;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`

const Main = styled.main`
  width: min(100%, 1024px);
  margin: 0 auto;
  padding: 56px 16px 120px;
`

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`

function RestaurantPage({
  restaurants,
  isLoading,
  error,
  totalItems,
  totalPrice,
  cartItems,
  isCartOpen,
  onOpenCart,
  onCloseCart,
  onAddToCart,
  onDecreaseItem,
}) {
  const { restaurantId } = useParams()
  const restaurant = restaurants.find((item) => item.id === restaurantId)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    document.body.classList.toggle('overlay-open', isCartOpen || Boolean(selectedProduct))

    return () => {
      document.body.classList.remove('overlay-open')
    }
  }, [isCartOpen, selectedProduct])

  if (isLoading) {
    return (
      <>
        <Header totalItems={totalItems} onOpenCart={onOpenCart} />
        <FeedbackBlock>Carregando cardapio da API do eFood...</FeedbackBlock>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header totalItems={totalItems} onOpenCart={onOpenCart} />
        <FeedbackBlock>{error}</FeedbackBlock>
      </>
    )
  }

  if (!restaurant) {
    return <NotFoundPage />
  }

  return (
    <>
      <Header totalItems={totalItems} onOpenCart={onOpenCart} />
      <Cover $image={restaurant.coverImage}>
        <CoverContent>
          <Category>{restaurant.category}</Category>
          <Title>{restaurant.title}</Title>
        </CoverContent>
      </Cover>
      <Main>
        <Grid>
          {restaurant.products.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
          ))}
        </Grid>
      </Main>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => {
          onAddToCart(restaurant, selectedProduct)
          setSelectedProduct(null)
        }}
      />
      <CartDrawer
        cartItems={cartItems}
        totalPrice={totalPrice}
        isOpen={isCartOpen}
        onClose={onCloseCart}
        onDecreaseItem={onDecreaseItem}
        onFinishOrder={() => dispatch(clearCart())}
      />
      <Footer />
    </>
  )
}

export default RestaurantPage
