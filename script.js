const N8N_WEBHOOK_URL = 'https://espartacus96.app.n8n.cloud/webhook/parrillero-argentino';

let selectedItems = [];
let cartCount = 0;
let currentStep = 1;
let invoiceCounter = parseInt(localStorage.getItem('invoiceCounter') || '1001');

let testClientes = [];
let testReservas = [];
let testPedidos = [];
let testMenu = [];

const MENU_DATA = [
    { categoria: 'Parrilla', plato: 'Corte del Parrillero', precio: 49900, descripcion: 'Corte premium a las brasas' },
    { categoria: 'Parrilla', plato: 'Chorizo Argentino', precio: 28900, descripcion: 'Chorizo de la casa' },
    { categoria: 'Parrilla', plato: 'Chicharrón a las Brasas', precio: 34900, descripcion: 'Chicharrón crujiente' },
    { categoria: 'Parrilla', plato: 'Picada del Parrillero', precio: 89900, descripcion: 'Picada para compartir' },
    { categoria: 'Parrilla', plato: 'Costilla del Fuego', precio: 44900, descripcion: 'Costilla BBQ' },
    { categoria: 'Entradas', plato: 'Empanadas Argentinas', precio: 18900, descripcion: 'Empanadas rellenas' },
    { categoria: 'Entradas', plato: 'Provoleta a la Parrilla', precio: 24900, descripcion: 'Queso provolone gratinado' },
    { categoria: 'Entradas', plato: 'Pan de Ajo al Carbón', precio: 12900, descripcion: 'Pan con ajo y mantequilla' },
    { categoria: 'Entradas', plato: 'Chorizos Parrilleros', precio: 19900, descripcion: 'Chorizos a la parrilla' },
    { categoria: 'Acompañamientos', plato: 'Papas Criollas al Carbón', precio: 11900, descripcion: 'Papas criollas asadas' },
    { categoria: 'Acompañamientos', plato: 'Papas Rústicas', precio: 12900, descripcion: 'Papas rústicas con sal y hierbas' },
    { categoria: 'Acompañamientos', plato: 'Yuca Dorada', precio: 10900, descripcion: 'Yuca frita crujiente' },
    { categoria: 'Acompañamientos', plato: 'Pan Artesanal', precio: 7900, descripcion: 'Pan artesanal de la casa' },
    { categoria: 'Ensaladas', plato: 'Ensalada Criolla', precio: 12900, descripcion: 'Ensalada fresca' },
    { categoria: 'Ensaladas', plato: 'Ensalada Verde', precio: 13900, descripcion: 'Ensalada de lechuga' },
    { categoria: 'Ensaladas', plato: 'Ensalada de Tomate y Cebolla', precio: 11900, descripcion: 'Tomate, cebolla y vinagreta' },
    { categoria: 'Ensaladas', plato: 'Ensalada de la Casa', precio: 15900, descripcion: 'Ensalada premium' },
    { categoria: 'Postres', plato: 'Alfajor Argentino', precio: 10900, descripcion: 'Alfajor con dulce de leche' },
    { categoria: 'Postres', plato: 'Flan de Dulce de Leche', precio: 14900, descripcion: 'Flan casero' },
    { categoria: 'Postres', plato: 'Brownie con Helado', precio: 16900, descripcion: 'Brownie con helado de vainilla' },
    { categoria: 'Postres', plato: 'Cheesecake de la Casa', precio: 15900, descripcion: 'Torta de queso' },
    { categoria: 'Salsas', plato: 'Chimichurri', precio: 4900, descripcion: 'Salsa argentina' },
    { categoria: 'Salsas', plato: 'Salsa Criolla', precio: 4900, descripcion: 'Salsa tradicional' },
    { categoria: 'Salsas', plato: 'BBQ de la Casa', precio: 4900, descripcion: 'Salsa BBQ artesanal' },
    { categoria: 'Salsas', plato: 'Ají Parrillero', precio: 3900, descripcion: 'Ají picante' },
    { categoria: 'Salsas', plato: 'Salsa Especial del Parrillero', precio: 5900, descripcion: 'Receta secreta' },
    { categoria: 'Bebidas', plato: 'Águila Original 330ml', precio: 4500, descripcion: 'Cerveza colombiana' },
    { categoria: 'Bebidas', plato: 'Águila Light 330ml', precio: 4000, descripcion: 'Cerveza light' },
    { categoria: 'Bebidas', plato: 'Poker 330ml', precio: 4500, descripcion: 'Cerveza lager' },
    { categoria: 'Bebidas', plato: 'Pilsen 330ml', precio: 4000, descripcion: 'Cerveza artesanal' },
    { categoria: 'Bebidas', plato: 'Club Colombia 330ml', precio: 6500, descripcion: 'Cerveza premium' },
];

