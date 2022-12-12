DROP TABLE IF EXISTS signature;

CREATE TABLE signature (
    id SERIAL primary key,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);