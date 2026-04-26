import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled, { createGlobalStyle } from 'styled-components'
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

const API_URL = 'https://api-ebac.vercel.app/api/efood/restaurantes'

const GlobalStyle = createGlobalStyle`
  :root {
    color: #4b1d1d;
    background: #fff8f2;
    font-family: 'Poppins', 'Trebuchet MS', sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-width: 320px;
    background:
      radial-gradient(circle at top, rgba(255, 232, 220, 0.9), transparent 34%),
      #fff8f2;
    color: #4b1d1d;
  }

  body.overlay-open {
    overflow: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input {
    font: inherit;
  }
`

const PageShell = styled.div`
  min-height: 100vh;
`

const HeaderWrap = styled.header`
  background:
    linear-gradient(rgba(255, 241, 234, 0.96), rgba(255, 241, 234, 0.96)),
    repeating-linear-gradient(
      90deg,
      rgba(230, 103, 103, 0.08) 0,
      rgba(230, 103, 103, 0.08) 2px,
      transparent 2px,
      transparent 14px
    );
  border-bottom: 1px solid rgba(230, 103, 103, 0.18);
`

const HeaderContent = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const HeaderSide = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;

  @media (max-width: 720px) {
    justify-content: center;
    min-width: auto;
  }
`

const HeaderLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: #e66767;
`

const HeaderButton = styled.button`
  border: 0;
  background: transparent;
  color: #e66767;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e66767;
  color: #e66767;
  font-weight: 800;
  font-size: 28px;
  letter-spacing: -1px;
  padding: 4px 10px;
  line-height: 1;
  text-transform: lowercase;

  span {
    font-size: 16px;
    margin-left: 4px;
  }
`

const CartStatus = styled.button`
  border: 0;
  background: transparent;
  color: #e66767;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: right;
  padding: 0;

  @media (max-width: 720px) {
    text-align: center;
  }
`

const HeroSection = styled.section`
  background:
    linear-gradient(rgba(255, 241, 234, 0.96), rgba(255, 241, 234, 0.96)),
    repeating-linear-gradient(
      90deg,
      rgba(230, 103, 103, 0.08) 0,
      rgba(230, 103, 103, 0.08) 2px,
      transparent 2px,
      transparent 14px
    );
  text-align: center;
  padding: 72px 16px 88px;
`

const HeroInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
`

const HeroText = styled.h1`
  margin: 56px 0 0;
  color: #e66767;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.2;
  font-weight: 900;
`

const ContentWrap = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 36px 16px 72px;
`

const CardsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const RestaurantCard = styled.article`
  border: 1px solid rgba(230, 103, 103, 0.45);
  background: #fffaf7;
  box-shadow: 0 20px 45px rgba(121, 46, 46, 0.08);
`

const CardImage = styled.div`
  height: 218px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.18)),
    url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  position: relative;
`

const TagList = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`

const Tag = styled.span`
  background: #e66767;
  color: #ffebd9;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 8px;
`

const CardBody = styled.div`
  padding: 12px;
`

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  color: #e66767;
`

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  color: #e66767;
  font-weight: 700;

  &::after {
    content: '\\2605';
    color: #ffb930;
  }
`

const CardDescription = styled.p`
  margin: 0 0 16px;
  color: #e66767;
  line-height: 1.45;
  font-size: 0.9rem;
`

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e66767;
  color: #ffebd9;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 700;
`

const Footer = styled.footer`
  background: #ffe9d9;
  padding: 40px 16px 32px;
  text-align: center;
  border-top: 1px solid rgba(230, 103, 103, 0.12);
`

const Socials = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0 16px;
`

const SocialCircle = styled.a`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e66767;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
`

const FooterText = styled.p`
  max-width: 480px;
  margin: 0 auto;
  color: #e66767;
  font-size: 0.72rem;
  line-height: 1.5;
`

const CoverSection = styled.section`
  position: relative;
  min-height: 280px;
  display: flex;
  align-items: flex-end;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.7)),
    url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
`

const CoverInner = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 16px 36px;
`

