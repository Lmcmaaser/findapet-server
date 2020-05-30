const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const PetService = require('./pets-service')
const jsonParser = express.json()
const petsRouter = express.Router()

//by route('/') and ('/:id'), all, get, post, delete, and patch
const serializePet = pet => ({
  id: pet.id,
  name: xss(pet.name),
  age: pet.age,
  sex: pet.sex,
  adopted: pet.adopted,
  pet_type: pet.pet_type
})

petsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PetService.getAllPets(knexInstance)
      .then(pets => {
        res.json(pets.map(pet => serializePet(pet)))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, age, sex, adopted, pet_type } = req.body
    const newPet = { name, age, sex, adopted, pet_type }

    for (const [key, value] of Object.entries(newPet)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        })
      }
    }

    newPet.name = name;
    newPet.pet_type = pet_type;
    newPet.sex = sex;
    newPet.age = age;
    newPet.adopted = adopted;
    console.log(newPet);

    PetService.insertPet(
      req.app.get('db'),
      newPet
    )
      .then(pet => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${pet.id}`))
          .json(serializePet(pet))
      })
      .catch(next)
  })


petsRouter
  .route('/:id')
  .all((req, res, next) => {
    const { id } = req.params
    PetService.getById(req.app.get('db'), id)
      .then(pet => {
        if (!pet) {
          logger.error(`Pet with id ${id} not found.`)
          return res.status(404).json({
            error: { message: `Pet does not exist.` }
          })
        }
        res.pet = pet
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializePet(res.pet))
  })
  .delete((req, res, next) => {
    const { id } = req.params
    PetService.deletePet(
      req.app.get('db'),
      id
    )
      .then(numRowsAffected => {
        logger.info(`Pet with id ${id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, age, adopted } = req.body;
    const petToUpdate = { name, age, adopted }

    const numberOfValues = Object.values(petToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'age', or 'adopted'.`
        }
      })
    PetService.updatePet(
      req.app.get('db'),
      req.params.id,
      petToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = petsRouter
