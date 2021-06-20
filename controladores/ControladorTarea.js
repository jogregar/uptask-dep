const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.agregarTarea = async(req, res, next) => {

    // Capura del proyecto actual
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    // captura del valor del input
    const {tarea} = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertamos en la BD
    const resultado = await Tareas.create({tarea, estado, proyectoId});
    if(!resultado){
        return next();
    }

    //Redireccionamos 
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.CambiarEstado = async(req, res) =>{
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: { id }});
    
    // se cambia el estado
    let estado = 0;
    if(tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if(!resultado) return next();


    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res) => { 
    const{id} = req.params;
    //Eliminamos la tarea
    const resultado = await Tareas.destroy({where : {id}});
    
    if (!resultado) return next();
    res.status(200).send('Tarea Eliminada Correctamente');
}