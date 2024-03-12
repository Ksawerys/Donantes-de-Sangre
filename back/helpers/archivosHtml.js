const error = () => {
    return `<div style="font-family: Arial, Helvetica, sans-serif;">
                <h2 style="border-bottom: 0.3rem solid rgb(174, 17, 40);padding-bottom:.5rem;width:fit-content;">
                    Se ha producido un error
                </h2>
                <p>Por favor, inténtalo de nuevo más tarde.</p>
            </div>`;
}


const exitoVerificarNewsletter = () => {
    return `<div style="font-family: Arial, Helvetica, sans-serif;">
                <h2 style="border-bottom: 0.3rem solid rgb(174, 17, 40);padding-bottom:.5rem;width:fit-content;">
                    ¡Email verificado con éxito!
                </h2>
                <p>Recibirás una notificación por correo cada vez que publiquemos una noticia.</p>
            </div>`;
}


const exitoVerificarEmail = () => {
    return `<div style="font-family: Arial, Helvetica, sans-serif;">
                <h2 style="border-bottom: 0.3rem solid rgb(174, 17, 40);padding-bottom:.5rem;width:fit-content;">
                    ¡Email verificado con éxito!
                </h2>
                <p>Ya puedes usar tus credenciales para iniciar sesión.</p>
            </div>`;
}


const exitoBajaNewsletter = () => {
    return `<div style="font-family: Arial, Helvetica, sans-serif;">
                <h2 style="border-bottom: 0.3rem solid rgb(174, 17, 40);padding-bottom:.5rem;width:fit-content;">
                    Te has dado de baja
                </h2>
                <p>No recibirás más correos cuando publiquemos una noticia.</p>
            </div>`;
}



module.exports = {
    error,
    exitoVerificarEmail,
    exitoBajaNewsletter,
    exitoVerificarNewsletter
}
