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
      'id': 4,
      'name': 'Princess',
      'age': 2,
      'sex': 'female',
      'adopted': 'yes',
      'pet_type': 'cat'
    },
    {
      'id': 7,
      'name': 'Sunny',
      'age': 7,
      'sex': 'male',
      'adopted': 'yes',
      'pet_type': 'bird'
    }
  ];
}

function makeMaliciousPet() {
  const maliciousPet = {
    'id': 1,
    'name': 'Naughty <script>alert("xss");</script>',
    'age': 4,
    'sex': 'female',
    'adopted': 'no',
    'pet_type': 'bird'
  }
  const expectedPet = {
    ...maliciousPet,
    'name': 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;',
    'age': 4,
    'sex': 'female',
    'adopted': 'no',
    'pet_type': 'bird'
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
