const app = document.getElementById('app');
const navList = document.querySelector('nav .container ul');

let currentUser = null;
let selectedCarId = null;

const regexName = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const users = [
  { username: 'admin', email: 'admin@bsautos.com', password: 'admin123', role: 'admin' },
  { username: 'user',  email: 'user@bsautos.com',  password: 'user123',  role: 'user'  }
];

function loadUsers() {
  const raw = localStorage.getItem('bs_autos_users');
  if (raw) {
    try { users.splice(0, users.length, ...JSON.parse(raw)); }
    catch (e) { console.error('Error parseando usuarios:', e); }
  }
}
function saveUsers() {
  localStorage.setItem('bs_autos_users', JSON.stringify(users));
}

function loadSession() {
  const raw = localStorage.getItem('bs_autos_currentUser');
  if (raw) {
    try { currentUser = JSON.parse(raw); }
    catch (e) { console.error('Error cargando sesión:', e); }
  }
}
function saveSession() {
  if (currentUser) localStorage.setItem('bs_autos_currentUser', JSON.stringify(currentUser));
  else localStorage.removeItem('bs_autos_currentUser');
}

const autos = [
  {
    id: 1,
    nombre: 'Corolla XSE',
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
    km: 35000,
    color: 'Gris',
    precio: 20000,
    img: 'img/toyota-corolla-2020-llegaron-las-nuevas-versiones-918354.jpg'
  },
  {
    id: 2,
    nombre: 'Fiesta Trend',
    marca: 'Ford',
    modelo: 'Fiesta',
    año: 2018,
    km: 48000,
    color: 'Rojo',
    precio: 15000,
    img: 'img/lanzamiento-ford-fiesta-2018-mercosur.webp'
  },
  {
    id: 3,
    nombre: 'Cruze LT',
    marca: 'Chevrolet',
    modelo: 'Cruze',
    año: 2019,
    km: 41000,
    color: 'Blanco',
    precio: 22000,
    img: 'img/02fd20f7-aab4-4b8a-a9d5-b8eb527ec843.jpg'
  }
];

function init() {
  loadUsers();
  loadSession();
  window.addEventListener('hashchange', router);
  window.addEventListener('resize', ajustarColumnas);
  window.addEventListener('load', () => { ajustarColumnas(); router(); });
}
init();

function router() {
  const hash = window.location.hash || '#inicio';
  updateNav();
  if (hash === '#inicio') renderInicio();
  else if (hash === '#login') renderLogin();
  else if (hash === '#registro') renderRegistro();
  else if (hash === '#catalogo') renderCatalog();
  else if (hash.startsWith('#comprar')) renderCompra();
  else if (hash === '#contacto') renderContacto();
  else if (hash === '#usuarios') renderUsuarios();
  else renderInicio();
}

function updateNav() {
  navList.querySelectorAll('li').forEach(li => {
    const href = li.querySelector('a').getAttribute('href');
    if (href === '#inicio') li.style.display = '';
    else if (href === '#login' || href === '#registro') li.style.display = currentUser ? 'none' : '';
    else if (href === '#catalogo') li.style.display = currentUser ? '' : 'none';
    else if (href === '#usuarios') li.style.display = (currentUser && currentUser.role === 'admin') ? '' : 'none';
  });
  const logoutLink = document.getElementById('logoutLink');
  if (currentUser && !logoutLink) {
    const li = document.createElement('li');
    li.innerHTML = `<a href='#' id='logoutLink'>Logout</a>`;
    navList.appendChild(li);
    document.getElementById('logoutLink').addEventListener('click', e => {
      e.preventDefault();
      currentUser = null;
      saveSession();
      window.location.hash = '#inicio';
      M.toast({ html: 'Sesión cerrada.' });
    });
  }
  if (!currentUser && logoutLink) logoutLink.parentElement.remove();
}

function renderInicio() {
  app.innerHTML = `
    <section class="section inicio-section">
      <div class="overlay">
        <img src="img/bsautosargentina.png" alt="B&S Autos" class="logo">
        <div class="welcome-text">
          Somos el primer sitio en Argentina que vos va comprar su auto completamente por la web, acá vos elegir el modelo que te guste, enviar sus datos, nuestra equipe te va contactar y vos va receber tu auto con la patente en su casa.
          En 2025 queremos cambiar la manera que compra su auto, con mas conforto y rapidez en el proceso y menos burocracia, nosostros encargamos de todo.

          Bienvenido a el futuro, bienvenido a B&S Autos
        </div>
      </div>
      <footer class="footer">
        <p>&copy; 2025 B&S Autos. Todos los derechos reservados.</p>
        <div class="social-icons">
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-x-twitter"></i></a>
        </div>
      </footer>
    </section>`;
}

