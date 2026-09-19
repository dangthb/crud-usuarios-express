const API_URL = 'http://localhost:3000/api/usuarios';

const tabla = document.getElementById('usuarios-tabla');
const modal = document.getElementById('modal-usuario');
const formUsuario = document.getElementById('form-usuario');

function abrirModal(u = null) {
  modal.style.display = 'block';
  if (u) {
    document.getElementById('modal-titulo').textContent = 'Editar Usuario';
    document.getElementById('usuario-id').value = u.id;
    document.getElementById('nombre').value = u.nombre;
    document.getElementById('apellidos').value = u.apellidos;
    document.getElementById('correo').value = u.correo;
  } else {
    document.getElementById('modal-titulo').textContent = 'Nuevo Usuario';
    formUsuario.reset();
    document.getElementById('usuario-id').value = '';
  }
}

function cerrarModal() {
  modal.style.display = 'none';
}

// 1. GET: Cargar Datos
async function cargarDatos() {
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    tabla.innerHTML = '';
    const fragmento = document.createDocumentFragment();

    datos.forEach(u => {
      const fila = document.createElement('tr');
      const tdNombre = document.createElement('td'); tdNombre.textContent = u.nombre ?? '';
      const tdApellidos = document.createElement('td'); tdApellidos.textContent = u.apellidos ?? '';
      const tdCorreo = document.createElement('td'); tdCorreo.textContent = u.correo ?? '';

      const tdAcciones = document.createElement('td');
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn btn-warning';
      btnEditar.textContent = 'Editar';
      btnEditar.onclick = () => abrirModal(u);

      const btnEliminar = document.createElement('button');
      btnEliminar.className = 'btn btn-danger';
      btnEliminar.style.marginLeft = '5px';
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.onclick = () => eliminarUsuario(u.id);

      tdAcciones.append(btnEditar, btnEliminar);
      fila.append(tdNombre, tdApellidos, tdCorreo, tdAcciones);
      fragmento.appendChild(fila);
    });

    tabla.appendChild(fragmento);
  } catch (error) {
    console.error(error);
  }
}

// 2. POST / PUT: Crear o Editar
formUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('usuario-id').value;
  const usuarioData = {
    nombre: document.getElementById('nombre').value,
    apellidos: document.getElementById('apellidos').value,
    correo: document.getElementById('correo').value
  };

  try {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    const respuesta = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioData)
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo guardar el usuario');
    }

    await cargarDatos();
    cerrarModal();
  } catch (error) {
    console.error(error);
    alert('Error al guardar el usuario');
  }
});

// 3. DELETE: Eliminar Usuario
async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar usuario?')) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo eliminar el usuario');
    }

    await cargarDatos();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar el usuario');
  }
}

document.addEventListener('DOMContentLoaded', cargarDatos);