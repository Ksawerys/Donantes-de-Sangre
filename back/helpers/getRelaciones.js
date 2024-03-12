// const getArrayRelaciones = (relacion) => {
//     let rels = [];

//     for (const key in objeto.dataValues) {
//         if (Object.hasOwnProperty.call(objeto, key)) {
//             const elemento = objeto[key];
            

//         }
//     }
// }

const getArrayRoles = (user) => {
    let roles = [];

    for (const rolKey in user.dataValues.RolUser) {
        if (Object.hasOwnProperty.call(user.dataValues.RolUser, rolKey)) {
            const rol = user.dataValues.RolUser[rolKey];
            
            roles.push(rol.dataValues.idRol);
        }
    }

    return roles;
}


const getArrayCitas = (user) => {
    let citas = [];

    for (const citaKey in user.dataValues.citas) {
        if (Object.hasOwnProperty.call(user.dataValues.citas, citaKey)) {
            const cita = user.dataValues.citas[citaKey];
            
            citas.push(cita.dataValues);
        }
    }

    return citas;
}
module.exports = {
    getArrayRoles,
    getArrayCitas
}