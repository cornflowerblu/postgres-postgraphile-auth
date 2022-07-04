import { ServerRoute } from "@hapi/hapi";
import { z } from 'zod';
import Boom from '@hapi/boom';
import { Knex } from 'knex';
import knex from '../db/knex'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

const userRoutes: ServerRoute = {
    method: 'POST',
    path: '/user/create',
    handler: async (request, h) => {

        // Generate the username
        const username: string = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: ''
        })

        // Connect to the DB
        const db: Knex = await knex();

        // Create the validation rules with Zod then infer the type
        const CreateAccountBodyValidation = z.object({
            email: z.string(),
            password: z.string(),
            role: z.string()
        })

        type CreateAccountBody = z.infer<typeof CreateAccountBodyValidation>
        const { email, password, role } = request.payload as CreateAccountBody

        type UserAccountResponse = {
            success: boolean,
            response: {
                message: string,
                data: {
                    user: [
                        {
                            id: number,
                            email: string
                        }
                    ],
                    role: string
                }
            }
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
            CREATE ROLE ${username};
            GRANT ${role} TO ${username};

            INSERT INTO public.core_user(email, password, user_name)
            VALUES('${email}', '${password}', '${username}')
            RETURNING id, email;

            UPDATE core_user SET password = crypt('${password}', gen_salt('bf')) WHERE email = '${email}'; 
        `)
            return h.response({
                success: true,
                response: {
                    message: 'User succesfully added.',
                    data: {
                        user: user[2].rows,
                        role: role
                    }
                }
            }).code(200);
        } catch (err) {
            console.log(err)
            const error = Boom.badRequest('The user could not be created.')
            return h.response({
                success: false,
                response: error.output.payload,
            }).code(error.output.statusCode)
        }
    }
}

export default userRoutes