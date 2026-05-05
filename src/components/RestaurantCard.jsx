import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.article`
  background: #fff;
  border: 1px solid #e66767;
  color: #e66767;
`

const Image = styled.div`
  height: 217px;
  background-image: url(${(props) => props.$image});
  background-position: center;
  background-size: cover;
  position: relative;
`

const Tags = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
`

const Tag = styled.span`
  background: #e66767;
  color: #ffebd9;
  font-size: 12px;
  font-weight: 900;
  padding: 6px 8px;
`

const Body = styled.div`
  padding: 8px;
`

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
`

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 900;

  &::after {
    content: '\\2605';
    color: #ffb930;
  }
`

const Description = styled.p`
  min-height: 88px;
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.57;
`

const Button = styled(Link)`
  display: inline-block;
  background: #e66767;
  color: #ffebd9;
  padding: 4px 6px;
  font-size: 14px;
  font-weight: 900;
`

function RestaurantCard({ restaurant }) {
  return (
    <Card>
      <Image $image={restaurant.coverImage}>
        <Tags>
          {restaurant.featured && <Tag>Destaque da semana</Tag>}
          <Tag>{restaurant.category}</Tag>
        </Tags>
      </Image>
      <Body>
        <Heading>
          <Title>{restaurant.title}</Title>
          <Rating>{restaurant.rating.toFixed(1)}</Rating>
        </Heading>
        <Description>{restaurant.description}</Description>
        <Button to={`/restaurantes/${restaurant.id}`}>Saiba mais</Button>
      </Body>
    </Card>
  )
}

export default RestaurantCard
