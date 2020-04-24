CREATE TYPE petsex_category AS ENUM (
    'male',
    'female'
);

ALTER TABLE pets
  ADD COLUMN
    sex petsex_category;
