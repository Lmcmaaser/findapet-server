function makePetsArray() {
  return [
    {
      "id": "50b51a24-7234-40b7-9a4d-c23147361d1f",
      "pet_type": "dog",
      "name": "Shadow",
      "sex": "female",
      "age": "3",
      "adopted": "yes",
    },
    {
      "id": "b58c8d48-797d-4e44-9c8e-857be43b6d29",
      "pet_type": "dog",
      "name": "Rocco",
      "sex": "male",
      "age": "5",
      "adopted": "no",
    },
    {
      "id": "352553a4-8f23-11ea-bc55-0242ac130003",
      "pet_type": "dog",
      "name": "Shadow",
      "sex": "male",
      "age": "8",
      "adopted": "no",
    },
    {
      "id": "e89c68cd-6a9e-4a1d-a77f-a5913468b528",
      "pet_type": "cat",
      "name": "Princess",
      "sex": "female",
      "age": "2",
      "adopted": "yes",
    },
    {
      "id": "a5c816c6-f00b-49ea-a782-e5c1df02ef73",
      "pet_type": "cat",
      "name": "Nero",
      "sex": "male",
      "age": "4",
      "adopted": "no",
    },
    {
      "id": "c45b9b46-8f23-11ea-bc55-0242ac130003",
      "pet_type": "cat",
      "name": "Shadow",
      "sex": "female",
      "age": "1",
      "adopted": "yes",
    },
    {
      "id": "69c01bf4-042d-4a89-be3f-2eeb31aa2a4c",
      "pet_type": "bird",
      "name": "Sunny",
      "sex": "male",
      "age": "7",
      "adopted": "yes",
    },
    {
      "id": "58919af8-8f25-11ea-bc55-0242ac130003",
      "pet_type": "bird",
      "name": "Cheerio",
      "sex": "male",
      "age": "2",
      "adopted": "yes",
    },
    {
      "id": "264e2db5-cc76-4816-80fc-66ccac3ba491",
      "pet_type": "bird",
      "name": "Chia",
      "sex": "female",
      "age": "4",
      "adopted": "no",
    }
  ];
}

function makeMaliciousPet() {
  const maliciousPet = {
    "id": "264e2db5-cc76-4816-80fc-66ccac3ba491",
    "pet_type": "bird",
    "name": "Naughty <script>alert("xss");</script>",
    "sex": "female",
    "age": "4",
    "adopted": "no"
  }
  const expectedPet = {
    ...maliciousPet,
    "pet_type": "bird",
    "name": "Naughty <script>alert("xss");</script>",
    "sex": "female",
    "age": "4",
    "adopted": "no"
  }
  return {
    maliciousPet,
    expectedPet
  }
}

module.exports = {
  makePetsArray,
  makeMaliciousPet,
}
