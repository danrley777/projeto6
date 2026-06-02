import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Logo from './Logo'

const HeaderWrap = styled.header`
  height: 120px;
  background:
    linear-gradient(rgba(255, 235, 217, 0.92), rgba(255, 235, 217, 0.92)),
    url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e66767' fill-opacity='0.08'%3E%3Cpath d='M10 7h1v9h-1zM13 7h1v9h-1zM16 7h1v9h-1zM13 15h1v22h-1zM31 7c3 4 3 8 0 12v18h-2V7h2z'/%3E%3C/g%3E%3C/svg%3E");
  background-color: #ffebd9;

  @media (max-width: 640px) {
    height: auto;
  }
`

const HeaderContent = styled.div`
  width: min(100%, 1024px);
  height: 120px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;

  @media (max-width: 640px) {
    height: auto;
    padding: 24px 16px;
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`

const HeaderLink = styled(Link)`
  font-size: 14px;
  font-weight: 900;
`

const Spacer = styled.div``

const CartButton = styled.button`
  border: 0;
  background: transparent;
  color: #e66767;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: 900;
  text-align: right;

  @media (max-width: 640px) {
    text-align: center;
  }
`

function Header({ cartItemsCount = 0, onOpenCart }) {
  return (
    <HeaderWrap>
      <HeaderContent>
        <HeaderLink to="/">Restaurantes</HeaderLink>
        <Logo />
        {onOpenCart ? (
          <CartButton type="button" onClick={onOpenCart}>
            {cartItemsCount} produto(s) no carrinho
          </CartButton>
        ) : (
          <Spacer />
        )}
      </HeaderContent>
    </HeaderWrap>
  )
}

export default Header
