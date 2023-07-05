const UserRepository = require('../repositories/UserRepository')

export async function verifyTokenForgotPass(request, response, next) {
  const { email, password, token } = request.body

  if (!token)
    return response
      .status(401)
      .json({ message: 'O campo do Token não pode estar vazio' })
  if (!email)
    return response
      .status(401)
      .json({ message: 'O campo do E-mail não pode estar vazio.' })
  if (!password)
    return response
      .status(401)
      .json({ message: 'O campo de senha não pode estar vazio' })
  try {
    const user = await UserRepository.findByEmail(email)

    if (!user) {
      response
        .status(400)
        .send({ error: 'Erro ao tentar recuperar a senha, tente novamente!' })
    }
    if (user.passwordResetToken !== token)
      response.status(400).send({ error: 'O token informado está incorreto' })

    if (user.passwordResetExpires < new Date())
      response
        .status(400)
        .send({ error: 'O token informado expirou, tente gerar novamente.' })

    next()
  } catch (err) {
    response
      .status(400)
      .json({ message: 'Erro ao tentar recuperar a senha, tente novamente!' })
  }
}