function generateTestData() {
    const nombres = ['María López','Carlos García','Ana Martínez','Pedro Sánchez','Laura Rodríguez','Juan Pérez','Sofía Hernández','Diego Torres','Camila Ramírez','Andrés Morales','Valentina Rojas','Sebastián Cruz','Isabella Vargas','Mateo Castillo','Luciana Medina','Gabriel Herrera','Daniela Flores','Tomás Ríos','Paula Acosta','Nicolás Vargas','Mariana Salazar','Felipe Gutiérrez','Carolina Jiménez','Roberto Díaz','Alejandra Muñoz','Miguel Ángel Parra','Catalina Suárez','Francisco Romero','Adriana Cárdenas','Ricardo Ospina','Tatiana Mejía','Hernán Castaño','Diana Velásquez','Óscar Giraldo','Liliana Cardona','Alfonso Rendón','Claudia Montoya','Sergio Arango','Patricia Londoño','Raúl Mesa','Angélica Ocampo','Gustavo Salazar','Mónica Roldán','Luis Fernando Arbeláez','Cecilia Montoya','Jorge Eliécer Gómez','Beatriz Elena Ayala','Carlos Andrés Pérez','Martha Lucía González','Javier Antonio Moreno'];
    const ciudades = ['Medellín','Envigado','Itagüí','Bello','Sabaneta','La Estrella','Calarcá','Pereira','Bucaramanga','Bogotá','Cali','Barranquilla'];
    const dominios = ['gmail.com','hotmail.com','outlook.com','yahoo.com','live.com'];
    const barrios = ['El Poblado','Laureles','Envigado','Sabaneta','Belén','Itagüí','Bello','Estadio','Floresta','Astorga'];
    const vías = ['Carrera','Calle','Avenida','Diagonal','Transversal'];
    const clases = ['A','B',''];
    const clientes = [], reservas = [], pedidos = [];
    const horarios = ['12:00','12:30','13:00','13:30','18:00','18:30','19:00','19:30','20:00','20:30'];
    const ubicaciones = ['Local','Terraza','Privado'];
    const ocasiones = ['Ninguna','Cumpleaños','Aniversario','Reunión de trabajo','Cena romántica','Reunión familiar'];
    const estados = ['Pendiente','Confirmada','Cancelada'];
    const modos = ['Domicilio','Recogida'];
    const métodos = ['Efectivo','Tarjeta','Nequi','Daviplata','Transferencia'];
    const platosPedido = ['Corte del Parrillero x1','Chorizo Argentino x2','Chicharrón a las Brasas x1','Picada del Parrillero x1','Costilla del Fuego x2','Empanadas Argentinas x4','Provoleta a la Parrilla x1','Papas Criollas al Carbón x2','Papas Rústicas x1','Yuca Dorada x1','Ensalada Criolla x1','Ensalada Verde x1','Flan de Dulce de Leche x2','Alfajor Argentino x3'];
    function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
    function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
    function shuffle(arr){ for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
    const shuffledNombres = shuffle([...nombres]);
    for(let i=0;i<500;i++){
        const nombre = i < shuffledNombres.length ? shuffledNombres[i] : `Cliente ${i+1}`;
        const dom = rand(dominios);
        const safeName = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'.');
        const cedula = String(10000000 + randInt(0,89999999));
        const tel = '3' + String(randInt(0,9)) + String(randInt(10000000,99999999)).slice(0,9);
        const barrio = rand(barrios);
        const via = rand(vías);
        const num1 = randInt(1,120);
        const num2 = randInt(1,99);
        const apt = randInt(1,999);
        const dir = `${via} ${num1} # ${num2}-${randInt(0,9)}${rand(clases)}, Apt ${apt}, ${barrio}, ${rand(ciudades)}`;
        clientes.push({ nombre, telefono: tel, ciudad: rand(ciudades), email: `${safeName}${i}@${dom}`, cedula, direccion: dir });
        if(i<100){
            const mes = randInt(8,10);
            const dia = randInt(1,28);
            reservas.push({ id:i+1, nombre, telefono:tel, email:`${safeName}${i}@${dom}`, fecha:`2026-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`, hora:rand(horarios), personas:randInt(1,8), ubicacion:rand(ubicaciones), ocasion:rand(ocasiones), estado:rand(estados) });
        }
        if(i<150){
            const mes = randInt(8,10);
            const dia = randInt(1,28);
            const numPlatos = randInt(1,4);
            const items = [];
            for(let j=0;j<numPlatos;j++) items.push(rand(platosPedido));
            pedidos.push({ id:i+1, nombre, telefono:tel, modo:rand(modos), direccion:rand(clientes).direccion, productos:items.join(', '), metodoPago:rand(métodos), estado:rand(estados), fecha:`2026-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}` });
        }
    }
    testClientes = clientes;
    testReservas = reservas;
    testPedidos = pedidos;
    testMenu = MENU_DATA;
}
generateTestData();

async function sendToN8n(payload) {
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            console.log('✅ Enviado a n8n:', payload.tipo);
        }
    } catch (err) {
        console.error('❌ Error enviando a n8n:', err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2500);

    initParticles();
    initTabs();
    initNavMenu();
    initForm();
    initScrollEffects();
    initCounters();
    initPaymentMethods();
    loadCartFromStorage();
});

function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const section = this.closest('.menu-tabs').parentElement;
            const sectionTabs = section.querySelectorAll('.tab-btn');
            sectionTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            section.querySelectorAll('.menu-grid').forEach(grid => grid.classList.remove('active'));
            const targetGrid = section.querySelector('#' + this.dataset.tab);
            targetGrid.classList.add('active');
            targetGrid.querySelectorAll('.menu-card').forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    });
}

function initNavMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        navbar.classList.toggle('scrolled', currentScroll > 50);
        
        if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScroll = currentScroll;
    });
}

function initForm() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
    document.getElementById('bookingForm').addEventListener('submit', handleFormSubmit);
}

function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.menu-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function closeImageModal() {
    document.getElementById('imageModal').classList.remove('active');
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.target));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

function initPaymentMethods() {
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const paymentDetails = document.getElementById('paymentDetails');
            const details = {
                efectivo: '<div class="detail-box"><i class="fas fa-info-circle"></i><p>Paga en efectivo contra entrega en tu dirección</p></div>',
                tarjeta: '<div class="detail-box"><i class="fas fa-info-circle"></i><p>Aceptamos tarjetas de crédito y débito (Visa, Mastercard, Amex)</p></div>',
                nequi: '<div class="detail-box"><i class="fas fa-info-circle"></i><p>Envía el pago al Nequi: <strong>300 555 0147</strong> - El Parrillero Argentino</p></div>',
                daviplata: '<div class="detail-box"><i class="fas fa-info-circle"></i><p>Envía el pago al Daviplata: <strong>300 555 0147</strong> - El Parrillero Argentino</p></div>',
                transferencia: '<div class="detail-box"><i class="fas fa-info-circle"></i><p>Banco Davivienda - Cta Ahorros: <strong>1234567890</strong> - Parrillero Argentino S.A.S</p></div>'
            };
            paymentDetails.innerHTML = details[this.value];
        });
    });
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('parrillaCart');
    if (saved) {
        selectedItems = JSON.parse(saved);
        updateCartUI();
    }
}

function saveCartToStorage() {
    localStorage.setItem('parrillaCart', JSON.stringify(selectedItems));
}

function togglePresentaciones(btn) {
    const list = btn.nextElementSibling;
    const isOpen = list.classList.contains('active');
    document.querySelectorAll('.presentaciones-list.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.btn-presentaciones.active').forEach(el => el.classList.remove('active'));
    if (!isOpen) {
        list.classList.add('active');
        btn.classList.add('active');
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.presentaciones-dropdown')) {
        document.querySelectorAll('.presentaciones-list.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.btn-presentaciones.active').forEach(el => el.classList.remove('active'));
    }
});

