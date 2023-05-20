import { Permission } from '../enum/Permissions'
const ProfileRepository = require('../repositories/ProfileRepository')

class ProfileController {
  async index(_request, response) {
    const profiles = await ProfileRepository.findAll()

    return response.json(profiles)
  }

  async show(request, response) {
    const { id } = request.params

    const profile = await ProfileRepository.findById(id)

    if (!profile)
      return response
        .status(400)
        .json({ message: 'Nenhum perfil foi encontrado.' })

    return response.json(profile)
  }

  async store(request, response) {
    const { title, permissions } = request.body

    if (!title)
      return response
        .status(400)
        .json({ message: 'Campo título é obrigatório.' })

    const isProfileAlreadyRegistered = await ProfileRepository.findByName(title)
    if (isProfileAlreadyRegistered)
      return response.status(422).json({
        message: 'Um perfil com este nome já foi cadastrado.',
      })

    if (permissions) {
      // Valida se o usuário enviou as permissões corretas
      // Se você quer adicionar mais permissões,
      // altere no arquivo enum/Permissions.js
      // e utilize estas permissões para efetuar
      // as validações no seu app front-end
      const isPermissionsValid = permissions.every((permission) =>
        Object.values(Permission).includes(permission),
      )

      if (!isPermissionsValid) {
        return response
          .status(400)
          .json({ message: 'As permissões cadastradas estão incorretas.' })
      }
    }

    const profile = await ProfileRepository.create({
      title,
      ...(permissions && { permissions }),
    })

    return response.status(200).json(profile)
  }

  async update(request, response) {
    const { id } = request.params
    const { title, permissions } = request.body

    const profile = await ProfileRepository.findById(id)

    if (!profile)
      return response
        .status(400)
        .json({ message: 'Este perfil foi não foi encontrado.' })

    if (!title && !permissions)
      return response
        .status(400)
        .json({ message: 'Informe os dados que deseja atualizar.' })

    if (permissions) {
      const isPermissionsValid = permissions.every((permission) =>
        Object.values(Permission).includes(permission),
      )

      if (!isPermissionsValid) {
        return response
          .status(400)
          .json({ message: 'As permissões cadastradas estão incorretas.' })
      }
    }

    await ProfileRepository.findByIdAndUpdate(id, {
      ...(title && { title }),
      ...(permissions && { permissions }),
    })

    return response
      .status(204)
      .json({ message: 'Perfil atualizado com sucesso.' })
  }

  async delete(request, response) {
    const { id } = request.params

    const profile = await ProfileRepository.findById(id)

    if (!profile)
      return response
        .status(404)
        .json({ message: 'Este perfil não foi encontrado.' })

    await ProfileRepository.delete(id)

    return response.status(204).json({ message: 'Perfil apagado com sucesso.' })
  }
}

module.exports = new ProfileController()
