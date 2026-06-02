import styled from 'styled-components'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Logo from '../components/Logo'
import RestaurantCard from '../components/RestaurantCard'

const Hero = styled.header`
  height: 384px;
  background:
    linear-gradient(rgba(255, 235, 217, 0.92), rgba(255, 235, 217, 0.92)),
    url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e66767' fill-opacity='0.08'%3E%3Cpath d='M10 7h1v9h-1zM13 7h1v9h-1zM16 7h1v9h-1zM13 15h1v22h-1zM31 7c3 4 3 8 0 12v18h-2V7h2z'/%3E%3C/g%3E%3C/svg%3E");
  background-color: #ffebd9;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  text-align: center;

  @media (max-width: 640px) {
    height: 320px;
    padding-top: 32px;
  }
`

const HeroContent = styled.div`
  width: min(100%, 720px);
`

const Title = styled.h1`
  margin: 138px auto 0;
  max-width: 540px;
  color: #e66767;
  font-size: 36px;
  font-weight: 900;
  line-height: 1.17;

  @media (max-width: 640px) {
    margin-top: 88px;
    font-size: 28px;
  }
`

const Main = styled.main`
  width: min(100%, 1024px);
  margin: 0 auto;
  padding: 80px 16px 120px;
`

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px 80px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const Message = styled.p`
  margin: 0;
  min-height: 240px;
  display: grid;
  place-items: center;
  color: #e66767;
  font-size: 18px;
  font-weight: 900;
`

function HomePage({ restaurants, isLoading, error, cartItemsCount, onOpenCart }) {
  return (
    <>
      <Header cartItemsCount={cartItemsCount} onOpenCart={onOpenCart} />
      <Hero>
        <HeroContent>
          <Logo />
          <Title>Viva experiencias gastronomicas no conforto da sua casa</Title>
        </HeroContent>
      </Hero>
      <Main>
        {isLoading && <Message>Carregando restaurantes da API do eFood...</Message>}
        {!isLoading && error && <Message>{error}</Message>}
        {!isLoading && !error && (
          <Grid>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </Grid>
        )}
      </Main>
      <Footer />
    </>
  )
}

export default HomePage
