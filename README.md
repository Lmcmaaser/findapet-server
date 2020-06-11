FindAPet

Link to live app: https://findapet-client.now.sh/

API Documentation:
  This repository contains the code for the sever for the FindAPet API. It uses node express to connect to a postgres database.

  Endpoints:
    Get all pets: GET '/'
    Response: an array of pet objects
      ex:
        [
          {
            "id": <integer>,
            "name": <string>,
            "age": <integer>,
            "sex": <string>,
            "adopted": <string>,
            "pet_type": <string>
          },
          {
            "id": <integer>,
            "name": <string>,
            "age": <integer>,
            "sex": <string>,
            "adopted": <string>,
            "pet_type": <string>
          }
        ]

    Get a pet by ID: GET '/:id'
    id: ID of the pet
    Response: the pet object
      ex. [
            {
              "id": <integer>,
              "name": <string>,
              "age": <integer>,
              "sex": <string>,
              "adopted": <string>,
              "pet_type": <string>
            }
          ]

    Post a pet: POST '/'
    Response: the pet object

    Delete a pet by ID: DELETE '/:id'
    id: ID of the pet
    Response: Pet object removed, HTTP status 204 (No Content)

    Update a pet by ID: PATCH '/:id'
    id: ID of the pet
    Response: Pet object key-value pair updated, HTTP status 204 (No Content)

Description:
  The FindAPet helps animal shelter employees manage all of their shelter pets' information in one easy to use and convenient location. As a user, you can add, search for, update, and delete any pet in the database.

  The frontend of the FindAPet can be found at:https://github.com/Lmcmaaser/findapet-client.

Technology used:
  This fullstack app uses Javascript, React, HTML/JSX, CSS, Node, Express, and PostgreSQL. It is deployed on Vercel and Heroku.

Screenshots:
![Screenshot of FindAPet Home Page](screenshots/findapet-screenshot-home.png)
![Screenshot of FindAPet Add Form Page](screenshots/findapet-screenshot-add.png)
![Screenshot of FindAPet Search Filter](screenshots/findapet-screenshot-search.png)
![Screenshot of FindAPet Search Results](screenshots/findapet-screenshot-results.png)
![Screenshot of FindAPet Update Page](screenshots/findapet-screenshot-update.png)
![Screenshot of FindAPet Delete Page](screenshots/findapet-screenshot-delete.png)
