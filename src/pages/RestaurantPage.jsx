import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { formatPrice } from '../utils/currency'

const Cover = styled.section`
  height: 280px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.$image});
  background-position: center;
  background-size: cover;
`

const CoverContent = styled.div`
  width: min(100%, 1024px);
  height: 100%;
  margin: 0 auto;
  padding: 24px 16px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Category = styled.p`
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 100;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 900;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`

const Main = styled.main`
  width: min(100%, 1024px);
  margin: 0 auto;
  padding: 56px 16px 120px;
`

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: ${(props) => (props.$open ? 'block' : 'none')};
  background: rgba(0, 0, 0, 0.72);
  z-index: 20;
`

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: min(92vw, 360px);
  height: 100vh;
  overflow-y: auto;
  background: #e66767;
  color: #ffebd9;
  padding: 20px 16px;
  transform: translateX(${(props) => (props.$open ? '0' : '100%')});
  transition: transform 0.25s ease;
  z-index: 21;
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`

const DrawerTitle = styled.h2`
  margin: 0;
  color: #ffebd9;
  font-size: 16px;
  font-weight: 900;
`

const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 235, 217, 0.5);
  background: transparent;
  color: #ffebd9;
  cursor: pointer;
  font-weight: 900;
`

const CartList = styled.div`
  display: grid;
  gap: 12px;
`

const CartItem = styled.article`
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) auto;
  gap: 8px;
  background: #ffebd9;
  color: #e66767;
  padding: 8px;
`

const CartImage = styled.img`
  width: 80px;
  height: 80px;
  display: block;
  object-fit: cover;
`

const CartName = styled.h3`
  margin: 0 0 8px;
  color: #e66767;
  font-size: 14px;
  font-weight: 900;
`

const CartText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
`

const RemoveButton = styled.button`
  border: 0;
  background: transparent;
  color: #e66767;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  font-weight: 900;
`

const CartSummary = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
`

const TotalLine = styled.p`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  font-size: 14px;
  font-weight: 900;
`

const EmptyCart = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`

const CheckoutForm = styled.form`
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

const FieldLabel = styled.label`
  color: #ffebd9;
  font-size: 12px;
  font-weight: 900;
`

const FieldInput = styled.input`
  width: 100%;
  border: 0;
  background: #ffebd9;
  color: #4b1d1d;
  padding: 8px;
  font-size: 14px;

  &:invalid {
    outline: 2px solid rgba(255, 255, 255, 0.85);
  }
`

const ActionButton = styled.button`
  width: 100%;
  border: 0;
  background: ${(props) => (props.$secondary ? '#f8d8c3' : '#ffebd9')};
  color: #e66767;
  cursor: pointer;
  padding: 8px;
  font-size: 14px;
  font-weight: 900;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`

const ErrorMessage = styled.p`
  margin: 8px 0 0;
  color: #fff;
  font-size: 12px;
  line-height: 1.5;
`

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

const onlyDigits = (value) => value.replace(/\D/g, '')

const formatZipCode = (value) => {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

const formatCardNumber = (value) =>
  onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const validateDeliveryForm = (form) => {
  if (form.receiver.trim().length < 2) {
    return 'Informe o nome de quem ira receber.'
  }

  if (form.addressDescription.trim().length < 4) {
    return 'Informe um endereco valido.'
  }

  if (form.city.trim().length < 2) {
    return 'Informe uma cidade valida.'
  }

  if (onlyDigits(form.zipCode).length !== 8) {
    return 'Informe um CEP com 8 numeros.'
  }

  if (!/^\d{1,6}$/.test(form.number)) {
    return 'Informe apenas numeros no campo Numero.'
  }

  return ''
}

const validatePaymentForm = (form) => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  const month = Number(form.month)
  const year = Number(form.year)

  if (form.cardName.trim().length < 3) {
    return 'Informe o nome impresso no cartao.'
  }

  if (onlyDigits(form.cardNumber).length !== 16) {
    return 'Informe os 16 numeros do cartao.'
  }

  if (!/^\d{3,4}$/.test(form.code)) {
    return 'Informe um CVV com 3 ou 4 numeros.'
  }

  if (!/^(0?[1-9]|1[0-2])$/.test(form.month)) {
    return 'Informe um mes de vencimento entre 1 e 12.'
  }

  if (!/^\d{4}$/.test(form.year) || year < currentYear || year > 2099) {
    return 'Informe um ano de vencimento valido.'
  }

  if (year === currentYear && month < currentMonth) {
    return 'O cartao informado esta vencido.'
  }

  return ''
}

