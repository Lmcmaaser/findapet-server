const path = require('path')
const express = require('express')
const xss = require('xss')
const jsonParser = express.json()
const logger = require('../logger')
const PetService = require('./pets-service')
const petsRouter = express.Router()


//by route('/') and ('/:id'), all, get, post, delete, and patch

const serializePet = pet => ({
  id: pet.id,
  name: xss(pet.name),
  pet_type: pet.pet_type,
  sex: pet.sex,
  age: pet.age,
  adopted: pet.adopted
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
    const { name, pet_type, sex,age,adopted } = req.body
    const newPet = { name, pet_type, sex, age, adopted }

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
    PetService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(pet => {
        if (!pet) {
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
    PetService.deletePet(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { id } = req.body //unsure if this is correct
    const petToUpdate = { name, age, adopted }

    const numberOfValues = Object.values(petToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'id'.`
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
