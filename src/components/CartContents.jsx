import styled from 'styled-components'
import { formatPrice } from '../utils/currency'

const List = styled.div`
  display: grid;
  gap: 16px;
`

const Item = styled.div`
  background: #ffebd9;
  color: #e66767;
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) 24px;
  gap: 8px;
  padding: 8px;
`

const Image = styled.img`
  width: 80px;
  height: 80px;
  display: block;
  object-fit: cover;
`

const Title = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 900;
`

const Price = styled.p`
  margin: 0;
  font-size: 14px;
`

const RemoveButton = styled.button`
  align-self: end;
  border: 0;
  background: transparent;
  color: #e66767;
  cursor: pointer;
  font-size: 16px;
  font-weight: 900;
  padding: 0;
`

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 40px 0 16px;
  color: #ffebd9;
  font-size: 14px;
  font-weight: 900;
`

const Button = styled.button`
  width: 100%;
  border: 0;
  background: #ffebd9;
  color: #e66767;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 900;
`

const Empty = styled.p`
  margin: 0;
  color: #ffebd9;
  font-size: 14px;
  line-height: 1.57;
`

function CartContents({ cartItems, totalPrice, onDecreaseItem, onCheckout }) {
  if (!cartItems.length) {
    return (
      <Empty>
        Seu carrinho ainda esta vazio. Adicione um prato para visualizar o resumo do pedido.
      </Empty>
    )
  }

  return (
    <>
      <List>
        {cartItems.map((item) => (
          <Item key={item.id}>
            <Image src={item.image} alt={item.name} />
            <div>
              <Title>{item.name}</Title>
              <Price>{formatPrice(item.price * item.quantity)}</Price>
            </div>
            <RemoveButton type="button" onClick={() => onDecreaseItem(item.id)}>
              X
            </RemoveButton>
          </Item>
        ))}
      </List>
      <Total>
        <span>Valor total</span>
        <span>{formatPrice(totalPrice)}</span>
      </Total>
      <Button type="button" onClick={onCheckout}>
        Continuar com a entrega
      </Button>
    </>
  )
}

export default CartContents