const CoverCategory = styled.p`
  margin: 0 0 142px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 2rem;
  font-weight: 100;

  @media (max-width: 720px) {
    margin-bottom: 84px;
    font-size: 1.5rem;
  }
`

const CoverTitle = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 900;
`

const ProfileLayout = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 16px 80px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const ProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ProductCard = styled.article`
  background: #e66767;
  color: #ffebd9;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 338px;
`

const ProductImage = styled.img`
  width: 100%;
  height: 168px;
  object-fit: cover;
  display: block;
`

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`

const ProductDescription = styled.p`
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.45;
  flex: 1;
`

const ProductActions = styled.div`
  display: grid;
  gap: 8px;
`

const ProductButton = styled.button`
  border: 0;
  background: ${(props) => (props.$secondary ? '#c75b5b' : '#ffebd9')};
  color: ${(props) => (props.$secondary ? '#fff4eb' : '#e66767')};
  padding: 6px 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
`

const DesktopCart = styled.aside`
  background: #e66767;
  color: #ffebd9;
  padding: 16px;
  height: fit-content;
  position: sticky;
  top: 24px;

  @media (max-width: 980px) {
    display: none;
  }
`

const CartTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 1.05rem;
`

const CartList = styled.div`
  display: grid;
  gap: 12px;
`

const CartItemCard = styled.div`
  background: #ffebd9;
  color: #4b1d1d;
  padding: 10px;
`

const CartItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
  font-weight: 700;
`

const CartItemInfo = styled.p`
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
`

const CartFooter = styled.div`
  border-top: 1px solid rgba(255, 235, 217, 0.3);
  margin-top: 16px;
  padding-top: 16px;
  display: grid;
  gap: 12px;
`

const CartLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 700;
`

const EmptyCart = styled.p`
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
`

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: ${(props) => (props.$open ? 'block' : 'none')};
  z-index: ${(props) => props.$zIndex || 20};
`

const DrawerPanel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: min(92vw, 360px);
  height: 100vh;
  background: #e66767;
  color: #ffebd9;
  padding: 20px 16px;
  z-index: 21;
  transform: translateX(${(props) => (props.$open ? '0' : '100%')});
  transition: transform 0.25s ease;
  overflow-y: auto;
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`

const DrawerClose = styled.button`
  border: 1px solid rgba(255, 235, 217, 0.4);
  background: transparent;
  color: #ffebd9;
  width: 34px;
  height: 34px;
  cursor: pointer;
`

const QuantityButton = styled.button`
  border: 0;
  background: transparent;
  color: #e66767;
  cursor: pointer;
  padding: 0;
  font-weight: 700;
`

const NotFoundWrap = styled.main`
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  text-align: center;
`

const FeedbackState = styled.main`
  max-width: 1180px;
  min-height: 60vh;
  margin: 0 auto;
  padding: 64px 16px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #e66767;
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: ${(props) => (props.$open ? 'grid' : 'none')};
  place-items: center;
  padding: 16px;
  z-index: 40;
`

const ModalCard = styled.article`
  width: min(100%, 1024px);
  background: #e66767;
  color: #ffebd9;
  padding: 32px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  position: relative;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`

const ModalImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
`

const ModalClose = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #ffebd9;
  cursor: pointer;
  font-size: 20px;
`

const ModalTitle = styled.h2`
  margin: 0 0 12px;
  color: #ffebd9;
  font-size: 1.2rem;
`

const ModalText = styled.p`
  margin: 0 0 16px;
  line-height: 1.6;
  font-size: 0.92rem;
`

const ModalPortion = styled.p`
  margin: 0 0 16px;
  font-size: 0.9rem;
  font-weight: 700;
