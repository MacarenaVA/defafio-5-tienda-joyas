const express = require("express")

const router = express.Router()

const {
  getProducts,
  getHATEOAS,
  getProduct,
  getJoyasPorFiltros,
} = require("../consultas/consultas")

const mostrarconsulta = require("../middleware/middleware")

router.get("/", mostrarconsulta, (req, res) => {
  res.send("Hello World! This is the home page.")
})

router.get("/products", mostrarconsulta, async (req, res) => {
  try {
    const consultas = req.query
    page = req.query.page || 1
    const products = await getProducts(consultas)
    const HATEOAS = getHATEOAS(products, page)
    res.json(HATEOAS)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get("/products/product/:id", mostrarconsulta, async (req, res) => {
  try {
    const id = req.params.id
    const producto = await getProduct(id)
    res.json(producto)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get("/products/filtros", mostrarconsulta, async (req, res) => {
  try {
    const consultas = req.query
    const joyasPorFiltros = await getJoyasPorFiltros(consultas)
    res.json(joyasPorFiltros)
  } catch (error) {
    res.status(500).send(error)
  }
})
module.exports = router