function RestaurantPage({
  restaurants,
  isLoading,
  error,
  cartItems,
  cartItemsCount,
  cartTotal,
  isCartOpen,
  onOpenCart,
  onCloseCart,
  onAddToCart,
  onRemoveSingleItem,
  onClearCart,
}) {
  const { restaurantId } = useParams()
  const restaurant = restaurants.find((item) => item.id === restaurantId)
  const [checkoutStep, setCheckoutStep] = useState('cart')
  const [deliveryForm, setDeliveryForm] = useState(initialDeliveryForm)
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm)
  const [orderId, setOrderId] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('overlay-open', isCartOpen)

    return () => {
      document.body.classList.remove('overlay-open')
    }
  }, [isCartOpen])

  useEffect(() => {
    if (!isCartOpen) {
      setCheckoutStep('cart')
      setCheckoutError('')
      setIsSubmittingOrder(false)
    }
  }, [isCartOpen])

  if (isLoading) {
    return (
      <>
        <Header />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
      </>
    )
  }

  if (!restaurant) {
    return null
  }

  return (
    <>
      <Header cartItemsCount={cartItemsCount} onOpenCart={onOpenCart} />
      <Cover $image={restaurant.coverImage}>
        <CoverContent>
          <Category>{restaurant.category}</Category>
          <Title>{restaurant.title}</Title>
        </CoverContent>
      </Cover>
      <Main>
        <Grid>
          {restaurant.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(restaurant, product)}
            />
          ))}
        </Grid>
      </Main>
      <DrawerOverlay $open={isCartOpen} onClick={onCloseCart} />
      <Drawer $open={isCartOpen}>
        {checkoutStep === 'cart' && (
          <>
            <DrawerHeader>
              <DrawerTitle>Carrinho</DrawerTitle>
              <CloseButton type="button" onClick={onCloseCart}>
                X
              </CloseButton>
            </DrawerHeader>

            {!cartItems.length && (
              <EmptyCart>Seu carrinho ainda esta vazio.</EmptyCart>
            )}

            {!!cartItems.length && (
              <>
                <CartList>
                  {cartItems.map((item) => (
                    <CartItem key={item.id}>
                      <CartImage src={item.image} alt={item.name} />
                      <div>
                        <CartName>{item.name}</CartName>
                        <CartText>
                          {item.quantity}x {formatPrice(item.price)}
                        </CartText>
                      </div>
                      <RemoveButton
                        type="button"
                        onClick={() => onRemoveSingleItem(item.id)}
                        aria-label={`Remover ${item.name}`}
                      >
                        X
                      </RemoveButton>
                    </CartItem>
                  ))}
                </CartList>

                <CartSummary>
                  <TotalLine>
                    <span>Valor total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </TotalLine>
                  <ActionButton type="button" onClick={() => setCheckoutStep('delivery')}>
                    Continuar com a entrega
                  </ActionButton>
                </CartSummary>
              </>
            )}
          </>
        )}

        {checkoutStep === 'delivery' && (
          <>
            <DrawerHeader>
              <DrawerTitle>Entrega</DrawerTitle>
              <CloseButton type="button" onClick={onCloseCart}>
                X
              </CloseButton>
            </DrawerHeader>

            <CheckoutForm
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                const errorMessage = validateDeliveryForm(deliveryForm)

                if (errorMessage) {
                  setCheckoutError(errorMessage)
                  return
                }

                setCheckoutError('')
                setCheckoutStep('payment')
              }}
            >
              <FieldGroup>
                <FieldLabel htmlFor="receiver">Quem ira receber</FieldLabel>
                <FieldInput
                  id="receiver"
                  name="receiver"
                  value={deliveryForm.receiver}
                  maxLength={60}
                  pattern=".{2,}"
                  required
                  onChange={(event) =>
                    setDeliveryForm((current) => ({
                      ...current,
                      receiver: event.target.value,
                    }))
                  }
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="addressDescription">Endereco</FieldLabel>
                <FieldInput
                  id="addressDescription"
                  name="addressDescription"
                  value={deliveryForm.addressDescription}
                  maxLength={80}
                  pattern=".{4,}"
                  required
                  onChange={(event) =>
                    setDeliveryForm((current) => ({
                      ...current,
                      addressDescription: event.target.value,
                    }))
                  }
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="city">Cidade</FieldLabel>
                <FieldInput
                  id="city"
                  name="city"
                  value={deliveryForm.city}
                  maxLength={50}
                  pattern=".{2,}"
                  required
                  onChange={(event) =>
                    setDeliveryForm((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                />
              </FieldGroup>

              <FieldRow>
                <FieldGroup>
                  <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
                  <FieldInput
                    id="zipCode"
                    name="zipCode"
                    value={deliveryForm.zipCode}
                    inputMode="numeric"
                    maxLength={9}
                    pattern="\d{5}-?\d{3}"
                    required
                    onChange={(event) =>
                      setDeliveryForm((current) => ({
                        ...current,
                        zipCode: formatZipCode(event.target.value),
                      }))
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="number">Numero</FieldLabel>
                  <FieldInput
                    id="number"
                    name="number"
                    value={deliveryForm.number}
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{1,6}"
                    required
                    onChange={(event) =>
                      setDeliveryForm((current) => ({
                        ...current,
                        number: onlyDigits(event.target.value).slice(0, 6),
                      }))
                    }
                  />
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <FieldLabel htmlFor="complement">Complemento (opcional)</FieldLabel>
                <FieldInput
                  id="complement"
                  name="complement"
                  value={deliveryForm.complement}
                  maxLength={40}
                  onChange={(event) =>
                    setDeliveryForm((current) => ({
                      ...current,
                      complement: event.target.value,
                    }))
                  }
                />
              </FieldGroup>

              {checkoutError && <ErrorMessage>{checkoutError}</ErrorMessage>}

              <ActionButton type="submit">Continuar com o pagamento</ActionButton>
              <ActionButton
                type="button"
                $secondary
                onClick={() => {
                  setCheckoutError('')
                  setCheckoutStep('cart')
                }}
              >
                Voltar para o carrinho
              </ActionButton>
            </CheckoutForm>
          </>
        )}

        {checkoutStep === 'payment' && (
          <>
            <DrawerHeader>
              <DrawerTitle>Pagamento - {formatPrice(cartTotal)}</DrawerTitle>
              <CloseButton type="button" onClick={onCloseCart}>
                X
              </CloseButton>
            </DrawerHeader>

            <CheckoutForm
              noValidate
              onSubmit={async (event) => {
                event.preventDefault()
                const errorMessage = validatePaymentForm(paymentForm)

                if (errorMessage) {
                  setCheckoutError(errorMessage)
                  return
                }

                setCheckoutError('')
                setIsSubmittingOrder(true)

                try {
                  const response = await fetch(
                    'https://api-ebac.vercel.app/api/efood/checkout',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        products: cartItems.flatMap((item) =>
                          Array.from({ length: item.quantity }, () => ({
                            id: Number(item.id),
                            price: item.price,
                          })),
                        ),
                        delivery: {
                          receiver: deliveryForm.receiver.trim(),
                          address: {
                            description: deliveryForm.addressDescription.trim(),
                            city: deliveryForm.city.trim(),
                            zipCode: onlyDigits(deliveryForm.zipCode),
                            number: Number(deliveryForm.number),
                            complement: deliveryForm.complement.trim(),
                          },
                        },
                        payment: {
                          card: {
                            name: paymentForm.cardName.trim(),
                            number: onlyDigits(paymentForm.cardNumber),
                            code: Number(paymentForm.code),
                            expires: {
                              month: Number(paymentForm.month),
                              year: Number(paymentForm.year),
                            },
                          },
                        },
                      }),
                    },
                  )

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
              }}
            >
              <FieldGroup>
                <FieldLabel htmlFor="cardName">Nome no cartao</FieldLabel>
                <FieldInput
                  id="cardName"
                  name="cardName"
                  value={paymentForm.cardName}
                  maxLength={60}
                  pattern=".{3,}"
                  required
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      cardName: event.target.value,
                    }))
                  }
                />
              </FieldGroup>

              <FieldRow $columns="minmax(0, 1fr) 80px">
                <FieldGroup>
                  <FieldLabel htmlFor="cardNumber">Numero do cartao</FieldLabel>
                  <FieldInput
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    inputMode="numeric"
                    maxLength={19}
                    pattern="(?:\d{4}\s?){4}"
                    required
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        cardNumber: formatCardNumber(event.target.value),
                      }))
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="code">CVV</FieldLabel>
                  <FieldInput
                    id="code"
                    name="code"
                    value={paymentForm.code}
                    inputMode="numeric"
                    maxLength={4}
                    pattern="\d{3,4}"
                    required
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        code: onlyDigits(event.target.value).slice(0, 4),
                      }))
                    }
                  />
                </FieldGroup>
              </FieldRow>

              <FieldRow>
                <FieldGroup>
                  <FieldLabel htmlFor="month">Mes de vencimento</FieldLabel>
                  <FieldInput
                    id="month"
                    name="month"
                    value={paymentForm.month}
                    inputMode="numeric"
                    maxLength={2}
                    pattern="0?[1-9]|1[0-2]"
                    required
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        month: onlyDigits(event.target.value).slice(0, 2),
                      }))
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="year">Ano de vencimento</FieldLabel>
                  <FieldInput
                    id="year"
                    name="year"
                    value={paymentForm.year}
                    inputMode="numeric"
                    maxLength={4}
                    pattern="\d{4}"
                    required
                    onChange={(event) =>
                      setPaymentForm((current) => ({
                        ...current,
                        year: onlyDigits(event.target.value).slice(0, 4),
                      }))
                    }
                  />
                </FieldGroup>
              </FieldRow>

              {checkoutError && <ErrorMessage>{checkoutError}</ErrorMessage>}

              <ActionButton type="submit" disabled={isSubmittingOrder}>
                {isSubmittingOrder ? 'Finalizando...' : 'Finalizar pagamento'}
              </ActionButton>
              <ActionButton
                type="button"
                $secondary
                onClick={() => {
                  setCheckoutError('')
                  setCheckoutStep('delivery')
                }}
              >
                Voltar para a edicao de endereco
              </ActionButton>
            </CheckoutForm>
          </>
        )}

        {checkoutStep === 'confirmation' && (
          <>
            <DrawerHeader>
              <DrawerTitle>Pedido realizado - {orderId}</DrawerTitle>
              <CloseButton type="button" onClick={onCloseCart}>
                X
              </CloseButton>
            </DrawerHeader>
            <EmptyCart>
              Estamos felizes em informar que seu pedido ja esta em preparacao e em
              breve sera entregue no endereco fornecido.
            </EmptyCart>
            <ActionButton
              type="button"
              onClick={() => {
                onClearCart()
                setDeliveryForm(initialDeliveryForm)
                setPaymentForm(initialPaymentForm)
                setOrderId('')
                setCheckoutError('')
                setCheckoutStep('cart')
              }}
            >
              Concluir
            </ActionButton>
          </>
        )}
      </Drawer>
      <Footer />
    </>
  )
}

export default RestaurantPage