`

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function normalizeRestaurant(item) {
  return {
    id: String(item.id),
    title: item.titulo,
    featured: item.destacado,
    category: item.tipo,
    rating: item.avaliacao,
    description: item.descricao,
    coverImage: item.capa,
    heroImage: item.capa,
    products: item.cardapio.map((product) => ({
      id: String(product.id),
      name: product.nome,
      description: product.descricao,
      price: product.preco,
      image: product.foto,
      portion: product.porcao,
    })),
  }
}

function Logo() {
  return (
    <Brand to="/">
      efood<span>11</span>
    </Brand>
  )
}

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
      <PageShell>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                restaurants={restaurants}
                isLoading={isLoading}
                error={error}
                totalItems={totalItems}
                onOpenCart={() => dispatch(openCart())}
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
      </PageShell>
    </BrowserRouter>
  )
}

function HomePage({ restaurants, isLoading, error, totalItems, onOpenCart }) {
  return (
    <>
      <Header totalItems={totalItems} onOpenCart={onOpenCart} />
      <HeroSection>
        <HeroInner>
          <Logo />
          <HeroText>Viva experiencias gastronomicas no conforto da sua casa</HeroText>
        </HeroInner>
      </HeroSection>

      <ContentWrap>
        {isLoading && (
          <FeedbackBlock>Carregando restaurantes da API do eFood...</FeedbackBlock>
        )}

        {!isLoading && error && <FeedbackBlock>{error}</FeedbackBlock>}

        {!isLoading && !error && (
          <CardsGrid>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id}>
                <CardImage $image={restaurant.heroImage}>
                  <TagList>
                    {restaurant.featured && <Tag>Destaque da semana</Tag>}
                    <Tag>{restaurant.category}</Tag>
                  </TagList>
                </CardImage>

                <CardBody>
                  <CardHeader>
                    <CardTitle>{restaurant.title}</CardTitle>
                    <Rating>{restaurant.rating.toFixed(1)}</Rating>
                  </CardHeader>

                  <CardDescription>{restaurant.description}</CardDescription>
                  <ActionLink to={`/restaurantes/${restaurant.id}`}>Saiba mais</ActionLink>
                </CardBody>
              </RestaurantCard>
            ))}
          </CardsGrid>
        )}
      </ContentWrap>

      <AppFooter />
    </>
  )
}

const FeedbackBlock = styled.div`
  min-height: 240px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #e66767;
  font-weight: 700;
