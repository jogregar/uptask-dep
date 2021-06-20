const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('../modelos/usuarios');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField : 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { email: email }
                });
       
                // Si el usuario existe pero el password es incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'Password Incorrecto'
                    })
                } 
                // si el email existe, y el password es correcto
                return done(null, usuario);
            } catch (error) {
                // Si el usuario no existe
                return done(null, false, {
                    message : 'Usuario no registrado'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;