function addToReservation(itemName, price, image) {
    const existingItem = selectedItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        selectedItems.push({ name: itemName, price: price, image: image, quantity: 1 });
    }
    
    saveCartToStorage();
    updateCartUI();
    
    const btn = event && event.target ? event.target.closest('.btn-add') : null;
    if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1500);
    }
    
    showNotification(`${itemName} agregado al carrito`);
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    
    cartCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    updateSelectedItems();
    
    if (selectedItems.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.innerHTML = '';
        cartFooter.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    
    cartItems.innerHTML = selectedItems.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    
    document.getElementById('cartSubtotal').textContent = '$' + subtotal.toLocaleString();
    document.getElementById('cartIVA').textContent = '$' + iva.toLocaleString();
    document.getElementById('cartTotal').textContent = '$' + total.toLocaleString();
}

function changeQty(index, delta) {
    selectedItems[index].quantity += delta;
    if (selectedItems[index].quantity <= 0) {
        selectedItems.splice(index, 1);
    }
    saveCartToStorage();
    updateCartUI();
}

function removeCartItem(index) {
    const item = selectedItems[index];
    selectedItems.splice(index, 1);
    saveCartToStorage();
    updateCartUI();
    showNotification(`${item.name} eliminado del carrito`);
}

function updateSelectedItems() {
    const container = document.getElementById('selectedItems');
    const list = document.getElementById('itemsList');
    const totalSpan = document.getElementById('totalPrice');
    
    if (selectedItems.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    list.innerHTML = selectedItems.map((item, index) => `
        <li>
            <div class="item-info">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div>
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">x${item.quantity}</span>
                </div>
            </div>
            <div style="display:flex;align-items:center;">
                <span class="item-price">$${(item.price * item.quantity).toLocaleString()}</span>
                <button class="btn-remove" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
    
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalSpan.textContent = total.toLocaleString();
}

function removeItem(index) {
    selectedItems.splice(index, 1);
    saveCartToStorage();
    updateSelectedItems();
    updateCartUI();
}

function toggleCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function openCheckout() {
    if (selectedItems.length === 0) {
        showNotification('Agrega platos al carrito primero');
        return;
    }
    toggleCartSidebar();
    document.getElementById('checkoutModal').classList.add('active');
    currentStep = 1;
    updateSteps();
    document.getElementById('sendEmail').value = '';
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    currentStep = 1;
    updateSteps();
}

function goToStep(step) {
    if (step === 2) {
        const name = document.getElementById('checkoutName').value;
        const email = document.getElementById('checkoutEmail').value;
        const phone = document.getElementById('checkoutPhone').value;
        const address = document.getElementById('checkoutAddress').value;
        const cedula = document.getElementById('checkoutCedula').value;
        
        if (!name || !email || !phone || !address || !cedula) {
            showNotification('Por favor completa todos los campos');
            return;
        }
    }
    
    if (step === 3) {
        generateInvoice();
    }
    
    currentStep = step;
    updateSteps();
}

function updateSteps() {
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById('step' + i);
        const panelEl = document.getElementById('panel' + i);
        
        stepEl.classList.remove('active', 'completed');
        panelEl.classList.remove('active');
        
        if (i === currentStep) {
            stepEl.classList.add('active');
            panelEl.classList.add('active');
        } else if (i < currentStep) {
            stepEl.classList.add('completed');
        }
    }
}

function generateInvoice() {
    const invoiceNum = String(invoiceCounter).padStart(4, '0');
    invoiceCounter++;
    localStorage.setItem('invoiceCounter', invoiceCounter);
    
    document.getElementById('invoiceNumber').textContent = invoiceNum;
    document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    document.getElementById('invClient').textContent = document.getElementById('checkoutName').value;
    document.getElementById('invCedula').textContent = document.getElementById('checkoutCedula').value;
    document.getElementById('invAddress').textContent = document.getElementById('checkoutAddress').value;
    document.getElementById('invEmail').textContent = document.getElementById('checkoutEmail').value;
    
    const tbody = document.getElementById('invoiceItems');
    tbody.innerHTML = selectedItems.map(item => `
        <tr>
            <td>${item.quantity}</td>
            <td>${item.name}</td>
            <td>$${item.price.toLocaleString()}</td>
            <td>$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');
    
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    
    document.getElementById('invSubtotal').textContent = '$' + subtotal.toLocaleString();
    document.getElementById('invIVA').textContent = '$' + iva.toLocaleString();
    document.getElementById('invTotal').textContent = '$' + total.toLocaleString();
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const paymentNames = {
        efectivo: 'Efectivo contra entrega',
        tarjeta: 'Tarjeta de crédito/débito',
        nequi: 'Nequi',
        daviplata: 'Daviplata',
        transferencia: 'Transferencia bancaria'
    };
    document.getElementById('invPayment').textContent = paymentNames[paymentMethod];
    
    document.getElementById('sendEmail').value = document.getElementById('checkoutEmail').value;
}

function sendInvoice() {
    const email = document.getElementById('sendEmail').value;
    if (!email) {
        showNotification('Ingresa un correo electrónico');
        return;
    }
    
    const btn = document.querySelector('.btn-send-invoice');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
        btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        showNotification(`Factura enviada a ${email}`);
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Factura';
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 2000);
}

function confirmOrder() {
    const btn = document.querySelector('.btn-confirm');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btn.disabled = true;
    
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    
    const clientData = {
        name: document.getElementById('checkoutName').value,
        cedula: document.getElementById('checkoutCedula').value,
        email: document.getElementById('checkoutEmail').value,
        phone: document.getElementById('checkoutPhone').value,
        address: document.getElementById('checkoutAddress').value,
        notes: document.getElementById('checkoutNotes')?.value || '',
        total: total,
        items: selectedItems.map(i => `${i.name} x${i.quantity}`).join(', '),
        payment: document.querySelector('input[name="payment"]:checked')?.value || 'efectivo'
    };
    
    saveClientToDB(clientData);
    
    sendToN8n({
        tipo: 'pedido',
        datos: {
            Nombre: clientData.name,
            Telefono: clientData.phone,
            Tipo_Pedido: 'Domicilio',
            Direccion_Entrega: clientData.address,
            Referencia_Entrega: clientData.notes || 'Sin referencia',
            Detalle_Pedido: clientData.items,
            Metodo_Pago: clientData.payment,
            Estado: 'Pendiente'
        }
    });
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Pedido Confirmado!';
        
        const orderNumber = document.getElementById('invoiceNumber').textContent;
        
        showNotification('¡Pedido #' + orderNumber + ' confirmado exitosamente!');
        
        setTimeout(() => {
            closeCheckout();
            selectedItems = [];
            saveCartToStorage();
            updateCartUI();
            
            document.getElementById('checkoutForm').reset();
            
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar Pedido';
            btn.style.background = '';
            btn.disabled = false;
            
            showOrderConfirmation(orderNumber);
        }, 1500);
    }, 2500);
}