`

function Header({ totalItems, onOpenCart, restaurantName }) {
  return (
    <HeaderWrap>
      <HeaderContent>
        <HeaderSide>
          {restaurantName ? (
            <HeaderLink to="/">Restaurantes</HeaderLink>
          ) : (
            <HeaderButton
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Home
            </HeaderButton>
          )}
        </HeaderSide>

        <Logo />

        <HeaderSide style={{ justifyContent: 'flex-end' }}>
          <CartStatus type="button" onClick={onOpenCart}>
            {totalItems} produto(s) no carrinho
          </CartStatus>
        </HeaderSide>
      </HeaderContent>
    </HeaderWrap>
  )
}

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

  useEffect(() => {
    document.body.classList.toggle('overlay-open', isCartOpen || Boolean(selectedProduct))

    return () => {
      document.body.classList.remove('overlay-open')
    }
  }, [isCartOpen, selectedProduct])

  if (isLoading) {
    return (
      <>
        <Header totalItems={totalItems} onOpenCart={onOpenCart} restaurantName="Restaurantes" />
        <FeedbackState>Carregando cardapio da API do eFood...</FeedbackState>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header totalItems={totalItems} onOpenCart={onOpenCart} restaurantName="Restaurantes" />
        <FeedbackState>{error}</FeedbackState>
      </>
    )
  }

  if (!restaurant) {
    return <NotFoundPage />
  }

  return (
    <>
      <Header
        totalItems={totalItems}
        onOpenCart={onOpenCart}
        restaurantName={restaurant.title}
      />

      <CoverSection $image={restaurant.coverImage}>
        <CoverInner>
          <CoverCategory>{restaurant.category}</CoverCategory>
          <CoverTitle>{restaurant.title}</CoverTitle>
        </CoverInner>
      </CoverSection>

      <ProfileLayout>
        <ProductGrid>
          {restaurant.products.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductTitle>{product.name}</ProductTitle>
              <ProductDescription>{product.description}</ProductDescription>
              <ProductActions>
                <ProductButton
                  type="button"
                  $secondary
                  onClick={() => setSelectedProduct(product)}
                >
                  Mais detalhes
                </ProductButton>
                <ProductButton type="button" onClick={() => onAddToCart(restaurant, product)}>
                  Adicionar ao carrinho
                </ProductButton>
              </ProductActions>
            </ProductCard>
          ))}
        </ProductGrid>

        <DesktopCart>
          <CartContents
            cartItems={cartItems}
            totalPrice={totalPrice}
            onDecreaseItem={onDecreaseItem}
          />
        </DesktopCart>
      </ProfileLayout>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => {
          onAddToCart(restaurant, selectedProduct)
          setSelectedProduct(null)
        }}
      />

      <DrawerOverlay $open={isCartOpen} onClick={onCloseCart} />
      <DrawerPanel $open={isCartOpen}>
        <DrawerHeader>
          <CartTitle>Carrinho</CartTitle>
          <DrawerClose type="button" onClick={onCloseCart}>
            X
          </DrawerClose>
        </DrawerHeader>

        <CartContents
          cartItems={cartItems}
          totalPrice={totalPrice}
          onDecreaseItem={onDecreaseItem}
        />
      </DrawerPanel>

      <AppFooter />
    </>
  )
}

function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) {
    return null
  }

  return (
    <ModalOverlay $open={Boolean(product)} onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
        <ModalClose type="button" onClick={onClose}>
          ×
        </ModalClose>
        <ModalImage src={product.image} alt={product.name} />
        <div>
          <ModalTitle>{product.name}</ModalTitle>
          <ModalText>{product.description}</ModalText>
          <ModalPortion>Serve: {product.portion}</ModalPortion>
          <ProductButton type="button" onClick={onAddToCart}>
            Adicionar ao carrinho - {formatPrice(product.price)}
          </ProductButton>
        </div>
      </ModalCard>
    </ModalOverlay>
  )
}

function CartContents({ cartItems, totalPrice, onDecreaseItem }) {
  if (!cartItems.length) {
    return (
      <EmptyCart>
        Seu carrinho ainda esta vazio. Adicione um prato para visualizar o resumo do pedido.
      </EmptyCart>
    )
  }

  return (
    <>
      <CartList>
        {cartItems.map((item) => (
          <CartItemCard key={item.id}>
            <CartItemHeader>
              <span>{item.name}</span>
              <span>{formatPrice(item.price)}</span>
            </CartItemHeader>

            <CartItemInfo>
              {item.restaurantName}
              <br />
              Quantidade: {item.quantity}
            </CartItemInfo>

            <QuantityButton type="button" onClick={() => onDecreaseItem(item.id)}>
              remover um item
            </QuantityButton>
          </CartItemCard>
        ))}
      </CartList>

      <CartFooter>
        <CartLine>
          <span>Valor total</span>
          <span>{formatPrice(totalPrice)}</span>
        </CartLine>

        <ProductButton type="button">Continuar com a entrega</ProductButton>
      </CartFooter>
    </>
  )
}

function AppFooter() {
  return (
    <Footer>
      <Logo />
      <Socials>
        <SocialCircle href="/" aria-label="Instagram">
          ig
        </SocialCircle>
        <SocialCircle href="/" aria-label="Facebook">
          fb
        </SocialCircle>
        <SocialCircle href="/" aria-label="Twitter">
          tw
        </SocialCircle>
      </Socials>
      <FooterText>
        A eFood e uma plataforma para divulgacao de estabelecimentos, a responsabilidade
        pela entrega, qualidade dos produtos e toda do estabelecimento contratado.
      </FooterText>
    </Footer>
  )
}

function NotFoundPage() {
  return (
    <>
      <Header totalItems={0} onOpenCart={() => {}} />
      <NotFoundWrap>
        <div>
          <h1>Pagina nao encontrada</h1>
          <p>O conteudo solicitado nao existe nessa rota.</p>
          <ActionLink to="/">Voltar para a home</ActionLink>
        </div>
      </NotFoundWrap>
    </>
  )
}

export default App
