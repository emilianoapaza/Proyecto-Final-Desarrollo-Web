// =======================
// SELECTORES
// =======================

const resumenReserva = document.querySelector('#resumen-reserva');
const formulario = document.querySelector('.contacto__form');

const nombreInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');

const reserva = JSON.parse(localStorage.getItem('reserva'));


// =======================
// EVENTOS
// =======================

document.addEventListener('DOMContentLoaded', iniciar);

nombreInput.addEventListener('input', datosReserva);
emailInput.addEventListener('input', datosReserva);
telefonoInput.addEventListener('input', datosReserva);
fechaInput.addEventListener('input', datosReserva);
horaInput.addEventListener('input', datosReserva);

formulario.addEventListener('submit', confirmarReserva);


// =======================
// FUNCIONES
// =======================

async function iniciar() {

    if (!reserva) {
        window.location.href = '../pages/servicios.html';
        return;
    }

    Object.assign(reserva, {
        nombre: '',
        email: '',
        telefono: '',
        fecha: '',
        hora: ''
    });

    try {

        const servicios = await obtenerServicios();

        const servicioSeleccionado = servicios.find(
            servicio => servicio.id === reserva.servicioID
        );

        mostrarResumen(servicioSeleccionado);

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los servicios.'
        });

    }

}


async function obtenerServicios() {

    const respuesta = await fetch('../data/servicios.json');

    if (!respuesta.ok) {
        throw new Error();
    }

    return await respuesta.json();

}


function mostrarResumen(servicio){

    resumenReserva.innerHTML = `
        <h3 class="resumen__titulo">Resumen de tu reserva</h3>

        <div class="resumen__item">
            <span>Servicio</span>
            <strong>${servicio.nombre}</strong>
        </div>

        <div class="resumen__item">
            <span>Precio</span>
            <strong>$${servicio.precio}</strong>
        </div>

        <div class="resumen__item">
            <span>Duración</span>
            <strong>${servicio.duracion} min</strong>
        </div>
    `;
}


function datosReserva(e) {

    reserva[e.target.id] = e.target.value.trim();

}


function confirmarReserva(e) {

    e.preventDefault();

    const error = validarFormulario();

    if (error) {

        Swal.fire({
            icon: 'warning',
            title: 'Formulario inválido',
            text: error
        });

        return;
    }

    localStorage.setItem('reserva', JSON.stringify(reserva));

    Swal.fire({
        icon: 'success',
        title: 'Reserva confirmada',
        text: 'Tu turno fue registrado correctamente.',
        confirmButtonText: 'Aceptar'
    }).then(() => {

        formulario.reset();

        localStorage.removeItem('reserva');

        window.location.href = '../pages/servicios.html';

    });

}


function validarFormulario() {

    const {
        nombre,
        email,
        telefono,
        fecha,
        hora
    } = reserva;

    if (nombre.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return 'Ingrese un email válido.';
    }

    const telefonoRegex = /^[0-9]{8,15}$/;

    if (!telefonoRegex.test(telefono)) {
        return 'Ingrese un teléfono válido.';
    }

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    const fechaReserva = new Date(fecha);

    if (fechaReserva < hoy) {
        return 'No puede seleccionar una fecha anterior a hoy.';
    }

    const [horas, minutos] = hora.split(':').map(Number);

    const totalMinutos = horas * 60 + minutos;

    const apertura = 9 * 60;
    const cierre = 20 * 60;

    if (totalMinutos < apertura || totalMinutos > cierre) {
        return 'La barbería atiende de 09:00 a 20:00.';
    }

    return null;

}