function showOrderConfirmation(orderNum) {
    const modal = document.getElementById('confirmationModal');
    const details = document.getElementById('confirmationDetails');
    
    details.innerHTML = `
        <strong>Pedido #${orderNum}</strong><br><br>
        Tu pedido ha sido procesado exitosamente.<br>
        Recibirás un correo con los detalles de tu compra.<br><br>
        <strong>¡Gracias por elegir Parrillero Argentino! 🔥🥩</strong>
    `;
    
    modal.classList.add('active');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        notes: document.getElementById('notes').value,
        items: selectedItems,
        total: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    sendToN8n({
        tipo: 'reserva',
        datos: {
            Nombre: formData.name,
            Email: formData.email,
            Telefono: formData.phone,
            Fecha: formData.date,
            Hora: formData.time,
            Personas: formData.guests,
            Ubicacion_Preferida: 'Local',
            Celebracion_Especial: formData.notes || 'Ninguna',
            Estado: 'Pendiente'
        }
    });
    
    showConfirmation(formData);
    e.target.reset();
}

function showConfirmation(data) {
    const modal = document.getElementById('confirmationModal');
    const details = document.getElementById('confirmationDetails');
    
    const dateFormatted = new Date(data.date).toLocaleDateString('es-CO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    let itemsList = '';
    if (data.items && data.items.length > 0) {
        itemsList = '<br><br><strong>Tu pedido:</strong><br>' + 
            data.items.map(i => `• ${i.name} x${i.quantity} - $${(i.price * i.quantity).toLocaleString()}`).join('<br>') +
            `<br><br><strong>Total: $${data.total.toLocaleString()}</strong>`;
    }
    
    details.innerHTML = `
        <strong>${data.name}</strong><br>
        📧 ${data.email}<br>
        📞 ${data.phone}<br>
        📅 ${dateFormatted}<br>
        🕐 ${data.time}<br>
        👥 ${data.guests} personas
        ${itemsList}
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('confirmationModal').classList.remove('active');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4);
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100px); } }
`;
document.head.appendChild(style);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeImageModal();
        closeCheckout();
        closeLogin();
        closeAdmin();
        if (document.getElementById('cartSidebar').classList.contains('active')) toggleCartSidebar();
    }
});

// ============ AUTH SYSTEM ============
let currentUser = JSON.parse(localStorage.getItem('parrillaCurrentUser') || 'null');
let users = JSON.parse(localStorage.getItem('parrillaUsers') || '[]');

if (users.length === 0) {
    users.push({
        name: 'Administrador',
        doc: '1000',
        email: 'admin@elparrilleroargentino.demo',
        phone: '300 555 0147',
        password: 'admin123',
        role: 'admin',
        created: new Date().toISOString()
    });
    localStorage.setItem('parrillaUsers', JSON.stringify(users));
}

function toggleAdmin() {
    if (currentUser) {
        openAdminPanel();
    } else {
        document.getElementById('loginModal').classList.add('active');
    }
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

function openAdminPanel() {
    document.getElementById('adminModal').classList.add('active');
    loadClientsData();
    loadReservasData();
    loadPedidosData();
    loadMenuData();
    loadOffersData();
    updateAdminPermissions();
}

function closeAdmin() {
    document.getElementById('adminModal').classList.remove('active');
}

function switchLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.login-panel').forEach(p => p.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.login-tab')[0].classList.add('active');
        document.getElementById('loginPanel').classList.add('active');
    } else {
        document.querySelectorAll('.login-tab')[1].classList.add('active');
        document.getElementById('registerPanel').classList.add('active');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.toggle-pass i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const doc = document.getElementById('loginDoc').value.trim();
    const pass = document.getElementById('loginPass').value;
    const errorDiv = document.getElementById('loginError');
    
    const user = users.find(u => u.doc === doc && u.password === pass);
    
    if (!user) {
        errorDiv.textContent = 'Documento o contraseña incorrectos';
        return;
    }
    
    currentUser = user;
    localStorage.setItem('parrillaCurrentUser', JSON.stringify(user));
    
    closeLogin();
    
    setTimeout(() => {
        openAdminPanel();
        showNotification(`Bienvenido, ${user.name}`);
    }, 300);
}