function renderLogin() {
  app.innerHTML = `
    <section class="section">
      <h4>Iniciar Sesión</h4>
      <div class="row">
        <form id="loginForm" class="col s12">
          <div class="row">
            <div class="input-field col s12">
              <input id="username" type="text" required>
              <label for="username">Usuario</label>
            </div>
            <div class="input-field col s12">
              <input id="password" type="password" required>
              <label for="password">Contraseña</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Ingresar</button>
        </form>
      </div>
    </section>`;
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const u = e.target.username.value.trim();
    const p = e.target.password.value;
    const user = users.find(x => x.username === u && x.password === p);
    if (user) {
      currentUser = user;
      saveSession();
      window.location.hash = '#catalogo';
      M.toast({ html: `¡Bienvenido, ${u}!` });
    } else {
      M.toast({ html: 'Credenciales inválidas' });
    }
  });
}

function renderRegistro() {
  app.innerHTML = `
    <section class="section registro-section">
      <h4>Registro de Usuario</h4>
      <form id="regForm">
        <div class="input-field">
          <input id="regUsername" type="text" required>
          <label for="regUsername">Usuario</label>
        </div>
        <div class="input-field">
          <input id="regEmail" type="email" required>
          <label for="regEmail">Email</label>
        </div>
        <div class="input-field">
          <input id="regEmailConfirm" type="email" required>
          <label for="regEmailConfirm">Confirmar Email</label>
        </div>
        <div class="input-field">
          <input id="regPassword" type="password" required>
          <label for="regPassword">Contraseña</label>
        </div>
        <div class="input-field">
          <input id="regPasswordConfirm" type="password" required>
          <label for="regPasswordConfirm">Confirmar Contraseña</label>
        </div>
        <button type="submit" id="regSubmit" class="btn btn-primary" disabled>Registrarse</button>
      </form>
    </section>`;

  const uI = document.getElementById('regUsername');
  const eI = document.getElementById('regEmail');
  const eC = document.getElementById('regEmailConfirm');
  const pI = document.getElementById('regPassword');
  const pC = document.getElementById('regPasswordConfirm');
  const btn = document.getElementById('regSubmit');

  [uI, eI, eC, pI, pC].forEach(input =>
    input.addEventListener('input', () => {
      const nameOk     = regexName.test(uI.value.trim());
      const emailOk    = regexEmail.test(eI.value.trim());
      const emailsMatch= emailOk && eI.value.trim() === eC.value.trim();
      const pwdOk      = pI.value.length >= 6;
      const pwdsMatch  = pwdOk   && pI.value === pC.value;

      uI.classList.toggle('invalid', !nameOk);
      eI.classList.toggle('invalid', !emailOk);
      eC.classList.toggle('invalid', !emailsMatch);
      pI.classList.toggle('invalid', !pwdOk);
      pC.classList.toggle('invalid', !pwdsMatch);

      btn.disabled = !(nameOk && emailsMatch && pwdsMatch);
    })
  );

  document.getElementById('regForm').addEventListener('submit', e => {
    e.preventDefault();
    if (btn.disabled) return;
    const uname = uI.value.trim();
    const mail  = eI.value.trim();
    const pwd   = pI.value;

    if (users.some(u => u.username === uname)) {
      return M.toast({ html: 'El nombre ya existe.' });
    }

    users.push({ username: uname, email: mail, password: pwd, role: 'user' });
    saveUsers();
    M.toast({ html: 'Registro exitoso. Iniciá sesión.' });
    window.location.hash = '#login';
  });
}


