import styled from 'styled-components'

const Card = styled.article`
  background: #e66767;
  color: #ffebd9;
  display: flex;
  min-height: 338px;
  padding: 8px;
  flex-direction: column;
`

const Image = styled.img`
  width: 100%;
  height: 167px;
  display: block;
  object-fit: cover;
`

const Title = styled.h3`
  margin: 8px 0;
  font-size: 16px;
  font-weight: 900;
`

const Description = styled.p`
  flex: 1;
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.57;
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

function ProductCard({ product, onAddToCart }) {
  return (
    <Card>
      <Image src={product.image} alt={product.name} />
      <Title>{product.name}</Title>
      <Description>{product.description}</Description>
      <Button type="button" onClick={onAddToCart}>
        Adicionar ao carrinho
      </Button>
    </Card>
  )
}

export default ProductCard