function handleRegister(e) {
    e.preventDefault();
    
    const role = document.querySelector('input[name="role"]:checked').value;
    const name = document.getElementById('regName').value.trim();
    const doc = document.getElementById('regDoc').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPass').value;
    const passConfirm = document.getElementById('regPassConfirm').value;
    const errorDiv = document.getElementById('registerError');
    
    if (pass !== passConfirm) {
        errorDiv.textContent = 'Las contraseñas no coinciden';
        return;
    }
    
    if (pass.length < 6) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
        return;
    }
    
    if (users.find(u => u.doc === doc)) {
        errorDiv.textContent = 'Este documento ya está registrado';
        return;
    }
    
    if (users.find(u => u.email === email)) {
        errorDiv.textContent = 'Este correo ya está registrado';
        return;
    }
    
    const newUser = {
        name, doc, email, phone, password: pass, role,
        created: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('parrillaUsers', JSON.stringify(users));
    
    errorDiv.textContent = '';
    showNotification('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
    
    document.getElementById('registerForm').reset();
    switchLoginTab('login');
    document.getElementById('loginDoc').value = doc;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('parrillaCurrentUser');
    closeAdmin();
    showNotification('Sesión cerrada');
}

function updateAdminPermissions() {
    if (!currentUser) return;
    
    const isAdmin = currentUser.role === 'admin';
    
    document.querySelectorAll('.admin-tab')[5].style.display = isAdmin ? 'flex' : 'none';
    
    const btnClear = document.querySelector('.btn-clear');
    if (btnClear) btnClear.style.display = isAdmin ? 'flex' : 'none';
    
    const header = document.querySelector('.admin-header');
    header.innerHTML = `
        <i class="fas fa-cog"></i>
        <div style="flex:1;">
            <h2>Panel de Administración</h2>
            <small style="color:var(--text-muted);">
                <i class="fas fa-${isAdmin ? 'user-shield' : 'user-tie'}"></i> 
                ${currentUser.name} - ${isAdmin ? 'Administrador' : 'Empleado'}
            </small>
        </div>
        <button onclick="logout()" style="padding:8px 15px;background:rgba(255,0,0,0.2);border:1px solid #ff4444;color:#ff4444;border-radius:8px;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:5px;">
            <i class="fas fa-sign-out-alt"></i> Salir
        </button>
    `;
}

function loadUsersList() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.doc}</td>
            <td>${u.email}</td>
            <td><span style="padding:3px 10px;border-radius:10px;font-size:0.8rem;font-weight:600;${u.role === 'admin' ? 'background:rgba(255,215,0,0.2);color:var(--accent);' : 'background:rgba(0,123,255,0.2);color:#007bff;'}">${u.role === 'admin' ? 'Admin' : 'Empleado'}</span></td>
            <td>
                ${u.doc !== '1000' ? `<button onclick="deleteUser('${u.doc}')" style="padding:5px 10px;background:rgba(255,0,0,0.2);border:1px solid #ff4444;color:#ff4444;border-radius:5px;cursor:pointer;"><i class="fas fa-trash"></i></button>` : '<span style="color:#666;">Sistema</span>'}
            </td>
        </tr>
    `).join('');
}

function deleteUser(doc) {
    if (!confirm('¿Eliminar este usuario?')) return;
    users = users.filter(u => u.doc !== doc);
    localStorage.setItem('parrillaUsers', JSON.stringify(users));
    loadUsersList();
    showNotification('Usuario eliminado');
}

// ============ ADMIN PANEL ============
let clients = JSON.parse(localStorage.getItem('parrillaClients') || '[]');
let offers = JSON.parse(localStorage.getItem('parrillaOffers') || '[]');
let offerImageBase64 = null;
let offerType = 'descuento';

function setOfferType(type) {
    offerType = type;
    const btnDesc = document.getElementById('btnConDescuento');
    const btnSinDesc = document.getElementById('btnSinDescuento');
    const discountGroup = document.getElementById('discountGroup');
    if (type === 'descuento') {
        btnDesc.classList.add('active');
        btnSinDesc.classList.remove('active');
        discountGroup.style.display = 'block';
    } else {
        btnSinDesc.classList.add('active');
        btnDesc.classList.remove('active');
        discountGroup.style.display = 'none';
        document.getElementById('offerDiscount').value = '';
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    event.target.closest('.admin-tab').classList.add('active');
    document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

function loadClientsData() {
    const allClients = [...testClientes, ...clients];
    const uniqueClients = [];
    const seenCedulas = new Set();
    for (const c of allClients) {
        const key = c.cedula || c.doc;
        if (!seenCedulas.has(key)) {
            seenCedulas.add(key);
            uniqueClients.push(c);
        }
    }
    
    document.getElementById('totalClients').textContent = uniqueClients.length;
    
    const totalOrders = testPedidos.length + clients.reduce((sum, c) => sum + (c.orders || 1), 0);
    document.getElementById('totalOrders').textContent = totalOrders;
    
    const totalRevenue = testPedidos.reduce((sum) => sum + Math.floor(Math.random() * 150000) + 20000, 0);
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toLocaleString();
    
    const tbody = document.getElementById('clientsTableBody');
    const displayClients = uniqueClients.slice(0, 100);
    
    tbody.innerHTML = displayClients.map(c => `
        <tr>
            <td>${c.nombre || c.name || ''}</td>
            <td>${c.cedula || c.doc || ''}</td>
            <td>${c.email || ''}</td>
            <td>${c.telefono || c.phone || ''}</td>
            <td>${c.direccion || c.address || ''}</td>
            <td>$${(c.total || Math.floor(Math.random() * 150000) + 20000).toLocaleString()}</td>
            <td>${c.date || '2026-08-20'}</td>
        </tr>
    `).join('');
}

function saveClientToDB(clientData) {
    const existing = clients.find(c => c.cedula === clientData.cedula);
    if (existing) {
        existing.orders = (existing.orders || 1) + 1;
        existing.total = (existing.total || 0) + clientData.total;
    } else {
        clients.push({
            ...clientData,
            orders: 1,
            date: new Date().toLocaleDateString('es-CO')
        });
    }
    localStorage.setItem('parrillaClients', JSON.stringify(clients));
}

function exportToExcel() {
    if (clients.length === 0) {
        showNotification('No hay datos para exportar');
        return;
    }
    
    const data = clients.map(c => ({
        'Nombre': c.name,
        'Cédula': c.cedula,
        'Email': c.email,
        'Teléfono': c.phone,
        'Dirección': c.address,
        'Total Compra': c.total,
        'N° Pedidos': c.orders || 1,
        'Fecha': c.date
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    
    ws['!cols'] = [
        { wch: 25 }, { wch: 15 }, { wch: 30 },
        { wch: 15 }, { wch: 30 }, { wch: 15 },
        { wch: 12 }, { wch: 15 }
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Parrilla_IA_Clientes_${date}.xlsx`);
    
    showNotification('Archivo Excel exportado exitosamente');
}

function clearClients() {
    if (confirm('¿Estás seguro de eliminar todos los datos de clientes?')) {
        clients = [];
        localStorage.removeItem('parrillaClients');
        loadClientsData();
        showNotification('Datos de clientes eliminados');
    }
}

