const expect = require('chai').expect;
const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./pets.fixtures')
const { makePetsArray } = require('./pets.fixtures')
const supertest = require('supertest');

describe('Pets Endpoints', function() {
  let db
  const token = `bearer ` + process.env.API_TOKEN;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('pets').truncate())
  afterEach('cleanup', () => db('pets').truncate())

  describe(`GET /pets`, () => {
    context(`given no pets`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/pets')
          .set('Authorization', token)
          .expect(200, [])
      })
    })

    context('Given there are notes in the database', () => {
      const testPets = makePetsArray()

      beforeEach('insert pets', () => {
        return db
          .into('pets')
          .insert(testPets)
      })

      it('responds with 200 and all of the pets', () => {
        return supertest(app)
          .get('/api/pets')
          .set('Authorization', token)
          .expect(200, testPets)
      })
    })
  })

  describe(`GET /api/pets/:id`, () => {
    context(`Given no pets`, () => {
      it(`responds with 404`, () => {
        const id = 1
        return supertest(app)
          .get(`/api/pets/${id}`)
          .set('Authorization', token)
          .expect(404, { error: { message: `Pet does not exist.` } })
        })
    })
  })

  context('Given there are pets in the database', () => {
    const testPets = makePetsArray()
    beforeEach('insert pets', () => {
      return db
        .into('pets')
        .insert(testPets)
    })

    it('responds with 200 and the specified pet', () => {
      const id = 2
      const expectedPet = testPets[id - 1]
      return supertest(app)
        .get(`/api/pets/${id}`)
        .set('Authorization', token)
        .expect(200, expectedPet)
    })
  })
})
