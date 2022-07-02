import Hapi from '@hapi/hapi'

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
    server.route({
        method: 'GET',
        path: '/hello',
        handler: (_request, h) => {
            return h.response('Hello World')
        }
    })
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init()