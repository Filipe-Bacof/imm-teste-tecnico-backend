const express = require('express')
const router = express.Router()

const verifyTokenJwt = require('./middlewares/verifyTokenJwt')
const verifyTokenForgotPass = require('./middlewares/verifyTokenForgotPass')

const UserController = require('./controllers/UserController')
const ProfileController = require('./controllers/ProfileController')
const CategoryController = require('./controllers/CategoryController')
const ClassController = require('./controllers/ClassController')

// User Routes
router.post('/auth/register', UserController.register)
router.post('/auth/login', UserController.login)
router.post('/auth/forgot', UserController.forgot)
router.post('/auth/newpass', verifyTokenForgotPass, UserController.newPass)
router.get('/users', verifyTokenJwt, UserController.index)
router.get('/users/:id', verifyTokenJwt, UserController.show)
router.put('/users/:id', verifyTokenJwt, UserController.update)
router.delete('/users/:id', verifyTokenJwt, UserController.deleteUser)

// Profile Routes
router.get('/profile', verifyTokenJwt, ProfileController.index)
router.get('/profile/:id', verifyTokenJwt, ProfileController.show)
router.post('/profile', verifyTokenJwt, ProfileController.store)
router.put('/profile/:id', verifyTokenJwt, ProfileController.update)
router.delete('/profile/:id', verifyTokenJwt, ProfileController.deleteProfile)

// Category Routes
router.get('/category', verifyTokenJwt, CategoryController.index)
router.get('/category/:id', verifyTokenJwt, CategoryController.show)
router.post('/category', verifyTokenJwt, CategoryController.store)
router.put('/category/:id', verifyTokenJwt, CategoryController.update)
router.delete(
  '/category/:id',
  verifyTokenJwt,
  CategoryController.deleteCategory,
)

// Class Routes
router.get('/class', verifyTokenJwt, ClassController.index)
router.get('/class/:id', verifyTokenJwt, ClassController.show)
router.get(
  '/class/favorites/:id',
  verifyTokenJwt,
  ClassController.getUserFavoriteClasses,
)
router.post('/class', verifyTokenJwt, ClassController.store)
router.put('/class/:id', verifyTokenJwt, ClassController.update)
router.put(
  '/class/favorites/:id',
  verifyTokenJwt,
  ClassController.favoriteClass,
)
router.delete('/class/:id', verifyTokenJwt, ClassController.deleteClass)

// Rota Teste
router.get('/', (_request, response) => {
  response.send('Essa é uma rota de teste! A API está funcionando')
})

module.exports = router
