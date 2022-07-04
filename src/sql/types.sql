CREATE TYPE public.jwt_token as (
  role text, --db role of the user
  exp integer, --expiry date as the unix epoch
  user_id integer, --db identifier of the user,
  username text --username used to sign in, user's email in our case
);