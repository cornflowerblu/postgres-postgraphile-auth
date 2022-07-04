create function public.authenticate(
  email text,
  password text
) returns public.jwt_token as $$
declare
  account public.core_user;
begin
  select a.* into account
    from public.core_user as a
    where a.email = authenticate.email;

  if account.password = crypt(password, account.password) then
    return (
      account.user_name,
      extract(epoch from now() + interval '7 days'),
      account.id,
      account.email
    )::public.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;