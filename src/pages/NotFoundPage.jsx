import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Footer from '../components/Footer'

const Wrap = styled.main`
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 48px 16px;
  text-align: center;
`

const Title = styled.h1`
  margin: 0 0 16px;
  color: #e66767;
  font-size: 32px;
`

const Text = styled.p`
  margin: 0 0 24px;
  color: #e66767;
`

const Button = styled(Link)`
  display: inline-block;
  background: #e66767;
  color: #ffebd9;
  padding: 8px 12px;
  font-weight: 900;
`

function NotFoundPage() {
  return (
    <>
      <Wrap>
        <div>
          <Title>Pagina nao encontrada</Title>
          <Text>O conteudo solicitado nao existe nessa rota.</Text>
          <Button to="/">Voltar para a home</Button>
        </div>
      </Wrap>
      <Footer />
    </>
  )
}

export default NotFoundPage
