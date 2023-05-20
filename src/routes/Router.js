const express = require('express')
const router = express()

router.get('/', (req, res) => {
  res.send('Essa é uma rota de teste! A API está funcionando')
})

module.exports = router