function renderCatalog() {
  let html = `<section class="section"><h4>Catálogo de Autos</h4><div class="row">`;
  autos.forEach(a => html += `
    <div class="col s12 m6 l4">
      <div class="card card-auto">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${a.img}" alt="${a.nombre}">
        </div>
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${a.nombre}<i class="material-icons right">more_vert</i></span>
          <p>Precio: $${a.precio}</p>
        </div>
        <div class="card-action">
          <button class="btn btn-primary btn-buy" data-id="${a.id}">Comprar</button>
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">Detalles<i class="material-icons right">close</i></span>
          <p><strong>Marca:</strong> ${a.marca}</p>
          <p><strong>Modelo:</strong> ${a.modelo}</p>
          <p><strong>Año:</strong> ${a.año}</p>
          <p><strong>KM:</strong> ${a.km.toLocaleString()}</p>
          <p><strong>Color:</strong> ${a.color}</p>
        </div>
      </div>
    </div>`);
  html += `</div></section>`;
  html += `<section class="section cta-section"><h5>Venga comprar con nosotros, tenemos créditos con los mejores bancos (BBVA, Santander, Galicia y HSBC)</h5><button id="interesBtn" class="btn btn-primary">Tengo interés</button></section>`;
  app.innerHTML = html; M.AutoInit(); ajustarColumnas();
  document.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', () => { selectedCarId = parseInt(btn.dataset.id); window.location.hash = `#comprar-${selectedCarId}`; }));
  document.getElementById('interesBtn').addEventListener('click', () => window.location.hash = '#contacto');
}

function renderCompra() {
  const car = autos.find(a => a.id === selectedCarId);
  app.innerHTML = `
    <section class="section compra-section">
      <h4>Comprar: ${car.nombre}</h4>
      <form id="compraForm">
        <div class="input-field">
          <input id="compraFullName" type="text" required>
          <label for="compraFullName">Nombre y Apellido</label>
        </div>
        <div class="input-field" style="position: relative;">
          <input id="compraPhone" type="tel" required>
          <!-- etiqueta removida intencionadamente -->
        </div>
        <div class="input-field">
          <input id="compraEmail" type="email" required>
          <label for="compraEmail">Email</label>
        </div>
        <div class="input-field">
          <input id="compraAddress" type="text" required>
          <label for="compraAddress">Dirección</label>
        </div>
        <div class="input-field">
          <input id="compraAge" type="number" min="18" required>
          <label for="compraAge">Edad</label>
        </div>
        <p>Género:
          <label><input name="gender" type="radio" value="Mujer" checked><span>Mujer</span></label>
          <label style="margin-left:1rem"><input name="gender" type="radio" value="Hombre"><span>Hombre</span></label>
        </p>
        <p>Pago:
          <label><input name="payment" type="radio" value="Contado" checked><span>Contado</span></label>
          <label style="margin-left:1rem"><input name="payment" type="radio" value="Auto usado"><span>Auto usado</span></label>
        </p>
        <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Enviar</button>
      </form>
    </section>`;
  M.AutoInit();

  // inicializa intl-tel-input con formato nacional
  const compraPhoneInput = document.querySelector('#compraPhone');
  const itiCompra = intlTelInput(compraPhoneInput, {
    initialCountry: 'auto',
    geoIpLookup: cb =>
      fetch('https://ipapi.co/json').then(r => r.json()).then(d => cb(d.country_code)),
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js',
    nationalMode: true,
    formatOnDisplay: true
  });

  // solo dígitos
  compraPhoneInput.addEventListener('keypress', e => {
    if (!/\d/.test(String.fromCharCode(e.which || e.keyCode))) e.preventDefault();
  });
  // formatea en tiempo real
  compraPhoneInput.addEventListener('input', () => {
    compraPhoneInput.value = itiCompra.getNumber(intlTelInputUtils.numberFormat.NATIONAL);
  });

  document.getElementById('compraForm').addEventListener('submit', e => {
    e.preventDefault();
    const name    = e.target.compraFullName.value.trim();
    const email   = e.target.compraEmail.value.trim();
    const address = e.target.compraAddress.value.trim();
    const age     = parseInt(e.target.compraAge.value, 10);

    if (!regexName.test(name))                   return M.toast({ html: 'Nombre inválido.' });
    if (!itiCompra.isValidNumber())              return M.toast({ html: 'Teléfono inválido.' });
    if (!regexEmail.test(email))                 return M.toast({ html: 'Email inválido.' });
    if (address.length < 10)                     return M.toast({ html: 'Dirección demasiado corta.' });
    if (isNaN(age) || age < 18 || age > 100)     return M.toast({ html: 'Edad inválida.' });

    M.toast({ html: 'En breve un agente se pondrá en contacto.' });
    window.location.hash = '#catalogo';
  });
}

