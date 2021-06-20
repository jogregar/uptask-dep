const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.proyectoInicio = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render("index", {
       tituloPagina: 'Proyectos',
       proyectos
    });
}

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto', {
        tituloPagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    const nombre = req.body.nombre;

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }
    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto', 
            errores,
            proyectos
        })
    }else {
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create ({nombre, usuarioId});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Tareas del Proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
    });

    if(!proyecto) return next();

    res.render('tareas', {
        tituloPagina : 'Tareas del Proyecto',
        proyecto,
        proyectos, tareas
    });
}

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // hacemos render a la vista
    res.render('nuevoProyecto', {
        tituloPagina: "Editar Proyecto",
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    const nombre = req.body.nombre;

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }
    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            tituloPagina: 'Nuevo Proyecto', 
            errores,
            proyectos
        })
    }else {
        await Proyectos.update (
            { nombre: nombre },
            { where: { id: req.params.id }}
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res,next) => {
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}



