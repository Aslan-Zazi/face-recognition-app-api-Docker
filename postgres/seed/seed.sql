BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('Aslan', 'aslan@gmail.com', 0, '2020-11-05 15:35:51.062');
INSERT INTO login (hash, email) VALUES ('$2a$10$aoJvzwfZE6kmJ/h/rigk8e9wUSrvVd.YXUMwTaK5OyKi.jdp0nrCi', 'aslan@gmail.com');

COMMIT;