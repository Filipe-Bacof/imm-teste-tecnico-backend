const ClassRepository = require('../repositories/ClassRepository')
const UserRepository = require('../repositories/UserRepository')
const CategoryRepository = require('../repositories/CategoryRepository')

class ClassController {
  async index(request, response) {
    const user = request.query.user
    const page = request.query.page

    if (user && page) {
      // É possível combinar os dois parametros para otimizar a busca
      return response
        .status(400)
        .json({ message: 'Informe apenas um parametro.' })
    }

    // Encontrando aulas do usuario atual
    if (user) {
      const myUser = await UserRepository.findById(user)
      const classes = await ClassRepository.findAll()
      const profileId = myUser.profile

      const returnClasses = classes.filter((classObj) => {
        return classObj.category.some((category) =>
          category.availableProfiles.some(
            (profile) => profile._id.toString() === profileId.toString(),
          ),
        )
      })

      return response.json(returnClasses)
    }

    // Paginação das Aulas
    if (page) {
      const startIndex = (page - 1) * 10
      const classes = await ClassRepository.findSome(startIndex)
      return response.json(classes)
    }

    const classes = await ClassRepository.findAll()

    return response.json(classes)
  }

  async show(request, response) {
    const { id } = request.params

    const oneClass = await ClassRepository.findById(id)

    if (!oneClass)
      return response.status(400).json({ message: 'Aula não encontrada.' })

    return response
      .status(200)
      .json({ message: 'Aula encontrada com sucesso', oneClass })
  }

  async getUserFavoriteClasses(request, response) {
    const { id } = request.params // ID do usuário

    const oneUser = await UserRepository.findById(id)
    if (!oneUser) {
      return response.status(400).json({ message: 'Usuário não encontrado.' })
    }

    if (oneUser.favorites.length === 0) {
      return response
        .status(200)
        .json({ message: 'Nenhuma aula foi favoritada.' })
    }

    const favoriteClasses = await Promise.all(
      oneUser.favorites.map(async (favoriteId) => {
        const favoriteClass = await ClassRepository.findById(favoriteId)
        return favoriteClass
      }),
    )

    return response.status(200).json(favoriteClasses)
  }

  async available(_request, response) {
    const availableClasses = await ClassRepository.findAvailable()

    if (!availableClasses)
      return response
        .status(400)
        .json({ message: 'Nenhuma aula ativa foi encontrada.' })

    return response.status(200).json(availableClasses)
  }

  async store(request, response) {
    const { title, classUrl, available, description, creatorUserId, category } =
      request.body

    if (!title)
      return response.status(422).json({ message: 'Informe o título da aula' })
    if (!classUrl)
      return response.status(422).json({ message: 'Informe a URL da aula' })

    const isClassAlreadyRegistered = await ClassRepository.findByName(title)
    if (isClassAlreadyRegistered)
      return response
        .status(422)
        .json({ message: 'Uma aula com este mesmo nome já foi cadastrada' })

    const actualCategory = await CategoryRepository.findById(category)
    if (!actualCategory)
      return response
        .status(404)
        .json({ message: 'A categoria especificada não foi encontrada' })

    const creatorUser = await UserRepository.findById(creatorUserId)
    if (!creatorUser)
      return response
        .status(404)
        .json({ message: 'O usuário especificado não foi encontrado' })

    const newClass = await ClassRepository.create({
      title,
      classUrl,
      available,
      ...(description && { description }),
      creatorUserId,
      category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    await newClass.save()

    return response.status(200).json(newClass)
  }

  async favoriteClass(request, response) {
    const { id } = request.params // ID da aula
    const user = request.query.user // ID do usuario

    try {
      const oneClass = await ClassRepository.findById(id)

      const oneUser = await UserRepository.findById(user)

      if (!oneClass) {
        response.status(404).json({ errors: ['Aula não encontrada!'] })
        return
      }

      if (!oneUser) {
        response.status(404).json({ errors: ['Usuário não encontrado!'] })
        return
      }

      if (oneUser.favorites.includes(id)) {
        response.status(422).json({ errors: ['Você já favoritou essa aula.'] })
        return
      }

      oneUser.favorites.push(id)

      await oneUser.save()

      response.status(200).json({
        classId: id,
        className: oneClass.title,
        userId: user,
        userName: oneUser.name,
        message: `A aula "${oneClass.title}" foi favoritada pelo usuário "${oneUser.name}".`,
      })
    } catch (error) {
      response.status(404).json({ errors: ['Aula não encontrada!'] })
    }
  }

  async update(request, response) {
    const { id } = request.params
    const { title, classUrl, available, description, creatorUserId, category } =
      request.body

    try {
      const existingClass = await ClassRepository.findById(id)

      if (!existingClass) {
        return response
          .status(404)
          .json({ message: 'A aula não foi encontrada.' })
      }

      if (category) {
        const actualCategory = await CategoryRepository.findById(category)
        if (!actualCategory) {
          return response
            .status(404)
            .json({ message: 'A categoria especificada não foi encontrada.' })
        }
      }

      if (creatorUserId) {
        const creatorUser = await UserRepository.findById(creatorUserId)
        if (!creatorUser) {
          return response
            .status(404)
            .json({ message: 'O usuário especificado não foi encontrado.' })
        }
      }

      await ClassRepository.findByIdAndUpdate(id, {
        ...(title && { title }),
        ...(classUrl && { classUrl }),
        available,
        ...(description && { description }),
        ...(creatorUserId && { creatorUserId }),
        ...(category && { category }),
        updatedAt: Date.now(),
      })

      const newClass = await ClassRepository.findById(id)

      return response
        .status(200)
        .json({ message: 'Aula atualizada com sucesso.', newClass })
    } catch (error) {
      console.error('Erro durante a atualização da aula:', error)
      return response
        .status(500)
        .json({ message: 'Ocorreu um erro durante a atualização da aula.' })
    }
  }

  async deleteClass(request, response) {
    const { id } = request.params

    const oneClass = await ClassRepository.findById(id)
    if (!oneClass) {
      return response
        .status(404)
        .json({ message: 'Esta aula não foi encontrada.' })
    }

    await ClassRepository.deleteClass(id)

    return response.status(200).json({ message: 'Aula deletada com sucesso.' })
  }

  async handleAvailability(request, response) {
    const { id } = request.params
    const { available } = request.body

    await ClassRepository.handleAvailability({
      id,
      available,
    })

    return response.status(200).json({
      message: `Aula foi alterada visibilidade para ${
        available ? 'disponível' : 'indisponível'
      }`,
    })
  }
}

module.exports = new ClassController()
