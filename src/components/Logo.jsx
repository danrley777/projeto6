import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Brand = styled(Link)`
  width: 92px;
  height: 40px;
  border: 3px solid #e66767;
  color: #e66767;
  background-color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  text-transform: lowercase;

  @media (max-width: 640px) {
    width: 88px;
    height: 38px;
    font-size: 21px;
  }
`

function Logo() {
  return (
    <Brand to="/">
      efood
    </Brand>
  )
}

export default Logo
