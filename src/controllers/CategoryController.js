const CategoryRepository = require('../repositories/CategoryRepository')

class CategoryController {
  async index(_request, response) {
    const categories = await CategoryRepository.findAll()

    return response.json(categories)
  }

  async show(request, response) {
    const { id } = request.params

    const category = await CategoryRepository.findById(id)

    if (!category)
      return response
        .status(400)
        .json({ message: 'Nenhuma categoria foi encontrada' })

    return response.json(category)
  }

  async store(request, response) {
    const { title, availableProfiles } = request.body
    const isCategoryAlreadyRegistered = await CategoryRepository.findByName(
      title,
    )

    if (!title || !availableProfiles)
      return response
        .status(400)
        .json({ message: 'Campos faltando para criar a categoria' })

    if (isCategoryAlreadyRegistered)
      return response.status(422).json({
        message: 'Uma categoria com este nome já foi cadastrada.',
      })

    const category = await CategoryRepository.create({
      title,
      availableProfiles,
    })

    return response.status(200).json(category)
  }

  async update(request, response) {
    const { id } = request.params
    const { title, availableProfiles } = request.body

    try {
      const category = await CategoryRepository.findById(id)

      if (!category) {
        return response
          .status(404)
          .json({ message: 'Categoria não encontrada.' })
      }

      if (!title && !availableProfiles) {
        return response
          .status(400)
          .json({ message: 'Informe os campos corretamente.' })
      }

      await CategoryRepository.findByIdAndUpdate(id, {
        ...(title && { title: title.trim() }),
        ...(availableProfiles && { availableProfiles }),
        updatedAt: Date.now(),
      })

      const categoryNew = await CategoryRepository.findById(id)

      return response
        .status(200)
        .json({ message: 'Categoria atualizada com sucesso.', categoryNew })
    } catch (error) {
      console.error('Erro durante a atualização da categoria:', error)
      return response.status(500).json({
        message: 'Ocorreu um erro durante a atualização da categoria.',
      })
    }
  }

  async deleteCategory(request, response) {
    const { id } = request.params

    const categoria = await CategoryRepository.findById(id)

    if (!categoria)
      return response
        .status(404)
        .json({ message: 'Esta categoria não foi encontrada.' })

    await CategoryRepository.deleteCategory(id)

    return response
      .status(204)
      .json({ message: 'Categoria apagada com sucesso.' })
  }
}

module.exports = new CategoryController()
