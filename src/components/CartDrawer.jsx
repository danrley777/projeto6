import { useEffect, useState } from 'react'
import styled from 'styled-components'
import CartContents from './CartContents'
import { formatPrice } from '../utils/currency'

const initialDeliveryForm = {
  receiver: '',
  addressDescription: '',
  city: '',
  zipCode: '',
  number: '',
  complement: '',
}

const initialPaymentForm = {
  cardName: '',
  cardNumber: '',
  code: '',
  month: '',
  year: '',
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: ${(props) => (props.$open ? 'block' : 'none')};
  background: rgba(0, 0, 0, 0.72);
`

const Panel = styled.aside`
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 21;
  width: min(100%, 360px);
  background: #e66767;
  color: #ffebd9;
  padding: 32px 8px;
  overflow-y: auto;
  transform: translateX(${(props) => (props.$open ? '0' : '100%')});
  transition: transform 0.25s ease;
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`

const Title = styled.h2`
  margin: 0;
  color: #ffebd9;
  font-size: 16px;
  font-weight: 900;
`

const CloseButton = styled.button`
  border: 1px solid rgba(255, 235, 217, 0.5);
  background: transparent;
  color: #ffebd9;
  cursor: pointer;
  width: 32px;
  height: 32px;
  font-weight: 900;
`

const Form = styled.form`
  display: grid;
  gap: 8px;
`

const FieldGroup = styled.div`
  display: grid;
  gap: 4px;
`

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns || '1fr 1fr'};
  gap: 8px;
`

const Label = styled.label`
  color: #ffebd9;
  font-size: 14px;
  font-weight: 900;
`

const Input = styled.input`
  width: 100%;
  border: 0;
  background: #ffebd9;
  color: #4b1d1d;
  padding: 8px;
  font-size: 14px;
`

const Button = styled.button`
  border: 0;
  background: ${(props) => (props.$secondary ? '#f8d8c3' : '#ffebd9')};
  color: #e66767;
  cursor: pointer;
  margin-top: ${(props) => (props.$spaced ? '16px' : '0')};
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 900;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`

const Text = styled.p`
  margin: 0 0 16px;
  color: #ffebd9;
  font-size: 14px;
  line-height: 1.57;
`

const ErrorMessage = styled.p`
  margin: 8px 0 0;
  color: #fff2ea;
  font-size: 13px;
  line-height: 1.5;
`

function CartDrawer({
  cartItems,
  totalPrice,
  isOpen,
  onClose,
  onDecreaseItem,
  onFinishOrder,
}) {
  const [checkoutStep, setCheckoutStep] = useState('cart')
  const [deliveryForm, setDeliveryForm] = useState(initialDeliveryForm)
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm)
  const [orderId, setOrderId] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep('cart')
      setCheckoutError('')
      setIsSubmittingOrder(false)
    }
  }, [isOpen])

  const handleDeliveryChange = (event) => {
    const { name, value } = event.target
    setDeliveryForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handlePaymentChange = (event) => {
    const { name, value } = event.target
    setPaymentForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleDeliverySubmit = (event) => {
    event.preventDefault()
    setCheckoutError('')
    setCheckoutStep('payment')
  }

  const handlePaymentSubmit = async (event) => {
    event.preventDefault()
    setCheckoutError('')
    setIsSubmittingOrder(true)

    const payload = {
      products: cartItems.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({
          id: Number(item.id),
          price: item.price,
        })),
      ),
      delivery: {
        receiver: deliveryForm.receiver,
        address: {
          description: deliveryForm.addressDescription,
          city: deliveryForm.city,
          zipCode: deliveryForm.zipCode,
          number: Number(deliveryForm.number),
          complement: deliveryForm.complement,
        },
      },
      payment: {
        card: {
          name: paymentForm.cardName,
          number: paymentForm.cardNumber,
          code: Number(paymentForm.code),
          expires: {
            month: Number(paymentForm.month),
            year: Number(paymentForm.year),
          },
        },
      },
    }

    try {
      const response = await fetch('https://api-ebac.vercel.app/api/efood/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Falha ao concluir pedido')
      }

      const data = await response.json()
      setOrderId(data.orderId)
      setCheckoutStep('confirmation')
    } catch (submitError) {
      setCheckoutError('Nao foi possivel finalizar o pagamento. Tente novamente.')
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const handleFinishOrder = () => {
    onFinishOrder()
    setDeliveryForm(initialDeliveryForm)
    setPaymentForm(initialPaymentForm)
    setOrderId('')
    setCheckoutStep('cart')
    setCheckoutError('')
  }

  return (
    <>
      <Overlay $open={isOpen} onClick={onClose} />
      <Panel $open={isOpen}>
        {checkoutStep === 'cart' && (
          <>
            <DrawerHeader>
              <Title>Carrinho</Title>
              <CloseButton type="button" onClick={onClose}>
                X
              </CloseButton>
            </DrawerHeader>
            <CartContents
              cartItems={cartItems}
              totalPrice={totalPrice}
              onDecreaseItem={onDecreaseItem}
              onCheckout={() => setCheckoutStep('delivery')}
            />
          </>
        )}

        {checkoutStep === 'delivery' && (
          <>
            <Title>Entrega</Title>
            <Form onSubmit={handleDeliverySubmit}>
              <FieldGroup>
                <Label htmlFor="receiver">Quem ira receber</Label>
                <Input id="receiver" name="receiver" value={deliveryForm.receiver} onChange={handleDeliveryChange} required />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="addressDescription">Endereco</Label>
                <Input id="addressDescription" name="addressDescription" value={deliveryForm.addressDescription} onChange={handleDeliveryChange} required />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" name="city" value={deliveryForm.city} onChange={handleDeliveryChange} required />
              </FieldGroup>
              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" name="zipCode" value={deliveryForm.zipCode} onChange={handleDeliveryChange} required />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="number">Numero</Label>
                  <Input id="number" name="number" type="number" value={deliveryForm.number} onChange={handleDeliveryChange} required />
                </FieldGroup>
              </FieldRow>
              <FieldGroup>
                <Label htmlFor="complement">Complemento (opcional)</Label>
                <Input id="complement" name="complement" value={deliveryForm.complement} onChange={handleDeliveryChange} />
              </FieldGroup>
              <Button type="submit" $spaced>
                Continuar com o pagamento
              </Button>
              <Button type="button" $secondary onClick={() => setCheckoutStep('cart')}>
                Voltar para o carrinho
              </Button>
            </Form>
          </>
        )}

        {checkoutStep === 'payment' && (
          <>
            <Title>Pagamento - Valor a pagar {formatPrice(totalPrice)}</Title>
            <Form onSubmit={handlePaymentSubmit}>
              <FieldGroup>
                <Label htmlFor="cardName">Nome no cartao</Label>
                <Input id="cardName" name="cardName" value={paymentForm.cardName} onChange={handlePaymentChange} required />
              </FieldGroup>
              <FieldRow $columns="minmax(0, 1fr) 80px">
                <FieldGroup>
                  <Label htmlFor="cardNumber">Numero do cartao</Label>
                  <Input id="cardNumber" name="cardNumber" value={paymentForm.cardNumber} onChange={handlePaymentChange} required />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="code">CVV</Label>
                  <Input id="code" name="code" value={paymentForm.code} onChange={handlePaymentChange} required />
                </FieldGroup>
              </FieldRow>
              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="month">Mes de vencimento</Label>
                  <Input id="month" name="month" value={paymentForm.month} onChange={handlePaymentChange} required />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="year">Ano de vencimento</Label>
                  <Input id="year" name="year" value={paymentForm.year} onChange={handlePaymentChange} required />
                </FieldGroup>
              </FieldRow>
              {checkoutError && <ErrorMessage>{checkoutError}</ErrorMessage>}
              <Button type="submit" $spaced disabled={isSubmittingOrder}>
                {isSubmittingOrder ? 'Finalizando...' : 'Finalizar pagamento'}
              </Button>
              <Button type="button" $secondary onClick={() => setCheckoutStep('delivery')}>
                Voltar para a edicao de endereco
              </Button>
            </Form>
          </>
        )}

        {checkoutStep === 'confirmation' && (
          <>
            <Title>Pedido realizado - {orderId}</Title>
            <Text>
              Estamos felizes em informar que seu pedido ja esta em processo de preparacao e,
              em breve, sera entregue no endereco fornecido.
            </Text>
            <Text>
              Gostariamos de ressaltar que nossos entregadores nao realizam alteracoes no
              endereco informado.
            </Text>
            <Text>
              Lembre-se da importancia de higienizar as maos apos o recebimento do pedido,
              garantindo assim mais seguranca para a refeicao.
            </Text>
            <Text>Esperamos que desfrute de uma deliciosa experiencia gastronomica.</Text>
            <Button type="button" onClick={handleFinishOrder}>
              Concluir
            </Button>
          </>
        )}
      </Panel>
    </>
  )
}

export default CartDrawer
