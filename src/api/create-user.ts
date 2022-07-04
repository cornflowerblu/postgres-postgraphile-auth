import { ServerRoute } from "@hapi/hapi";
import { z } from 'zod';
import Boom from '@hapi/boom';
import { Knex } from 'knex';
import knex from '../db/knex'

const userRoutes: ServerRoute = {
    method: 'POST',
    path: '/user/create',
    handler: async (request, h) => {

        // Connect to the DB
        const db: Knex = await knex();

        // Create the validation rules with Zod then infer the type
        const CreateAccountBodyValidation = z.object({
            email: z.string(),
            user_name: z.string(),
            password: z.string()
        })

        type CreateAccountBody = z.infer<typeof CreateAccountBodyValidation>
        const { email, user_name, password } = request.payload as CreateAccountBody

        type UserAccountResponse = {
            rows: [
                id: string,
                user_name: string,
            ]
        }

        try {
            CreateAccountBodyValidation.parse(request.payload);
        } catch (err) {
            console.log(err)
            const error = Boom.badRequest('Invalid input was provided.')
            return h.response({
                success: false,
                response: error.output.payload,
            }).code(error.output.statusCode)
        }

        try {
            const user = await db.raw<UserAccountResponse>(`
            CREATE ROLE ${user_name};
            GRANT EMPLOYEE_MINION TO ${user_name};

            INSERT INTO public.core_user(password, email, user_name)
            VALUES('${password}', '${email}', '${user_name}')
            RETURNING id, user_name;

            UPDATE core_user SET password = crypt('${password}', gen_salt('bf')) WHERE email = '${email}'; 
        `)
            return h.response(user).code(200);
        } catch (err) {
            console.log(err)
            const error = Boom.badRequest('Invalid input was provided.')
            return h.response({
                success: false,
                response: error.output.payload,
            }).code(error.output.statusCode)
        }
    }
}

export default userRoutes