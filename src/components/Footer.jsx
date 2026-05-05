import styled from 'styled-components'
import Logo from './Logo'

const FooterWrap = styled.footer`
  background: #ffebd9;
  padding: 40px 16px;
  text-align: center;
`

const Socials = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 32px 0 24px;
`

const SocialLink = styled.a`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  background: #e66767;
  color: #ffebd9;
  font-size: 11px;
  font-weight: 700;
`

const FooterText = styled.p`
  max-width: 480px;
  margin: 0 auto;
  color: #e66767;
  font-size: 10px;
  line-height: 1.5;
`

function Footer() {
  return (
    <FooterWrap>
      <Logo />
      <Socials>
        <SocialLink href="/" aria-label="Instagram">
          ig
        </SocialLink>
        <SocialLink href="/" aria-label="Facebook">
          fb
        </SocialLink>
        <SocialLink href="/" aria-label="Twitter">
          tw
        </SocialLink>
      </Socials>
      <FooterText>
        A eFood e uma plataforma para divulgacao de estabelecimentos, a responsabilidade
        pela entrega, qualidade dos produtos e toda do estabelecimento contratado.
      </FooterText>
    </FooterWrap>
  )
}

export default Footer
