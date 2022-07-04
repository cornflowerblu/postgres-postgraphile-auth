import Hapi from '@hapi/hapi'
import userRoutes from './api/create-user';
import InitGraphQL from './graphql';

const init = async () => {

    const server = Hapi.server({
        port: 8080,
        host: '0.0.0.0',
        routes: {
            cache: false,
        },
    });

    //Start the Hapi server
    await server.start();
    console.log('Server running on %s', server.info.uri);

    //Load up the routes
    server.route(userRoutes)
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init()
    .then()
InitGraphQL()
    .finally()
console.log('GraphQL Initialized')