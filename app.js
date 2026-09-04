// Variable global para almacenar los datos cargados desde el JSON
let resultadosAlumnos = [];

// Detectamos automáticamente qué archivo JSON cargar según la página web actual
function obtenerArchivoJsonSegunPagina() {
    const ruta = window.location.pathname;
    
    if (ruta.includes('matematica')) {
        return 'matematica.json';
    } else if (ruta.includes('humanidades')) {
        return 'humanidades.json';
    } else if (ruta.includes('ciencias')) {
        return 'ciencias.json';
    } else {
        // Por defecto o para la página de resultados generales / admisión
        return 'admision.json';
    }
}

// Cargamos el JSON correspondiente de forma automática al abrir cualquier página
fetch(obtenerArchivoJsonSegunPagina())
    .then(response => response.json())
    .then(data => {
        const clave = Object.keys(data)[0]; 
        resultadosAlumnos = data[clave] || [];
    })
    .catch(error => console.error("Error al cargar los resultados:", error));

document.getElementById('btnBuscar').addEventListener('click', function () {
    const dniBuscado = document.getElementById('inputDni').value.trim();
    const resultadoContainer = document.getElementById('resultadoContainer');
    const errorContainer = document.getElementById('errorContainer');

    if (dniBuscado === "") {
        alert("Por favor ingresa un DNI válido.");
        return;
    }

    if (resultadosAlumnos.length === 0) {
        alert("Los datos aún se están cargando o el archivo JSON está vacío.");
        return;
    }

    // Buscamos el DNI dentro de los datos cargados del JSON
    const alumnoEncontrado = resultadosAlumnos.find(alumno => alumno.dni === dniBuscado);

    if (alumnoEncontrado) {
        document.getElementById('resDni').textContent = alumnoEncontrado.dni;
        document.getElementById('resNombre').textContent = alumnoEncontrado.nombre;
        
        const campoPuntaje = alumnoEncontrado.puntaje !== undefined ? alumnoEncontrado.puntaje : alumnoEncontrado.nota;
        document.getElementById('resPuntaje').textContent = campoPuntaje;

        const spanEstado = document.getElementById('resEstado');
        if (spanEstado && alumnoEncontrado.estado) {
            spanEstado.textContent = alumnoEncontrado.estado;
            if (alumnoEncontrado.estado.toUpperCase() === "INGRESANTE") {
                spanEstado.className = "badge";
            } else {
                spanEstado.className = "badge no-ingresante";
            }
        }

        resultadoContainer.classList.remove('oculto');
        errorContainer.classList.add('oculto');
    } else {
        resultadoContainer.classList.add('oculto');
        errorContainer.classList.remove('oculto');
    }
});