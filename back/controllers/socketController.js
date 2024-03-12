//Isa
const jwt = require('jsonwebtoken');
const userCan = require('../helpers/rolesAbilities');
const statsController = require('./statsController');
const contenidoController = require('./contenidoController');
const { getArrayRoles } = require('../helpers/getRelaciones');
const queriesChat = require("../database/queries/queries-chat");
const queriesUsers = require('../database/queries/queriesUsers');
const listaBloqueados = []; //Se emplea para poder almacenar la sala de los bloqueados y su id.
const listUserWithId = []; // La uso para poder almacenar la sala y el id de los usuarios.
const connectedUsers = []; // Lista de usuarios conectados en ese momento al chat.
const salaChat = "Chat"

const conectarChat = (socket, data, callback) => {
  const user = JSON.parse(socket.handshake.query.payload);
  if (user != "" && user != null) {

    if (Object.keys(data["payload"]).length === 0) {
      if (!connectedUsers.includes(user.nombre)) {

        socket.join(salaChat);
        listUserWithId.push({ id: socket.id, idUser: user.id, nombre: user.nombre });
        connectedUsers.push(user.nombre);
      }
    }

    if (data["payload"] == '1') {
      listaBloqueados.push({ id: socket.id, idUser: user.id, nombre: user.nombre });
      /*Se hace esto porque el cliente cuando carga por primera tiene el payload a null por lo que para poder usarlo 
      en el cliente se realiza un set y para que el socket coja el cambio se realiza un disconnet y un connet, haciendo que coja al 
      usuario bloqueado y lo añada a la lista cuando realmente no esta por eso se realiza este borrado en el array */
      const index = connectedUsers.findIndex(n => n == user.nombre); 
      if (index != -1) {
        connectedUsers.splice(index, 1);
      }
    }
    callback(connectedUsers);
    socket.to(salaChat).emit("usuario-conectado", connectedUsers);
  }

};

const desconectado = (socket) => {

  const user = JSON.parse(socket.handshake.query.payload);
  if (user) {
    const index = connectedUsers.findIndex(n => n == user.nombre);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
      socket.to(salaChat).emit("usuario-conectado", connectedUsers);
      socket.leave(salaChat);
      if (listUserWithId.length > 0) {
        let i = listUserWithId.findIndex(l => l.idUser == user.id)
        if (i != -1) {
          listUserWithId.splice(index, 1);
        }
      }
      if (listaBloqueados.length > 0) {
        let k = listaBloqueados.findIndex(l => l.idUser == user.id)
        if (k != -1) {
          listaBloqueados.splice(index, 1);
        }
      }
    }
  }
};


const logout = (socket, data, callback) => {


  const user = JSON.parse(socket.handshake.query.payload);
  if (user) {
    const index = connectedUsers.findIndex(n => n == user.nombre);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
      callback({ success: true, data: connectedUsers, msg: "Ha cerrado sesion correctamente" });
      socket.to(salaChat).emit("usuario-conectado", connectedUsers);
      socket.leave(salaChat);
      if (listUserWithId.length > 0) {
        let i = listUserWithId.findIndex(l => l.idUser == user.id)
        if (i != -1) {
          listUserWithId.splice(index, 1);
        }
      }
      if (listaBloqueados.length > 0) {
        let k = listaBloqueados.findIndex(l => l.idUser == user.id)
        if (k != -1) {
          listaBloqueados.splice(index, 1);
        }
      }
    }
  }
};

/*
const iniciarSesion = (socket, data, callback) => {
  socket.join(salaChat);
  connectedUsers.push(data["payload"]);
 
  callback({ success: true, data: connectedUsers, msg: "Ha iniciado correctamente" });
  socket.to(salaChat).emit("usuario-conectado", connectedUsers);
};*/


const enviarMensaje = (socket, data, callback) => {

  if (connectedUsers.includes(data["payload"]["nombreUser"])) {

    queriesChat.addMensaje(data["payload"]).then((respuesta) => {
      callback(respuesta);
      socket.to(salaChat).emit('enviar-mensaje', respuesta.data);

    }).catch((error) => {
      callback({ sucess: false, msg: 'No se ha podido añadir' });
    });

  } else {
    socket.to(salaChat).emit('error', { message: 'El usuario no está conectado' });
  }
};