function renderContacto() {
  app.innerHTML = `
    <section class="section contact-section">
      <h4>Dejá tus datos y nos contactamos</h4>
      <form id="contactForm">
        <div class="input-field">
          <input id="fullName" type="text" required>
          <label for="fullName">Nombre y Apellido</label>
        </div>
        <div class="input-field" style="position: relative;">
          <input id="phone" type="tel" required>
          <!-- etiqueta removida intencionadamente -->
        </div>
        <div class="input-field">
          <input id="email" type="email" required>
          <label for="email">Email</label>
        </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </form>
    </section>`;
  M.AutoInit();

  const contactPhoneInput = document.querySelector('#phone');
  const itiContact = intlTelInput(contactPhoneInput, {
    initialCountry: 'auto',
    geoIpLookup: cb =>
      fetch('https://ipapi.co/json').then(r => r.json()).then(d => cb(d.country_code)),
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js',
    nationalMode: true,
    formatOnDisplay: true
  });

  contactPhoneInput.addEventListener('keypress', e => {
    if (!/\d/.test(String.fromCharCode(e.which || e.keyCode))) e.preventDefault();
  });
  contactPhoneInput.addEventListener('input', () => {
    contactPhoneInput.value = itiContact.getNumber(intlTelInputUtils.numberFormat.NATIONAL);
  });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name  = e.target.fullName.value.trim();
    const email = e.target.email.value.trim();

    if (!regexName.test(name))            return M.toast({ html: 'Nombre inválido.' });
    if (!itiContact.isValidNumber())      return M.toast({ html: 'Teléfono inválido.' });
    if (!regexEmail.test(email))          return M.toast({ html: 'Email inválido.' });

    M.toast({ html: '¡Gracias! Nuestro equipo se pondrá en contacto.' });
    window.location.hash = '#catalogo';
  });
}


function renderUsuarios() {
  if (!currentUser || currentUser.role!=='admin') { app.innerHTML='<p>No tenés permisos.</p>'; return; }
  let html='<section class="section"><h4>Gestión de Usuarios</h4><table class="striped"><thead><tr><th>Usuario</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>';
  users.forEach((u,i)=>{html+=`<tr><td>${u.username}</td><td><div class="input-field"><select data-index="${i}" id="roleSelect${i}"><option value="admin"${u.role==='admin'?' selected':''}>Admin</option><option value="user"${u.role==='user'?' selected':''}>Usuario</option></select></div></td><td><button class="btn btn-small red" data-index="${i}">Eliminar</button></td></tr>`});
  html+='</tbody></table><h5>Agregar Usuario</h5><form id="addUserForm"><div class="input-field"><input id="newUsername" type="text" required><label for="newUsername">Usuario</label></div><div class="input-field"><input id="newPassword" type="password" required><label for="newPassword">Contraseña</label></div><div class="input-field"><select id="newRole"><option value="" disabled selected>Elije rol</option><option value="admin">Admin</option><option value="user">Usuario</option></select><label>Rol</label></div><button type="submit" class="btn btn-primary">Agregar</button></form></section>';
  app.innerHTML=html; M.FormSelect.init(document.querySelectorAll('select'));
  document.querySelectorAll('select[data-index]').forEach(sel=>sel.addEventListener('change',()=>{const i=+sel.getAttribute('data-index');users[i].role=sel.value;saveUsers();M.toast({html:`Rol de ${users[i].username} actualizado.`})}));
  document.querySelectorAll('button[data-index]').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.getAttribute('data-index');if(users[i].username===currentUser.username)return M.toast({html:'No podés eliminarte'});users.splice(i,1);saveUsers();M.toast({html:'Usuario eliminado.'});renderUsuarios()}));
  document.getElementById('addUserForm').addEventListener('submit',e=>{e.preventDefault();const u=e.target.newUsername.value.trim(),p=e.target.newPassword.value,r=e.target.newRole.value;users.push({username:u,email:'',password:p,role:r});saveUsers();M.toast({html:'Usuario agregado.'});renderUsuarios()});
}

function ajustarColumnas() {
  const cols=window.innerWidth<600?'s12':window.innerWidth<992?'m6 s12':'l4 m6 s12';
  document.querySelectorAll('.row>.col').forEach(c=>c.className=`col ${cols}`);
}