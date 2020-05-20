CREATE TYPE pet_type_category AS ENUM (
    'dog',
    'cat',
    'bird'
);

ALTER TABLE pets
  ADD COLUMN
    pet_type pet_type_category;
