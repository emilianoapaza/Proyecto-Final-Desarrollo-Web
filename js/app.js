const contenedorServicios = document.querySelector('#contenedor-servicios');

const reserva = {
    servicioID: null
}

async function obtenerServicios() {
    const respuesta = await fetch('../data/servicios.json');

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los servicios');
    }

    return await respuesta.json();
}

document.addEventListener('DOMContentLoaded', async () => {
    const servicios = await obtenerServicios();

    servicios.forEach(servicio => {
        // Card principal
        const card = document.createElement('div');
        card.classList.add('card');

        // Imagen
        const imagen = document.createElement('img');
        imagen.classList.add('card__img');
        imagen.src = servicio.imagen;
        imagen.alt = servicio.nombre;

        // Contenedor principal
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card__div');

        // Información
        const info = document.createElement('div');
        info.classList.add('card__info');

        const titulo = document.createElement('h3');
        titulo.textContent = servicio.nombre;

        const descripcion = document.createElement('p');
        descripcion.textContent = servicio.descripcion;

        const precio = document.createElement('p');
        precio.classList.add('card__precio');
        precio.innerHTML = `Precio: <span>$${servicio.precio}</span>`;

        // Botón
        const contenedorBoton = document.createElement('div');
        contenedorBoton.classList.add('card__container-button');

        const boton = document.createElement('a');
        boton.classList.add('button--medium', 'button-verde');
        boton.textContent = 'Reservar Turno';

        // Construcción del DOM
        info.append(titulo, descripcion, precio);

        contenedorBoton.appendChild(boton);

        cardDiv.append(info, contenedorBoton);

        card.append(imagen, cardDiv);

        contenedorServicios.appendChild(card);


        // Eventos

        boton.addEventListener('click', () => {
            reserva.servicioID = servicio.id;

            // Guardar reserva en el localStorage
            localStorage.setItem('reserva', JSON.stringify(reserva))

            // Redirigir a contacto

            window.location.href = '../pages/contacto.html'

            console.log(reserva)
        })

    });
});