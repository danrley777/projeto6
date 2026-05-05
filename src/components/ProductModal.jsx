import styled from 'styled-components'
import { formatPrice } from '../utils/currency'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: ${(props) => (props.$open ? 'grid' : 'none')};
  place-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.72);
`

const Card = styled.article`
  width: min(100%, 1024px);
  min-height: 344px;
  background: #e66767;
  color: #ffebd9;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  padding: 32px;
  position: relative;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding: 24px;
  }
`

const Image = styled.img`
  width: 100%;
  height: 280px;
  display: block;
  object-fit: cover;
`

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  border: 0;
  background: transparent;
  color: #ffebd9;
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
`

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 900;
`

const Text = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.57;
`

const AddButton = styled.button`
  border: 0;
  background: #ffebd9;
  color: #e66767;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 900;
`

function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) {
    return null
  }

  return (
    <Overlay $open={Boolean(product)} onClick={onClose}>
      <Card onClick={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          X
        </CloseButton>
        <Image src={product.image} alt={product.name} />
        <div>
          <Title>{product.name}</Title>
          <Text>{product.description}</Text>
          <Text>Serve: {product.portion}</Text>
          <AddButton type="button" onClick={onAddToCart}>
            Adicionar ao carrinho - {formatPrice(product.price)}
          </AddButton>
        </div>
      </Card>
    </Overlay>
  )
}

export default ProductModal