function loadReservasData() {
    const tbody = document.getElementById('reservasTableBody');
    if (!tbody) return;
    const filter = document.getElementById('reservaFilter')?.value || 'all';
    const search = (document.getElementById('reservaSearch')?.value || '').toLowerCase();
    let filtered = testReservas;
    if (filter !== 'all') filtered = filtered.filter(r => r.estado === filter);
    if (search) filtered = filtered.filter(r => r.nombre.toLowerCase().includes(search) || r.telefono.includes(search));
    document.getElementById('totalReservas').textContent = testReservas.length;
    document.getElementById('reservasPendientes').textContent = testReservas.filter(r => r.estado === 'Pendiente').length;
    document.getElementById('reservasConfirmadas').textContent = testReservas.filter(r => r.estado === 'Confirmada').length;
    document.getElementById('reservasCanceladas').textContent = testReservas.filter(r => r.estado === 'Cancelada').length;
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="9">No se encontraron reservas</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.nombre}</td>
            <td>${r.telefono}</td>
            <td>${r.fecha}</td>
            <td>${r.hora}</td>
            <td>${r.personas}</td>
            <td>${r.ubicacion}</td>
            <td>${r.ocasion}</td>
            <td><span class="status-badge status-${r.estado.toLowerCase()}">${r.estado}</span></td>
        </tr>
    `).join('');
}

function filterReservas() {
    loadReservasData();
}

function loadPedidosData() {
    const tbody = document.getElementById('pedidosTableBody');
    if (!tbody) return;
    const filter = document.getElementById('pedidoFilter')?.value || 'all';
    const search = (document.getElementById('pedidoSearch')?.value || '').toLowerCase();
    let filtered = testPedidos;
    if (filter !== 'all') filtered = filtered.filter(p => p.estado === filter);
    if (search) filtered = filtered.filter(p => p.nombre.toLowerCase().includes(search) || p.productos.toLowerCase().includes(search));
    document.getElementById('totalPedidos').textContent = testPedidos.length;
    document.getElementById('pedidosDomicilio').textContent = testPedidos.filter(p => p.modo === 'Domicilio').length;
    document.getElementById('pedidosRecogida').textContent = testPedidos.filter(p => p.modo === 'Recogida').length;
    document.getElementById('pedidosPendientes').textContent = testPedidos.filter(p => p.estado === 'Pendiente').length;
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No se encontraron pedidos</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.telefono}</td>
            <td><span class="mode-badge mode-${p.modo.toLowerCase()}">${p.modo}</span></td>
            <td class="productos-cell">${p.productos}</td>
            <td>${p.metodoPago}</td>
            <td><span class="status-badge status-${p.estado.toLowerCase()}">${p.estado}</span></td>
            <td>${p.fecha}</td>
        </tr>
    `).join('');
}

function filterPedidos() {
    loadPedidosData();
}

function loadMenuData() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;
    const search = (document.getElementById('menuSearch')?.value || '').toLowerCase();
    let filtered = testMenu;
    if (search) filtered = filtered.filter(m => m.plato.toLowerCase().includes(search) || m.categoria.toLowerCase().includes(search));
    document.getElementById('totalPlatos').textContent = testMenu.length;
    document.getElementById('platosParrilla').textContent = testMenu.filter(m => m.categoria === 'Parrilla').length;
    document.getElementById('platosEntradas').textContent = testMenu.filter(m => m.categoria === 'Entradas' || m.categoria === 'Acompañamientos' || m.categoria === 'Ensaladas').length;
    document.getElementById('platosBebidas').textContent = testMenu.filter(m => m.categoria === 'Bebidas' || m.categoria === 'Salsas' || m.categoria === 'Postres').length;
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="4">No se encontraron platos</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(m => `
        <tr>
            <td><span class="cat-badge cat-${m.categoria.toLowerCase()}">${m.categoria}</span></td>
            <td>${m.plato}</td>
            <td class="price-cell">$${m.precio.toLocaleString()}</td>
            <td>${m.descripcion}</td>
        </tr>
    `).join('');
}

function filterMenu() {
    loadMenuData();
}

