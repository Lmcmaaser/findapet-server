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

  describe(`GET /api/pets`, () => {
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

  // unathorized requests
  describe(`Unauthorized requests`, () => {
    const testPets = fixtures.makePetsArray()
    beforeEach('insert pets', () => {
      return db
        .into('pets')
        .insert(testPets)
    })

    it(`responds with 401 Unauthorized for GET /api/pets`, () => {
      return supertest(app)
        .get('/api/pets')
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for POST /api/pets`, () => {
      return supertest(app)
        .post('/api/pets')
        .send({ pet_type: 'test-type', name: 'test-name', sex: 'test-sex', age: '1', adopted: 'yes' })
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for GET /api/pets/:id`, () => {
      const secondPet = testPets[1]
      return supertest(app)
        .get(`/api/pets/${secondPet.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for DELETE /api/pets/:id`, () => {
      const aPet = testPets[1]
      return supertest(app)
        .delete(`/api/pets/${aPet.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for PATCH /api/pets/:id`, () => {
      const aPet = testPets[1]
      return supertest(app)
        .delete(`/api/pets/${aPet.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })
  })

  describe('GET /api/notes', () => {
    context(`Given no pets`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/pets')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context(`given an xss pet`, () => {
      const { maliciousTest, expectedPet } = fixtures.makeMaliciousPet()
      beforeEach('insert malicious pet', () => {
        return db
          .into('pets')
          .insert([maliciousTest])
      })

      it('removes XSS content', () => {
        return supertest(app)
          .get(`/api/pets`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedPet.name)
          })
      })
    })
  })
})
