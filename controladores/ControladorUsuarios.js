const Usuarios = require('../modelos/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        tituloPagina: 'Crear Usuario en Uptask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        tituloPagina: 'Iniciar Sesión en Uptask',
        error
    });
}

exports.crearCuenta = async(req, res) => {
    // leemos los dsatos los datos
    const { email, password} = req.body;

    try{
        // se crean los usuarios
        await Usuarios.create({
            email, 
            password
        });

        // Creamos confirmación de cuenta
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        }

        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Activa tu cuenta UpTask', 
            confirmarUrl, 
            archivo : 'confirmarcuenta'
        });

        // redirigir al usuario
        req.flash('correcto', 'Verifica tu correo para activar tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            tituloPagina: 'Crear Usuario en Uptask',
            email,
            password
        });
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        tituloPagina: 'Reestablecer tu Contraseña'
    })
}

// Activamos la cuenta
exports.activarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'email no registrado');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}