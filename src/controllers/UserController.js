const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRepository = require('../repositories/UserRepository')
const ProfileRepository = require('../repositories/ProfileRepository')

class UsersController {
  async index(request, response) {
    const { profile } = request.query

    if (profile) {
      const users = await UserRepository.findUsersByProfile(profile)
      return response.json(users)
    }

    const users = await UserRepository.findAll()
    return response.json(users)
  }

  async show(request, response) {
    const { id } = request.params

    const user = await UserRepository.findById(id)

    if (!user)
      return response.status(400).json({ message: 'Usuário não encontrado.' })

    return response
      .status(200)
      .json({ message: 'Usuário encontrado com sucesso', user })
  }

  async register(request, response) {
    const { name, email, password, pictureUrl, profile, favorites } =
      request.body

    if (!name || !email || !password || !profile) {
      return response
        .status(422)
        .json({ message: 'Estão faltando campos obrigatórios para o cadastro' })
    }

    const isUserAlreadyRegistered = await UserRepository.findByEmail(email)
    if (isUserAlreadyRegistered)
      return response
        .status(422)
        .json({ message: 'Esse usuário já foi cadastrado' })

    const isProfileValid = await ProfileRepository.findById(profile)
    if (!isProfileValid)
      return response
        .status(404)
        .json({ message: 'O perfil definido não existe.' })

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await UserRepository.create({
      name,
      email,
      password: passwordHash,
      profile,
      ...(pictureUrl && { pictureUrl }),
      ...(favorites && { favorites }),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return response
      .status(200)
      .json({ message: 'Usuário criado com sucesso', user })
  }

  async login(request, response) {
    const { email, password } = request.body

    const user = await UserRepository.findByEmail(email)

    if (!user)
      return response.status(404).json({ message: 'Usuário não encontrado' })

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect)
      return response.status(422).json({ message: 'Senha incorreta.' })

    try {
      const { JWT_SECRET } = process.env
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: '24h',
        },
      )

      const { _id, name, email, profile, pictureUrl, favorites } = user

      response.status(200).cookie('token', token, { httpOnly: true }).json({
        message: 'Usuário logado com sucesso',
        user: {
          _id,
          name,
          email,
          profile,
          pictureUrl,
          favorites,
        },
        token,
      })
    } catch (err) {
      response.send(500).json('Algo deu errado com o login.')
    }
  }

  async update(request, response) {
    const { id } = request.params
    const { name, email, password, profile, pictureUrl, favorites } =
      request.body

    const user = await UserRepository.findById(id)

    if (!user)
      return response
        .status(404)
        .json({ message: 'Este usuário não foi encontrado.' })

    let updatedUser = {
      id,
      ...(name && { name }),
      ...(email && { email }),
      ...(profile && { profile }),
      ...(pictureUrl && { pictureUrl }),
      ...(favorites && { favorites }),
    }

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      updatedUser.password = passwordHash
    }

    updatedUser = await UserRepository.findByIdAndUpdate(updatedUser)

    const userNew = await UserRepository.findById(id)

    return response
      .status(200)
      .json({ message: 'Usuário atualizado com sucesso.', userNew })
  }

  async deleteUser(request, response) {
    const { id } = request.params

    try {
      const user = await UserRepository.findById(id)

      if (!user) {
        return response
          .status(404)
          .json({ message: 'Este usuário não foi encontrado.' })
      }

      await UserRepository.delete(id)

      return response
        .status(200)
        .json({ message: 'Usuário deletado com sucesso.' })
    } catch (error) {
      console.error('Erro durante a exclusão do usuário:', error)
      return response
        .status(500)
        .json({ message: 'Ocorreu um erro durante a exclusão do usuário.' })
    }
  }

  // async forgot(request, response) {}
  // async newPass(request, response) {}

  // Recuperação de senha pode ser feita de várias formas
  // Minha preferida é utilizando um email que tenha o
  // protocolo SMTP (Simple Mail Transfer Protocol) habilitado.
  // O Node.js fornece uma biblioteca chamada Nodemailer que
  // facilita o envio de e-mails através de um servidor SMTP.
}

module.exports = new UsersController()
