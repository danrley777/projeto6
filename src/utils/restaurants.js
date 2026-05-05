export function normalizeRestaurant(item) {
  return {
    id: String(item.id),
    title: item.titulo,
    featured: item.destacado,
    category: item.tipo,
    rating: item.avaliacao,
    description: item.descricao,
    coverImage: item.capa,
    products: item.cardapio.map((product) => ({
      id: String(product.id),
      name: product.nome,
      description: product.descricao,
      price: product.preco,
      image: product.foto,
      portion: product.porcao,
    })),
  }
}
