const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  //Este paquete nos permitirá crear un archivo con nombre único.
//Todo Isa
const subirArchivo = (file, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'svg', 'webp'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1].toLowerCase();
               
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no está permitida - Las extensiones válidas son: ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
     
        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
            return nombreTemp;
        });
    });
}

//Alicia
const borrarArchivo = (carpeta, archivo) => {
    const pathArchivo = path.join(__dirname, '../uploads', carpeta, archivo);
    
    if (fs.existsSync(pathArchivo))  
        fs.unlinkSync(pathArchivo);
}



module.exports = {
    subirArchivo,
    borrarArchivo
};