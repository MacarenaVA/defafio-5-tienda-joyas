const mostrarconsulta = (req, res, next) => {
  const url = req.url
  const method = req.method
  console.log(
    `Hoy es ${new Date()} y se ha realizado la consulta por el ${method}`
  )
  next()
}

module.exports = mostrarconsulta
