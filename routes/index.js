const express = require('express');
const router = express.Router();

// importamos express validator
const { body } = require('express-validator/check');

// se importa el controlador
const ControladoresProyecto = require('../controladores/ControladoresProyecto');
const ControladorTarea = require('../controladores/ControladorTarea');
const ControladorUsuarios = require('../controladores/ControladorUsuarios');
const ControladorAutenticar = require('../controladores/ControladorAutenticar');

module.exports = function() {
    router.get('/', 
        ControladorAutenticar.usuarioAutenticado,
        ControladoresProyecto.proyectoInicio);
    router.get('/nuevo-Proyecto', 
        ControladorAutenticar.usuarioAutenticado,
        ControladoresProyecto.formularioProyecto); 
    router.post('/nuevo-Proyecto',
        ControladorAutenticar.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        ControladoresProyecto.nuevoProyecto);
   
    // Listar Proyecto
    router.get('/proyectos/:url', 
        ControladorAutenticar.usuarioAutenticado,
        ControladoresProyecto.proyectoPorUrl);
    
    // se actualiza el proyecto
    router.get('/proyecto/editar/:id', 
        ControladorAutenticar.usuarioAutenticado,
        ControladoresProyecto.formularioEditar);
    router.post('/nuevo-Proyecto/:id',
        ControladorAutenticar.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        ControladoresProyecto.actualizarProyecto);
    
    // Eliminando un proyecto
    router.delete('/proyectos/:url', 
        ControladorAutenticar.usuarioAutenticado,
        ControladoresProyecto.eliminarProyecto);
    
    // Tareas
    router.post('/proyectos/:url', 
        ControladorAutenticar.usuarioAutenticado,
        ControladorTarea.agregarTarea)

    // Actualizamos la tarea
    router.patch('/tareas/:id', 
        ControladorAutenticar.usuarioAutenticado,
        ControladorTarea.CambiarEstado);

    // Eliminamos la tarea
    router.delete('/tareas/:id', 
        ControladorAutenticar.usuarioAutenticado,
        ControladorTarea.eliminarTarea);

    // Creando nuevas cuentas
    router.get('/crear-cuenta', ControladorUsuarios.formCrearCuenta);
    router.post('/crear-cuenta', ControladorUsuarios.crearCuenta);
    router.get('/confirmar/:correo', ControladorUsuarios.activarCuenta);
    
    //Inicio de sesion
    router.get('/iniciar-sesion', ControladorUsuarios.formIniciarSesion);
    router.post('/iniciar-sesion', ControladorAutenticar.autenticarUsuario);

    //Aqui se cierra la sesión
    router.get('/cerrar-sesion', ControladorAutenticar.cerrarSesion);

    //Para reestabler la contraseña
    router.get('/reestablecer', ControladorUsuarios.formRestablecerPassword);
    router.post('/reestablecer', ControladorAutenticar.enviarToken);
    router.get('/reestablecer/:token', ControladorAutenticar.resetearPassword);
    router.post('/reestablecer/:token', ControladorAutenticar.actualizarPassword);

    return router;
}