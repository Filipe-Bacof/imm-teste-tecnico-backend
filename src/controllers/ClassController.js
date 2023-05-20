const ClassRepository = require('../repositories/ClassRepository')
const UserRepository = require('../repositories/UserRepository')
const CategoryRepository = require('../repositories/CategoryRepository')

class ClassController {
  async index(request, response) {
    const page = Number(request.query.page)

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
      return response.status(400).json({ message: 'Nenhuma aula encontrada.' })

    return response
      .status(200)
      .json({ message: 'Aula encontrada com sucesso', oneClass })
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

  async update(request, response) {
    const { id } = request.params
    const { title, classUrl, available, description, creatorUserId, category } =
      request.body

    if (category) {
      const actualCategory = await CategoryRepository.findById(category)
      if (!actualCategory)
        return response
          .status(404)
          .json({ message: 'A categoria especificada não foi encontrada' })
    }
    if (creatorUserId) {
      const creatorUser = await UserRepository.findById(creatorUserId)
      if (!creatorUser)
        return response
          .status(404)
          .json({ message: 'O usuário especificado não foi encontrado' })
    }

    const updatedClass = await ClassRepository.findByIdAndUpdate({
      id,
      ...(title && { title }),
      ...(classUrl && { classUrl }),
      available,
      ...(description && { description }),
      ...(creatorUserId && { creatorUserId }),
      ...(category && { category }),
    })

    return response
      .status(200)
      .json({ message: 'Aula atualizada com sucesso.', updatedClass })
  }

  async delete(request, response) {
    const { id } = request.params

    const oneClass = await ClassRepository.findById(id)
    if (!oneClass)
      return response
        .status(404)
        .json({ message: 'Esta aula não foi encontrada.' })

    await ClassRepository.delete(id)

    return response.status(204).json({ message: 'Aula deletada com sucesso.' })
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
