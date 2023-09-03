const pool = require("../db/conexion")
const format = require("pg-format")

const getProducts = async ({ limit = 3, page = 0, order_by = "id_asc" }) => {
  const [campo, direccion] = order_by.split("_")
  const offset = limit * page
  const formattedQuery = format(
    "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limit,
    offset
  )
  pool.query(formattedQuery)
  const { rows: inventario } = await pool.query(formattedQuery)
  return inventario
}

const getHATEOAS = (inventario) => {
  const results = inventario.map((inventario) => ({
    id: inventario.id,
    url: `/products/product/${inventario.id}`,
    nombre: inventario.nombre,
    categoria: inventario.categoria,
    metal: inventario.metal,
    precio: inventario.precio,
    stock: inventario.stock,
  }))

  const totalProducts = 6
  const totalProductsxPages = results.length

  const HATEOAS = {
    totalProducts,
    totalProductsxPages,
    page,
    results,
  }

  return HATEOAS
}

const getProduct = async (id) => {
  const { rows } = await pool.query("select * from inventario where id = $1", [
    id,
  ])
  return rows[0]
}

const getJoyasPorFiltros = async ({
  precio_max,
  precio_min,
  categoria,
  metal,
}) => {
  let filtros = []
  const values = []
  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor)
    const { length } = filtros
    filtros.push(`${campo} ${comparador} $${length + 1}`)
  }

  if (precio_max) agregarFiltro("precio", "<=", precio_max)
  if (precio_min) agregarFiltro("precio", ">=", precio_min)
  if (categoria) agregarFiltro("categoria", "ilike", `%${categoria}%`)
  if (metal) agregarFiltro("metal", "ilike", `%${metal}%`)
  let consulta = "SELECT * FROM inventario"
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ")
    consulta += ` WHERE ${filtros}`
  }
  const { rows: inventario } = await pool.query(consulta, values)
  return inventario
}

module.exports = {
  getProducts,
  getHATEOAS,
  getProduct,
  getJoyasPorFiltros,
}
