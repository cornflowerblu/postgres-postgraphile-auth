ALTER TABLE public.core_employee
(
    ADD COLUMN midde_name text
);

GRANT SELECT, UPDATE ON core_employee TO EMPLOYEE_MINION;
GRANT SELECT, UPDATE ON core_user TO EMPLOYEE_MINION;