function makePetsArray() {
  return [
    {
      'id': 1,
      'name': 'Shadow',
      'age': 3,
      'sex': 'female',
      'adopted': 'yes',
      'pet_type': 'dog'
    },
    {
      'id': 2,
      'name': 'Princess',
      'age': 4,
      'sex': 'female',
      'adopted': 'yes',
      'pet_type': 'cat'
    },
    {
      'id': 3,
      'name': 'Sunny',
      'age': 5,
      'sex': 'male',
      'adopted': 'yes',
      'pet_type': 'bird'
    }
  ];
}

function makeMaliciousPet() {
  const maliciousPet = {
    'id': 1,
    'name': 'Naughty naughty very naughty <script>alert("xss");</script>',
    'age': 4,
    'sex': 'female',
    'adopted': 'no',
    'pet_type': 'bird'
  }
  const expectedPet = {
    ...maliciousPet,
    'name': 'Naughty naughty very naughty <script>alert("xss");</script>'
  }
  return {
    maliciousPet,
    expectedPet
  }
}

module.exports = {
  makePetsArray,
  makeMaliciousPet
}
