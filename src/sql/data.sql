-- Insert admin user
INSERT INTO public.core_user(id, password, email, user_name) VALUES(1, '123', 'rurich@overtime.com', 'rurich');
INSERT INTO public.core_employee(id, family_name, given_name, user_id) VALUES (1, 'Admin', 'Thihara', 1);

--Insert minion user
INSERT INTO public.core_user(id, password, email, user_name) VALUES(2, '123', 'jeff@overtime.com', 'jeff');
INSERT INTO public.core_employee(id, family_name, given_name, user_id) VALUES (2, 'Minion', 'Thihara', 2);

--Now create their roles
CREATE ROLE rurich;
CREATE ROLE jeff;

--Now grant their roles
GRANT EMPLOYEE_ADMIN TO rurich;
GRANT EMPLOYEE_MINION to jeff;