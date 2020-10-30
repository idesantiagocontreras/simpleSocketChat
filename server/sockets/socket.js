const { io } = require('../server');
const { Usuarios } = require('../clasess/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre de usuario es neceario'
            });
        }

        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(usuario.sala));

        return callback(usuarios.getPersonasPorSalas(usuario.sala));
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.emit('crearMensaje', mensaje);

    });

    client.on('mensajePrivado', (data) => {
        if (!data.para) {
            return callback({
                error: true,
                mensaje: 'Se necesita el usuario al que se le va enviar el mensaje'
            });
        }

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        console.log(client.id, usuarios.getPersonas(), personaBorrada);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `El usuario ${ personaBorrada.nombre } abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(personaBorrada.sala));
    });
});