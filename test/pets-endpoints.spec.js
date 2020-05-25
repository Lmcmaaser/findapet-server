const expect = require('chai').expect;
const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./pets.fixtures')
const { makePetsArray, makeMaliciousPet } = require('./pets.fixtures')
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

  //GET
  describe(`GET /api/pets`, () => {
    context(`Given no pets`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/pets')
          .set('Authorization', token)
          .expect(200, [])
      })
    })

    context('Given there are pets in the database', () => {
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

    context(`Given an XSS attack pet`, () => {
      const { maliciousPet, expectedPet } = fixtures.makeMaliciousPet()
      beforeEach('insert malicious pet', () => {
        return db
          .into('pets')
          .insert([maliciousPet])
      })
      it('removes XSS attack content', () => {
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

  // GET by id
  describe(`GET /api/pets/:id`, () => {
    context(`Given no pets`, () => {
      it(`responds with 404`, () => {
        const petId = 1
        return supertest(app)
          .get(`/api/pets/${petId}`)
          .set('Authorization', token)
          .expect(404, { error: { message: `Pet does not exist.` } })
        })
    })

    context('Given there are pets in the database', () => {
      const testPets = fixtures.makePetsArray()
      beforeEach('insert pets', () => {
        return db
          .into('pets')
          .insert(testPets)
      })
      it('responds with 200 and the specified pet', () => {
        const petId = 2
        const expectedPet = testPets[petId - 1]
        return supertest(app)
          .get(`/api/pets/${petId}`)
          .set('Authorization', token)
          .expect(200, expectedPet)
      })
    })

    context(`Given an XSS attack pet`, () => {
      const { maliciousPet, expectedPet } = fixtures.makeMaliciousPet()
      beforeEach('insert malicious pet', () => {
        return db
          .into('pets')
          .insert([maliciousPet])
      })
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/pets/${maliciousPet.id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedPet.name)
          })
      })
    })
  })

  //DELETE by id
  describe('DELETE /api/pets/:id', () => {
    context(`Given no pets`, () => {
      it(`responds 404 when the pet does not exist`, () => {
        return supertest(app)
          .delete(`/api/pets/123`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {error: { message: `Pet does not exist.` }})
      })
    })
  })
})
