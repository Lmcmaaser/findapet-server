CREATE TYPE petadopted_category AS ENUM (
    'yes',
    'no'
);

ALTER TABLE pets
  ADD COLUMN
    adopted petadopted_category;
