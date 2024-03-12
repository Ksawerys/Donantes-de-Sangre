//Todo Isa
const comprobarArchivos = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(404).send("No hay archivos para subir");
        return;
    }

    if (!req.files.archivo) {
        res.status(404).send("No hay archivos para subir");
        return;
    }
    console.log("Archivos que vienen en req.files:", req.files);
    next();
}

module.exports = {
    comprobarArchivos
}

