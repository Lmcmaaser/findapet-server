const PetService = {
  getAllPets(knex) {
    return knex.select('*').from('pets')
  },
}

module.exports = PetService;
