CREATE POLICY emp_minions ON core_employee TO EMPLOYEE_MINION
USING (EXISTS (SELECT user_name FROM core_user WHERE id = user_id and user_name = current_user));

CREATE POLICY emp_admin ON core_employee TO EMPLOYEE_ADMIN
USING (true);

CREATE POLICY user_minions ON core_user TO EMPLOYEE_MINION
USING (user_name = current_user);

CREATE POLICY user_admin ON core_user TO EMPLOYEE_ADMIN
USING (true);