const socketController = (socket) => {

  socket.on('conectar-chat', (data, callback) => {
    conectarChat(socket, data, callback);
  });

  /*socket.on('iniciarSesion', (data, callback) => {
    iniciarSesion(socket, data, callback);
  });*/

  socket.on('disconnect', () => {
    desconectado(socket);
  });

  socket.on('enviar-mensaje', (data, callback) => {
    enviarMensaje(socket, data, callback);
  });

  socket.on('logout', (data, callback) => {
    logout(socket, data, callback);
  });

  socket.on('enviar-lista', () => {
    socket.to(salaChat).emit("usuario-conectado", connectedUsers);
  });

  socket.on('lista', (data, callback) => {
    callback({ success: true, data: connectedUsers });
    socket.to(salaChat).emit("usuario-conectado", connectedUsers);
  });

  socket.on('borrarTodo', async (data, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);

    if (validarToken(user.token) != -1 && await validarRol(user)) {

      queriesChat.borrarTodo().then((respuesta) => {
        callback(respuesta);
        socket.to(salaChat).emit('borrarTodo', respuesta.data);
      }).catch((error) => {
        callback({ sucess: false, msg: 'No se han podido eliminar' });
      });

    } else callback({ sucess: false, msg: 'No autorizado' });
  });

  socket.on('borrarMensaje', async (datos, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);

    if (validarToken(user.token) != -1 && await validarRol(user)) {

      queriesChat.borrarMensaje(datos).then((respuesta) => {
        callback(respuesta);
        socket.to(salaChat).emit('borrarMensaje', respuesta.data);
      }).catch((error) => {
        callback({ sucess: false, msg: 'No se ha podido eliminar' });
      });

    } else callback({ sucess: false, msg: 'No autorizado' });
  });
  socket.on('desbloquear', async (datos, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);

    if (validarToken(user.token) != -1 && await validarRol(user)) {

      queriesChat.actulizarEstadoUsuario(datos, 0).then((respuesta) => {

        callback(respuesta);
        for (let i = 0; i < listaBloqueados.length; i++) {
          if (datos.includes(listaBloqueados[i].idUser.toString())) {
            listUserWithId.push({ id: listaBloqueados[i].id, idUser: listaBloqueados[i].idUser, nombre: listaBloqueados[i].nombre });
            if (!connectedUsers.includes(listaBloqueados[i].nombre)) {
              socket.join(salaChat);
              connectedUsers.push(listaBloqueados[i].nombre);
            }
            socket.to(salaChat).emit("usuario-conectado", connectedUsers);
            socket.to(salaChat).to(listaBloqueados[i].id).emit('desbloquear', respuesta);
            listaBloqueados.splice(z, 1);
          }
        };

      }).catch((error) => {
        callback({ sucess: false, msg: 'No se ha podido bloquear' });
      });

    } else callback({ sucess: false, msg: 'No autorizado' });
  });
  socket.on('bloquear', async (datos, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);
    if (validarToken(user.token) != -1 && await validarRol(user)) {
      queriesChat.actulizarEstadoUsuario(datos, 1).then((respuesta) => {
        callback(respuesta);
        for (let i = 0; i < listUserWithId.length; i++) {
          if (datos.includes(listUserWithId[i].idUser.toString())) {
            listaBloqueados.push({ id: listUserWithId[i].id, idUser: listUserWithId[i].idUser, nombre: listUserWithId[i].nombre });
            let index = connectedUsers.indexOf(listUserWithId[i].nombre);
            if (index != -1) {
              connectedUsers.splice(index, 1);
            }
            socket.to(salaChat).emit("usuario-conectado", connectedUsers);
            socket.to(salaChat).to(listUserWithId[i].id).emit('bloquear', respuesta.data);
            socket.to(listUserWithId[i].id).leave(salaChat);
            listUserWithId.splice(i, 1);
          }

        }

      }).catch((error) => {
        callback({ sucess: false, msg: 'No se ha podido bloquear' });
      });

    } else callback({ sucess: false, msg: 'No autorizado' });
  });

  socket.on('insertar-donacion', async (datos, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);

    if (validarToken(user.token) != -1 && await validarRol(user)) {

      const resp = await statsController.insertDonacion(datos);
      callback(resp);

      socket.broadcast.emit('insertar-donacion', resp);

    } else callback({ sucess: false, msg: 'No autorizado' });
  });

  socket.on('insertar-altas', async (payload, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);

    if (validarToken(user.token) != -1 && await validarRol(user)) {

      const resp = await statsController.insertAltas(payload);
      callback(resp);

      socket.broadcast.emit('insertar-altas', resp);

    } else callback({ sucess: false, msg: 'No autorizado' });
  });

  socket.on('insertar-cargo', async (payload, callback) => {
    const user = JSON.parse(socket.handshake.query.payload);

    if (validarToken(user.token) != -1 && await validarRol(user)) {
      
      const resp = await contenidoController.insertCargo(payload);
      callback(resp);

      socket.broadcast.emit('insertar-cargo', resp);

    } else callback({ sucess: false, msg: 'No autorizado' });
  });
};


const validarRol = async (user) => {
  const userRoles = await queriesUsers.getUserRoles(user.id);
  const roles = getArrayRoles(userRoles);
  const abilities = await queriesUsers.getAbilities(roles);

  let arrayAbilities = [];
  abilities.forEach(ability => {
    arrayAbilities = Array.from(new Set([...arrayAbilities, ...ability.dataValues.abilities.split(' ')]));
  });

  user.userAbilites = arrayAbilities;

  return await userCan(user, ['leer', 'editar', 'borrar']);
}


const validarToken = (token) => {
  try {
    const { id } = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    return id;

  } catch (err) {

    return -1;
  }
}



module.exports = { socketController }