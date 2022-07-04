CREATE EXTENSION pgcrypto;

UPDATE core_user SET password = crypt('123', gen_salt('bf')) WHERE email = 'rurich@overtime.com'; --admin user
UPDATE core_user SET password = crypt('456', gen_salt('bf')) WHERE email = 'jeff@overtime.com'; --minion user