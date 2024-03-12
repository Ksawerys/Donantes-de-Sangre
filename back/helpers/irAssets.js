const fs = require('fs');


const copiarAssests = (nombre_carpeta_original, nombre_carpeta_destino, nombre_archivo) => {

    const filePath = `${__dirname}/../uploads/${nombre_carpeta_original}/${nombre_archivo}`;
    const filePathCopy = `${__dirname}../../../front/src/assets/imagenes/${nombre_carpeta_destino}/${nombre_archivo}`;
    fs.copyFile(filePath, filePathCopy, (err) => {
        if (err) throw err;
    })
}

module.exports = {
    copiarAssests
  };