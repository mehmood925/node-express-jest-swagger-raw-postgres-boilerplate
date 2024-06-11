-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    "id" SERIAL PRIMARY KEY,
    "company_id" INTEGER NOT NULL REFERENCES companies(id),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES admins(id),
    "account_no" VARCHAR(255) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create resetPasswordTokens table
CREATE TABLE IF NOT EXISTS resetPasswordTokens (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_resetPasswordTokens_email ON resetPasswordTokens(email);