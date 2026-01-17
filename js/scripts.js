/*************************
 * INICIALIZACION
 *************************/
document.addEventListener('DOMContentLoaded', () => {

    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify([]));
    }

    if (!localStorage.getItem('operaciones')) {
        localStorage.setItem('operaciones', JSON.stringify([]));
    }
});

/*************************
 * LOGIN
 *************************/
const formLogin = document.getElementById('loginUsuario');

if (formLogin) {
    formLogin.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('emailLogin').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioValido = usuarios.find(
            u => u.usuario === email && u.password === password
        );

        if (usuarioValido) {
            localStorage.setItem('usuarioActivo', email);
            window.location.href = 'menu.html';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
}

/*************************
 * REGISTRO
 *************************/
const formRegistro = document.getElementById('registroUsuario');

if (formRegistro) {
    formRegistro.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('emailRegistro').value.trim().toLowerCase();
        const password = document.getElementById('clave').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const existe = usuarios.some(u => u.usuario === email);

        if (existe) {
            alert('El usuario ya existe');
            return;
        }

        usuarios.push({ usuario: email, password });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioActivo', email);

        alert('Usuario registrado con éxito');
        window.location.href = 'menu.html';
    });
}

/*************************
 * PROTECCION DE MENU
 *************************/
if (location.pathname.includes('menu.html')) {
    if (!localStorage.getItem('usuarioActivo')) {
        window.location.href = 'login.html';
    }
}

/*************************
 * MENU
 *************************/
const saldoMenu = document.querySelector('.saldo-menu');
if (saldoMenu) {
    saldoMenu.innerText = Number(localStorage.getItem('saldo')) || 0;
}

const btnDeposit = document.getElementById('deposit');
if (btnDeposit) {
    btnDeposit.addEventListener('click', () => {
        window.location.href = 'deposit.html';
    });
}

const btnSend = document.getElementById('sendmoney');
if (btnSend) {
    btnSend.addEventListener('click', () => {
        window.location.href = 'sendmoney.html';
    });
}

const btnTransactions = document.getElementById('transactions');
if (btnTransactions) {
    btnTransactions.addEventListener('click', () => {
        window.location.href = 'transactions.html';
    });
}

/*************************
 * DEPOSITO
 *************************/
const formDeposito = document.getElementById('deposito');

if (formDeposito) {
    formDeposito.addEventListener('submit', e => {
        e.preventDefault();

        const amount = Number(document.getElementById('amount').value);
        if (amount <= 0) {
            alert('Monto inválido');
            return;
        }

        const saldo = Number(localStorage.getItem('saldo')) || 0;
        const nuevoSaldo = saldo + amount;

        localStorage.setItem('saldo', nuevoSaldo);
        guardarOperacion('Depósito', 'deposito', amount);

        alert(`Depósito exitoso. Nuevo saldo: $${nuevoSaldo}`);
        window.location.href = 'menu.html';
    });
}

/*************************
 * TRANSFERENCIAS
 *************************/
const formEnviar = document.getElementById('enviarDinero');

if (formEnviar) {
    formEnviar.addEventListener('submit', e => {
        e.preventDefault();

        const monto = Number(document.getElementById('montoEnviarDinero').value);
        const saldo = Number(localStorage.getItem('saldo')) || 0;

        if (monto <= 0 || monto > saldo) {
            alert('Monto inválido o saldo insuficiente');
            return;
        }

        const nuevoSaldo = saldo - monto;
        localStorage.setItem('saldo', nuevoSaldo);

        guardarOperacion('Transferencia', 'envío', monto);
        alert('Dinero enviado correctamente');
        window.location.href = 'menu.html';
    });
}

/*************************
 * TRANSACCIONES
 *************************/
function guardarOperacion(nombre, tipo, monto) {
    const operaciones = JSON.parse(localStorage.getItem('operaciones')) || [];
    operaciones.push({ nombre, tipo, monto });
    localStorage.setItem('operaciones', JSON.stringify(operaciones));
}

function cargarTabla() {
    const tbody = document.getElementById('cuerpoTablaTransacciones');
    if (!tbody) return;

    const operaciones = JSON.parse(localStorage.getItem('operaciones')) || [];
    tbody.innerHTML = '';

    operaciones.forEach(op => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${op.nombre}</td>
            <td>${op.tipo}</td>
            <td>${op.monto}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', cargarTabla);