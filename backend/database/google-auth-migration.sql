-- Run once on an existing database before starting the updated backend.
ALTER TABLE users ADD COLUMN googleSubject VARCHAR(255) NULL UNIQUE;
