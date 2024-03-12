//Todo Isa
const qrCode = require('qrcode');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const generarQr = async (iduser, idCita) => {
    let idUcifrado=cifrar(iduser);
    let idCcifrado=cifrar(idCita);

    let url = process.env.INDEX + "/confirmacion/" + idUcifrado + "/" + idCcifrado;
    let qrCodeData = await qrCode.toDataURL(url);
    /*Este paso que viene a continuacion lo hago porque gmail no acepta que le pase la imagen en base 64
    para ello la guardo en la carpeta qr(upload) para luego poder buscarla y mandarla como un archivo adjunto*/
    let pathQr = await generarImagenQr(qrCodeData);

    return pathQr;

}
generarImagenQr = async (qrCodeData, carpeta = "qr") => {

    return new Promise((resolve, reject) => {
        // Extraemos los datos base64
        qrCodeData = qrCodeData.replace(/^data:image\/\w+;base64,/, '');

        // Decodificamos los datos base64
        let qrDescodificado = Buffer.from(qrCodeData, 'base64');

        //Generamos el nombre para la imagen de qr y añadimos su extension
        const nombreTemp = uuidv4() + '.png';

        const qrPath = path.join(__dirname, '../uploads/', carpeta);
        const qrcodePath = path.join(qrPath, nombreTemp);

        if (!fs.existsSync(qrPath)) {
            fs.mkdirSync(qrPath, { recursive: true });
        }

        fs.writeFile(qrcodePath, qrDescodificado, 'base64', (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(qrcodePath);
            }
        });
    });

}
const cifrar = (id) => {

    let caracter=["a","b","c","d","e","f","g","h","i","j","k",
                "l","m","n","o","q","r","s","t","u","v","w",
                "x","y","z","0","1","2","3","4","5","6","7","8","9"];
    let vez = 9;
    let cifrado="";

    for (let index = 0; index < vez ; index++) {
        cifrado = cifrado + caracter[Math.round((Math.random() * (caracter.length-1)))];
    }

    return cifrado + id;
}

module.exports = {
    generarQr
}