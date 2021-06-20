
const passport = require('passport');
const Usuarios = require('../modelos/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// autenticamos el usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Debes Ingresar todos tus datos'
});

// verificamos que el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {

    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }
    // sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); 
    })
}

// generar token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // verificar que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});

    // Si el  usuario no existe
    if(!usuario) {
        req.flash('error', 'email no registrado');
        res.redirect('/reestablecer');
    }

    // Si el usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // almacenamos en la base de datos
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

 
    // Enviar el Correo con el Token

    await enviarEmail.enviar({
        usuario,
        subject: 'Resetear Password', 
        resetUrl, 
        archivo : 'reestablecerpassword'
    });

    // terminar
    req.flash('correcto', 'Se ha enviado un email para reestablecer tu password');
    res.redirect('/iniciar-sesion');
}

exports.resetearPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    
    // sino encuentra el usuario con el token
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el password
    res.render('resetearPassword', {
        tituloPagina : 'Reestablecer Contraseña'
    })
}

// cambiamos el password
exports.actualizarPassword = async (req, res) => {

    // Verificar que el token sea valido y que la fecha no este vencida
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    // guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Password actualizado');
    res.redirect('/iniciar-sesion');
}
