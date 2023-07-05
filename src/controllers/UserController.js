const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const UserRepository = require('../repositories/UserRepository')
const ProfileRepository = require('../repositories/ProfileRepository')
const mailer = require('../modules/mailer')

class UsersController {
  async index(request, response) {
    const profile = request.query.profile
    const filter = request.query.filter

    if (profile && filter) {
      const users = await UserRepository.findUsersByProfileAndFilter(
        profile,
        filter,
      )

      if (!users)
        return response
          .status(400)
          .json({ message: 'Nenhum usuário encontrado.' })

      return response.json(users)
    }

    // Encontrando usuários pelo nome
    if (filter) {
      const users = await UserRepository.findByFilter(filter)

      if (!users)
        return response
          .status(400)
          .json({ message: 'Nenhum usuário encontrado.' })

      return response.json(users)
      // Essa função não está filtrando acentuação
    }

    // Econtrando usuários pelo perfil
    if (profile) {
      const users = await UserRepository.findUsersByProfile(profile)
      return response.json(users)
    }

    const users = await UserRepository.findAll()
    return response.json(users)
  }

  async show(request, response) {
    const { id } = request.params

    try {
      const user = await UserRepository.findById(id)

      if (!user)
        return response.status(400).json({ message: 'Usuário não encontrado.' })

      return response
        .status(200)
        .json({ message: 'Usuário encontrado com sucesso', user })
    } catch (error) {
      console.log(error)
      return response.status(400).json({ message: 'Usuário não encontrado.' })
    }
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

    try {
      const isProfileValid = await ProfileRepository.findById(profile)
      if (!isProfileValid)
        return response
          .status(404)
          .json({ message: 'O perfil definido não existe.' })
    } catch (error) {
      console.log(error)
      return response
        .status(404)
        .json({ message: 'O perfil definido não existe.' })
    }

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
      return response
        .status(422)
        .json({ message: 'Algo deu errado com o login.' })

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect)
      return response
        .status(422)
        .json({ message: 'Algo deu errado com o login.' })

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
      response.send(422).json('Algo deu errado com o login.')
    }
  }

  async update(request, response) {
    const { id } = request.params
    const { name, email, password, profile, pictureUrl, favorites } =
      request.body

    try {
      const user = await UserRepository.findById(id)

      if (!user)
        return response
          .status(404)
          .json({ message: 'Este usuário não foi encontrado.' })
    } catch (error) {
      console.log(error)
      return response
        .status(404)
        .json({ message: 'Erro! Este usuário não foi encontrado.' })
    }

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

  async forgot(req, res) {
    const { email } = req.body

    try {
      const foundUser = await UserRepository.findByEmail(email)

      if (!foundUser) {
        return res.status(400).json({
          message: 'Erro ao tentar recuperar a senha, tente novamente!',
        })
      }
      const token = crypto.randomBytes(20).toString('hex')
      const now = new Date()

      foundUser.passwordResetToken = token
      foundUser.passwordResetExpires = now.setHours(now.getHours() + 1)

      await foundUser.save()

      mailer.sendMail(
        {
          to: email,
          from: "'Acesso Plataforma de Aulas' <portifolionext@gmail.com>",
          subject: 'Token para resetar a senha',
          html: `<h1>Recuperação de Senha Plataforma de Aulas</h1> <p>Para redefinir sua senha, utilize este token: ${token}</p>`,
        },
        (err) => {
          if (err)
            return res
              .status(400)
              .json({ message: 'Não foi enviado o email com o token', err })

          return res.status(200).json({ message: 'Email Enviado' })
        },
      )
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        message: 'Erro ao tentar recuperar a senha, tente novamente!',
      })
    }
  }

  async newPass(req, res) {
    const { email, password } = req.body

    try {
      const foundUser = await UserRepository.findByEmail(email)

      if (!foundUser) {
        return res.status(400).json({
          message: 'Erro ao tentar recuperar a senha, tente novamente!',
        })
      }

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      foundUser.password = passwordHash

      await foundUser.save()

      return res.status(200).json({ message: 'Senha atualizada.' })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        message: 'Erro ao tentar recuperar a senha, tente novamente!',
      })
    }
  }
}

module.exports = new UsersController()
