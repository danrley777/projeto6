import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
    addItem: (state, action) => {
      const incomingItem = action.payload
      const existingItem = state.items.find((item) => item.id === incomingItem.id)

      if (existingItem) {
        existingItem.quantity += 1
        state.isOpen = true
        return
      }

      state.items.push({
        ...incomingItem,
        quantity: 1,
      })
      state.isOpen = true
    },
    removeSingleItem: (state, action) => {
      const productId = action.payload
      const existingItem = state.items.find((item) => item.id === productId)

      if (!existingItem) {
        return
      }

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== productId)
        return
      }

      existingItem.quantity -= 1
    },
    clearCart: (state) => {
      state.items = []
      state.isOpen = false
    },
  },
})

export const { addItem, clearCart, closeCart, openCart, removeSingleItem } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartIsOpen = (state) => state.cart.isOpen
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity * item.price, 0)

export default cartSlice.reducer
