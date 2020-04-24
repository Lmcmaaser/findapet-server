CREATE TABLE pets (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    age INTEGER,
    date_arrived TIMESTAMPTZ DEFAULT now() NOT NULL,
    date_adopted TIMESTAMPTZ DEFAULT now()
);
