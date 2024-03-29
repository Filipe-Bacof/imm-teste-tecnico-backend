const Permissions = require('../enum/Permissions')
const ProfileRepository = require('../repositories/ProfileRepository')

class ProfileController {
  async index(request, response) {
    const filter = request.query.filter

    // Encontrando perfis pelo título
    if (filter) {
      const profiles = await ProfileRepository.findByFilter(filter)

      if (!profiles)
        return response
          .status(400)
          .json({ message: 'Nenhum perfil encontrado.' })

      return response.json(profiles)
      // Essa função não está filtrando acentuação
    }

    const profiles = await ProfileRepository.findAll()

    return response.json(profiles)
  }

  async show(request, response) {
    const { id } = request.params

    try {
      const profile = await ProfileRepository.findById(id)

      if (!profile)
        return response.status(400).json({ message: 'Perfil não encontrado.' })

      return response.json(profile)
    } catch (error) {
      console.log(error)
      return response.status(400).json({ message: 'Perfil não encontrado.' })
    }
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
        Object.values(Permissions).includes(permission),
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

    try {
      const profile = await ProfileRepository.findById(id)

      if (!profile) {
        return response
          .status(400)
          .json({ message: 'Este perfil não foi encontrado.' })
      }

      if (!title && !permissions) {
        return response
          .status(400)
          .json({ message: 'Informe os dados que deseja atualizar.' })
      }

      if (permissions) {
        const isPermissionsValid = permissions.every((permission) =>
          Object.values(Permissions).includes(permission),
        )

        if (!isPermissionsValid) {
          return response
            .status(400)
            .json({ message: 'As permissões cadastradas estão incorretas.' })
        }
      }

      const updatedProfile = await ProfileRepository.findByIdAndUpdate(id, {
        ...(title && { title }),
        ...(permissions && { permissions }),
        updatedAt: Date.now(),
      })

      if (!updatedProfile) {
        return response
          .status(400)
          .json({ message: 'Erro ao atualizar o perfil.' })
      }

      return response
        .status(200)
        .json({ message: 'Perfil atualizado com sucesso.' })
    } catch (error) {
      console.error('Erro durante a atualização do perfil:', error)
      return response
        .status(500)
        .json({ message: 'Ocorreu um erro durante a atualização do perfil.' })
    }
  }

  async deleteProfile(request, response) {
    const { id } = request.params

    try {
      const profile = await ProfileRepository.findById(id)

      if (!profile) {
        return response
          .status(404)
          .json({ message: 'Este perfil não foi encontrado.' })
      }

      await ProfileRepository.deleteProfile(id)

      return response
        .status(200)
        .json({ message: 'Perfil apagado com sucesso.' })
    } catch (error) {
      console.error('Erro durante a exclusão do perfil:', error)
      return response
        .status(500)
        .json({ message: 'Ocorreu um erro durante a exclusão do perfil.' })
    }
  }
}

module.exports = new ProfileController()
