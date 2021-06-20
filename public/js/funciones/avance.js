import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // Seleccionamos las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length) {

        // seleccionamos las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
        
        // calculamos el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
    
        // mostarmos el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if (avance === 100) {
            Swal.fire (
                'Proyecto Completado',
                'No hay tareas pendientes',
                'success'
            )
        }
    }

}