function loadOffersData() {
    offers = JSON.parse(localStorage.getItem('parrillaOffers') || '[]');
    
    const grid = document.getElementById('offersGrid');
    const select = document.getElementById('selectOffer');
    
    if (offers.length === 0) {
        grid.innerHTML = '<div class="empty-offers"><i class="fas fa-tag"></i><p>No hay ofertas creadas</p></div>';
        select.innerHTML = '<option value="">No hay ofertas disponibles</option>';
        return;
    }
    
    grid.innerHTML = offers.map((o, i) => {
        const sinDescuento = o.type === 'sin_descuento' || o.discount === '0';
        const badge = sinDescuento
            ? '<span class="offer-card-discount offer-sin-desc"><i class="fas fa-tag"></i> Sin Descuento</span>'
            : `<span class="offer-card-discount">${o.discount}% OFF</span>`;
        return `
        <div class="offer-card">
            ${o.image ? `<img src="${o.image}" class="offer-card-image" alt="${o.title}">` : '<div class="offer-card-image" style="background:#333;display:flex;align-items:center;justify-content:center;"><i class="fas fa-image" style="font-size:2rem;color:#666;"></i></div>'}
            <div class="offer-card-body">
                <div class="offer-card-title">${o.title}</div>
                <div class="offer-card-desc">${o.description}</div>
                ${badge}
                <div class="offer-card-expiry"><i class="fas fa-clock"></i> Expira: ${o.expiry}</div>
                <div class="offer-card-actions">
                    <button class="btn-delete-offer" onclick="deleteOffer(${i})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    
    select.innerHTML = '<option value="">Seleccionar oferta...</option>' + 
        offers.map((o, i) => {
            const sinDescuento = o.type === 'sin_descuento' || o.discount === '0';
            return `<option value="${i}">${o.title}${sinDescuento ? ' (Sin descuento)' : ` - ${o.discount}% OFF`}</option>`;
        }).join('');
}

function showAddOfferForm() {
    document.getElementById('offerForm').style.display = 'block';
    document.getElementById('offerTitle').value = '';
    document.getElementById('offerDesc').value = '';
    document.getElementById('offerDiscount').value = '';
    document.getElementById('offerExpiry').value = '';
    document.getElementById('uploadPreview').innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Seleccionar imagen</span>';
    offerImageBase64 = null;
    setOfferType('descuento');
}

function hideOfferForm() {
    document.getElementById('offerForm').style.display = 'none';
}

function previewOfferImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        offerImageBase64 = e.target.result;
        document.getElementById('uploadPreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

function saveOffer() {
    const title = document.getElementById('offerTitle').value;
    const desc = document.getElementById('offerDesc').value;
    const discount = offerType === 'descuento' ? document.getElementById('offerDiscount').value : '0';
    const expiry = document.getElementById('offerExpiry').value;
    
    if (!title || !desc || !expiry) {
        showNotification('Completa todos los campos');
        return;
    }
    if (offerType === 'descuento' && !discount) {
        showNotification('Ingresa el porcentaje de descuento');
        return;
    }
    
    offers.push({
        title, description: desc, discount, expiry, type: offerType,
        image: offerImageBase64,
        created: new Date().toISOString()
    });
    
    localStorage.setItem('parrillaOffers', JSON.stringify(offers));
    loadOffersData();
    hideOfferForm();
    showNotification('Oferta creada exitosamente');
}

function deleteOffer(index) {
    if (confirm('¿Eliminar esta oferta?')) {
        offers.splice(index, 1);
        localStorage.setItem('parrillaOffers', JSON.stringify(offers));
        loadOffersData();
        showNotification('Oferta eliminada');
    }
}

document.querySelector('input[name="recipients"]')?.addEventListener('change', function() {
    const selectedDiv = document.getElementById('selectedClients');
    if (this.value === 'selected') {
        selectedDiv.style.display = 'block';
        loadClientsCheckboxes();
    } else {
        selectedDiv.style.display = 'none';
    }
});

document.getElementById('selectOffer')?.addEventListener('change', function() {
    const preview = document.getElementById('emailPreview');
    if (this.value !== '') {
        preview.style.display = 'block';
        const offer = offers[this.value];
        document.getElementById('previewEmailContent').innerHTML = `
            <div class="preview-email-header">
                <h3>🔥 Parrillero Argentino - ¡Oferta Especial!</h3>
            </div>
            <div class="preview-email-body">
                ${offer.image ? `<img src="${offer.image}" alt="${offer.title}">` : ''}
                <h3 style="color:#8B0000;margin-bottom:10px;">${offer.title}</h3>
                <p style="color:#666;margin-bottom:15px;">${offer.description}</p>
                <div style="background:#ff4500;color:white;padding:10px 20px;border-radius:25px;display:inline-block;font-weight:bold;font-size:1.2rem;">
                    ${offer.discount}% DE DESCUENTO
                </div>
                <p style="margin-top:15px;color:#999;font-size:0.85rem;">Válido hasta: ${offer.expiry}</p>
            </div>
        `;
    } else {
        preview.style.display = 'none';
    }
});

function loadClientsCheckboxes() {
    const container = document.getElementById('clientsCheckboxes');
    if (clients.length === 0) {
        container.innerHTML = '<p style="color:#999;padding:10px;">No hay clientes registrados</p>';
        return;
    }
    container.innerHTML = clients.map((c, i) => `
        <label class="client-checkbox">
            <input type="checkbox" value="${i}" checked>
            <span>${c.name} (${c.email})</span>
        </label>
    `).join('');
}

function selectAllClients() {
    document.querySelectorAll('#clientsCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = true);
}

function deselectAllClients() {
    document.querySelectorAll('#clientsCheckboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
}

function sendOffersToClients() {
    const offerIndex = document.getElementById('selectOffer').value;
    if (offerIndex === '') {
        showNotification('Selecciona una oferta primero');
        return;
    }
    
    const offer = offers[offerIndex];
    const recipients = document.querySelector('input[name="recipients"]:checked').value;
    
    let targetEmails = [];
    let targetNames = [];
    if (recipients === 'all') {
        targetEmails = clients.map(c => c.email);
        targetNames = clients.map(c => c.name);
    } else {
        const checkboxes = document.querySelectorAll('#clientsCheckboxes input[type="checkbox"]:checked');
        targetEmails = Array.from(checkboxes).map(cb => clients[parseInt(cb.value)].email);
        targetNames = Array.from(checkboxes).map(cb => clients[parseInt(cb.value)].name);
    }
    
    if (targetEmails.length === 0) {
        showNotification('No hay destinatarios seleccionados');
        return;
    }
    
    const btn = document.querySelector('.btn-send-offers');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const payload = {
        tipo: 'oferta',
        timestamp: new Date().toISOString(),
        oferta: {
            titulo: offer.title,
            descripcion: offer.description,
            descuento: offer.discount + '%',
            tipo: offer.type,
            vencimiento: offer.expiry,
            imagen: offer.image || null
        },
        destinatarios: targetEmails.map((email, i) => ({
            email: email,
            nombre: targetNames[i] || ''
        }))
    };

    fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado a ' + targetEmails.length + ' clientes!';
        btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        showNotification('Oferta "' + offer.title + '" enviada a ' + targetEmails.length + ' clientes');
    })
    .catch(err => {
        console.error('❌ Error enviando ofertas:', err);
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error al enviar';
        btn.style.background = '#dc3545';
        showNotification('Error al enviar ofertas. Verifica la conexión con n8n.');
    })
    .finally(() => {
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Ofertas';
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

// ============ CHATBOT ESTILO WHATSAPP ============
// Conexión directa a Botpress Chat API (integración "Chat" del bot).
// n8n NO recibe chats: queda solo para reservas/pedidos (Sheets/Gmail).
//
// 1) Pega aquí el webhookId que genera Botpress Studio al activar la integración "Chat":
const BOTPRESS_WEBHOOK_ID_CODIGO = '3e1c0a27-b42e-479f-9a3a-34e6db4313f4';
//
// 2) O configúralo sin editar código (consola del navegador):
//    localStorage.setItem('parrillaBpWebhookId', 'TU_WEBHOOK_ID')
const BOTPRESS_WEBHOOK_ID = BOTPRESS_WEBHOOK_ID_CODIGO || localStorage.getItem('parrillaBpWebhookId') || '';

let chatSessionId = localStorage.getItem('parrillaChatSession');
if (!chatSessionId) {
    chatSessionId = 'web-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('parrillaChatSession', chatSessionId);
}

const CHAT_FALLBACKS = [
    'Gracias por tu mensaje. En un momento un asesor te responderá. 🙌',
    '¡Recibido! Si prefieres atención inmediata escríbenos al WhatsApp +57 300 555 0147.',
    'Estoy teniendo problemas para conectar en este momento. Inténtalo de nuevo en unos segundos.'
];

function toggleChat() {
    const widget = document.getElementById('chatWidget');
    const badge = document.getElementById('chatBadge');
    const isOpen = widget.classList.toggle('open');

    if (isOpen) {
        if (badge) badge.style.display = 'none';
        setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
    }
}

function minimizeChat(e) {
    if (e) e.stopPropagation();
    document.getElementById('chatWidget').classList.remove('open');
}

function getNowTime() {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function appendMessage(text, direction, withCheck = false) {
    const body = document.getElementById('chatBody');
    const div = document.createElement('div');
    div.className = `msg msg-${direction}`;
    const time = getNowTime();
    const checks = withCheck ? '<i class="fas fa-check-double"></i>' : '';
    div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}<span class="msg-time">${time} ${checks}</span></div>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
}

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML.replace(/\n/g, '<br>');
}

function showTyping(show) {
    const t = document.getElementById('chatTyping');
    if (t) t.style.display = show ? 'flex' : 'none';
    if (show) {
        const body = document.getElementById('chatBody');
        body.scrollTop = body.scrollHeight;
    }
}

// ---- Botpress Chat API (REST) ----
function bpApiUrl() {
    return `https://chat.botpress.cloud/${BOTPRESS_WEBHOOK_ID}`;
}

async function getBotpressSession() {
    let sess = null;
    try { sess = JSON.parse(localStorage.getItem('parrillaBpSession') || 'null'); } catch {}
    if (sess?.userKey && sess?.conversationId && sess?.webhookId === BOTPRESS_WEBHOOK_ID) return sess;

    const uRes = await fetch(`${bpApiUrl()}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    if (!uRes.ok) throw new Error(`users HTTP ${uRes.status}`);
    const { user, key } = await uRes.json();

    let cRes = await fetch(`${bpApiUrl()}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-key': key },
        body: JSON.stringify({})
    });
    if (!cRes.ok) {
        cRes = await fetch(`${bpApiUrl()}/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-key': key },
            body: JSON.stringify({ clientUserId: user.id })
        });
    }
    if (!cRes.ok) throw new Error(`conversations HTTP ${cRes.status}`);
    const { conversation } = await cRes.json();

    sess = {
        webhookId: BOTPRESS_WEBHOOK_ID,
        userId: user.id,
        userKey: key,
        conversationId: conversation.id
    };
    localStorage.setItem('parrillaBpSession', JSON.stringify(sess));
    chatSessionId = conversation.id;
    localStorage.setItem('parrillaChatSession', conversation.id);
    return sess;
}

const bpSeenIds = new Set();

async function sendToBotpress(mensaje) {
    if (!BOTPRESS_WEBHOOK_ID) return null;

    try {
        showTyping(true);
        const sess = await getBotpressSession();

        const res = await fetch(`${bpApiUrl()}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-key': sess.userKey },
            body: JSON.stringify({ payload: { type: 'text', text: mensaje }, conversationId: sess.conversationId })
        });
        if (!res.ok) throw new Error(`message HTTP ${res.status}`);
        const { message } = await res.json();

        bpSeenIds.add(message.id);
        let recibidas = 0;

        console.log(`🔵 [BP] Sent message ${message.id}: "${mensaje}"`);

        return await new Promise((resolve) => {
            const timer = setTimeout(() => {
                clearInterval(poll);
                console.log(`🔵 [BP] Timeout after 45s, recibidas=${recibidas}`);
                resolve(recibidas > 0 ? '' : CHAT_FALLBACKS[0]);
            }, 45000);

            const poll = setInterval(async () => {
                try {
                    const r = await fetch(`${bpApiUrl()}/conversations/${sess.conversationId}/messages`, {
                        headers: { 'x-user-key': sess.userKey }
                    });
                    if (!r.ok) return;
                    const data = await r.json();
                    const nuevosBot = [];
                    const allMessages = data.messages || [];
                    console.log(`🔵 [BP] Poll: ${allMessages.length} total msgs, seen=${bpSeenIds.size}`);
                    for (const m of allMessages) {
                        if (bpSeenIds.has(m.id)) continue;
                        bpSeenIds.add(m.id);
                        if (m.userId !== sess.userId) {
                            const texto = m.payload?.text ?? m.payload?.markdown
                                ?? (Array.isArray(m.payload)
                                    ? m.payload.map(p => p.text ?? p.markdown ?? '').join('\n').trim()
                                    : '');
                            if (texto) {
                                console.log(`🟢 [BP] Bot msg ${m.id}: "${texto.substring(0, 60)}..."`);
                                nuevosBot.push(texto);
                            }
                        }
                    }
                    if (nuevosBot.length > 0) {
                        clearTimeout(timer);
                        clearInterval(poll);
                        showTyping(false);
                        for (const texto of nuevosBot) {
                            appendMessage(texto, 'in');
                        }
                        recibidas += nuevosBot.length;
                        console.log(`🟢 [BP] Displayed ${nuevosBot.length} msgs, waiting 3s for more...`);
                        setTimeout(async () => {
                            try {
                                const r2 = await fetch(`${bpApiUrl()}/conversations/${sess.conversationId}/messages`, {
                                    headers: { 'x-user-key': sess.userKey }
                                });
                                if (r2.ok) {
                                    const d2 = await r2.json();
                                    const extraBot = [];
                                    for (const m of (d2.messages || [])) {
                                        if (bpSeenIds.has(m.id)) continue;
                                        bpSeenIds.add(m.id);
                                        if (m.userId !== sess.userId) {
                                            const texto = m.payload?.text ?? m.payload?.markdown
                                                ?? (Array.isArray(m.payload)
                                                    ? m.payload.map(p => p.text ?? p.markdown ?? '').join('\n').trim()
                                                    : '');
                                            if (texto) {
                                                console.log(`🟢 [BP] Extra msg ${m.id}: "${texto.substring(0, 60)}..."`);
                                                extraBot.push(texto);
                                                appendMessage(texto, 'in');
                                                recibidas++;
                                            }
                                        }
                                    }
                                    if (extraBot.length > 0) {
                                        console.log(`🟢 [BP] Found ${extraBot.length} extra msgs after 3s wait`);
                                    }
                                }
                            } catch {}
                            console.log(`🔵 [BP] Resolving, total recibidas=${recibidas}`);
                            resolve('');
                        }, 3000);
                        return;
                    }
                } catch {}
            }, 1500);
        });
    } catch (err) {
        console.error('🔴 Botpress error:', err);
        showTyping(false);
        return null;
    }
}

let chatBusy = false;

async function sendChatMessage() {
    if (chatBusy) return;
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();
    if (!mensaje) return;

    input.value = '';
    appendMessage(mensaje, 'out', true);
    hideQuickReplies();

    chatBusy = true;

    const bpResult = await sendToBotpress(mensaje);

    if (bpResult === null) {
        appendMessage(CHAT_FALLBACKS[Math.floor(Math.random() * CHAT_FALLBACKS.length)], 'in');
    }
    chatBusy = false;
    document.getElementById('chatInput').focus();
}

function sendQuickReply(texto) {
    const input = document.getElementById('chatInput');
    input.value = texto;
    sendChatMessage();
}

function hideQuickReplies() {
    const qr = document.getElementById('quickReplies');
    if (qr) qr.style.display = 'none';
}

// Badge de notificación al cargar
document.addEventListener('DOMContentLoaded', () => {
    const widget = document.getElementById('chatWidget');
    if (!widget) return;

    setTimeout(() => {
        const badge = document.getElementById('chatBadge');
        if (badge && !widget.classList.contains('open')) {
            badge.textContent = '1';
        }
    }, 4000);
});