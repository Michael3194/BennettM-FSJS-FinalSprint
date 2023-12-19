CREATE TABLE logins (
	login_id SERIAL PRIMARY KEY,
	username VARCHAR(25) NOT NULL,
	hashed_password VARCHAR(100),
	email VARCHAR(100) NOT NULL,
	CONSTRAINT uq_logins_username UNIQUE (username),
	CONSTRAINT uq_logins_email UNIQUE (email)
);