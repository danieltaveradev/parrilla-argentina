// ============ MOTOR DE DISPONIBILIDAD DE RESERVAS ============
// Horarios reales de la página (formato decimal: 20.5 = 8:30 pm)
const HORARIO_SERVICIO = {
    0: { dia: 'Domingo', abre: 12, cierra: 20.5 },
    1: { dia: 'Lunes', abre: 12, cierra: 21.5 },
    2: { dia: 'Martes', abre: 12, cierra: 21.5 },
    3: { dia: 'Miércoles', abre: 12, cierra: 21.5 },
    4: { dia: 'Jueves', abre: 12, cierra: 22 },
    5: { dia: 'Viernes', abre: 12, cierra: 23 },
    6: { dia: 'Sábado', abre: 12, cierra: 23 }
};
const CAPACIDAD_SLOT = 40;
let chatReservas = JSON.parse(localStorage.getItem('parrillaChatReservas') || '[]');
let chatFlow = { active: false, step: null, data: {} };

function normTexto(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function parseFecha(texto) {
    const t = normTexto(texto);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (/\bhoy\b/.test(t)) return new Date(hoy);
    if (/\bpasado ?manana\b/.test(t)) { const d = new Date(hoy); d.setDate(d.getDate() + 2); return d; }
    if (/\bmanana\b/.test(t)) { const d = new Date(hoy); d.setDate(d.getDate() + 1); return d; }

    const dias = [['domingo',0],['lunes',1],['martes',2],['miercoles',3],['jueves',4],['viernes',5],['sabado',6]];
    for (const [nombre, idx] of dias) {
        if (new RegExp(`\\b${nombre}\\b`).test(t)) {
            const d = new Date(hoy);
            let diff = (idx - d.getDay() + 7) % 7;
            if (diff === 0) diff = 7;
            d.setDate(d.getDate() + diff);
            return d;
        }
    }

    let m = t.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
    if (m) {
        const dia = +m[1], mes = +m[2];
        if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
            const y = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : hoy.getFullYear();
            return new Date(y, mes - 1, dia);
        }
    }

    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    m = t.match(/(\d{1,2})\s*(?:de\s*)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)/);
    if (m) {
        const mes = meses.indexOf(m[2] === 'setiembre' ? 'septiembre' : m[2]);
        return new Date(hoy.getFullYear(), mes, +m[1]);
    }
    return null;
}

function parseHora(texto) {
    const t = normTexto(texto);
    if (/medio ?dia/.test(t)) return 12;
    const numWords = { una:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12 };

    let m = t.match(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|a\.?m\.?|pm|p\.?m\.?|de la manana|de la tarde|de la noche|h\b)/);
    if (!m) m = t.match(/a las (\d{1,2})(?:[:.](\d{2}))?/) || t.match(/(\d{1,2})(?:[:.](\d{2}))?\s*(?:horas|hrs)/);
    if (m) {
        let h = +m[1], min = m[2] ? +m[2] : 0;
        const suf = m[3] || '';
        if (/p\.?m\.?|tarde|noche/.test(suf)) { if (h < 12) h += 12; }
        else if (/a\.?m\.?|manana/.test(suf)) { if (h === 12) h = 0; }
        else if (h >= 1 && h <= 6) h += 12;
        if (min % 15 !== 0) min = Math.round(min / 30) * 30;
        if (min > 59) { min = 0; h += 1; }
        return h + min / 60;
    }
    for (const [palabra, n] of Object.entries(numWords)) {
        if (new RegExp(`a las ${palabra}\\b`).test(t)) return n >= 1 && n < 7 ? n + 12 : n;
    }
    return null;
}

function parsePersonas(texto) {
    const t = normTexto(texto);
    const words = { una:1,un:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10 };
    let m = t.match(/(?:somos|mesa para|para)\s+(\d{1,2})\s*(?:personas|persona|pax)?/) || t.match(/(\d{1,2})\s*personas/);
    if (m) { const n = +m[1]; if (n >= 1 && n <= 30) return n; }
    for (const [w, n] of Object.entries(words)) {
        if (new RegExp(`(?:somos|para|mesa para) ${w}\\b`).test(t)) return n;
    }
    return null;
}

function formatearHora(hFloat) {
    const h = Math.floor(hFloat), min = Math.round((hFloat - h) * 60);
    const suf = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(min).padStart(2, '0')} ${suf}`;
}

function formatearFecha(d) {
    const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}`;
}

function fechaAKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getOcupacion(fechaKey, horaDecimal) {
    let ocupadas = 0;
    for (const r of testReservas) {
        if (r.fecha !== fechaKey || r.estado === 'Cancelada') continue;
        const parts = r.hora.split(':');
        const rh = +parts[0] + (+parts[1]) / 60;
        if (Math.abs(rh - horaDecimal) < 0.01) ocupadas += r.personas;
    }
    for (const r of chatReservas) {
        if (r.fecha === fechaKey && Math.abs(r.hora - horaDecimal) < 0.01) ocupadas += r.personas;
    }
    return ocupadas;
}

function sugerirHorarios(fecha, personas) {
    const sched = HORARIO_SERVICIO[fecha.getDay()];
    const fechaKey = fechaAKey(fecha);
    const libres = [];
    for (let h = sched.abre; h <= sched.cierra - 1; h += 0.5) {
        const hh = Math.round(h * 100) / 100;
        if (getOcupacion(fechaKey, hh) + personas <= CAPACIDAD_SLOT) libres.push(formatearHora(hh));
    }
    if (libres.length === 0) {
        const manana = new Date(fecha);
        manana.setDate(manana.getDate() + 1);
        return `Ese día ya no tenemos cupos 😔.\n¿Te aparto mesa para el **${formatearFecha(manana)}**?`;
    }
    return `Horarios con disponibilidad ese día:\n🕐 ${libres.slice(0, 6).join(', ')}${libres.length > 6 ? ' …' : ''}`;
}

function checkDisponibilidad(fecha, hora, personas) {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    if (fecha < hoy) return { ok:false, motivo: '⚠️ Esa fecha ya pasó. ¿Quieres reservar desde hoy en adelante?' };
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + 60);
    if (fecha > limite) return { ok:false, motivo: '⚠️ Solo aceptamos reservas con máximo **60 días** de anticipación.' };

    const sched = HORARIO_SERVICIO[fecha.getDay()];
    const ultimaReserva = sched.cierra - 1;

    if (hora === null || isNaN(hora)) return { ok:false, motivo: 'HORA_INVALIDA' };

    if (hora < sched.abre || hora > ultimaReserva) {
        return { ok:false, motivo:
            `🕐 Ese horario no está dentro de nuestro servicio del **${sched.dia}**.\n` +
            `Abrimos de **${formatearHora(sched.abre)}** a **${formatearHora(sched.cierra)}**, y la última reserva es a las **${formatearHora(ultimaReserva)}**.\n\n` +
            sugerirHorarios(fecha, personas) };
    }

    const horaStr = `${String(Math.floor(hora)).padStart(2,'0')}:${Math.round((hora%1)*60) === 30 ? '30' : '00'}`;
    const ocupadas = getOcupacion(fechaAKey(fecha), hora);

    if (ocupadas + personas > CAPACIDAD_SLOT) {
        return { ok:false, motivo:
            `😕 A las **${formatearHora(hora)}** del **${formatearFecha(fecha)}** estamos completos para ${personas} persona${personas>1?'s':''}.\n\n` +
            sugerirHorarios(fecha, personas) };
    }

    const cuposRestantes = CAPACIDAD_SLOT - ocupadas;
    return { ok:true, cupos: cuposRestantes, motivo:
        `✅ ¡Sí hay disponibilidad!\n\n` +
        `📅 ${formatearFecha(fecha).charAt(0).toUpperCase() + formatearFecha(fecha).slice(1)}\n` +
        `🕐 Hora: **${formatearHora(hora)}**\n` +
        `👥 ${personas} persona${personas>1?'s':''}\n` +
        `🪑 Cupos libres en ese horario: ${cuposRestantes}` };
}

function horaAHora24(hFloat) {
    const h = Math.floor(hFloat), min = Math.round((hFloat - h) * 60);
    return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
}

async function guardarReservaChat(data) {
    chatReservas.push(data);
    localStorage.setItem('parrillaChatReservas', JSON.stringify(chatReservas));

    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'reserva',
                origen: 'chatbot-web',
                sessionId: typeof chatSessionId !== 'undefined' ? chatSessionId : null,
                timestamp: new Date().toISOString(),
                datos: {
                    Nombre: data.nombre,
                    Email: data.email || '',
                    Telefono: data.telefono,
                    Fecha: fechaAKey(data.fecha),
                    Hora: horaAHora24(data.hora),
                    Personas: String(data.personas),
                    Ubicacion_Preferida: data.ubicacion || 'Local',
                    Celebracion_Especial: data.celebracion || 'Ninguna',
                    Estado: 'Pendiente'
                }
            })
        });

        if (typeof sendToN8n === 'function' && data.email) {
            await sendToN8n({
                tipo: 'reserva_confirmada',
                reserva: {
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                    fecha: formatearFecha(data.fecha),
                    hora: formatearHora(data.hora),
                    personas: data.personas,
                    ubicacion: data.ubicacion || 'Local',
                    celebracion: data.celebracion || 'Ninguna'
                }
            });
        }
    } catch (e) {
        console.warn('⚠️ n8n reserva:', e.message);
    }
}

// ============ FLUJO CONVERSACIONAL DE RESERVA ============
function preguntarConfirmacion() {
    const d = chatFlow.data;
    const f = formatearFecha(d.fecha);
    return `📋 *Confirma tu reserva:*\n\n` +
        `📅 ${f.charAt(0).toUpperCase() + f.slice(1)}\n` +
        `🕐 ${formatearHora(d.hora)}\n` +
        `👥 ${d.personas} persona${d.personas > 1 ? 's' : ''}\n` +
        `👤 ${d.nombre || '—'}\n` +
        `📱 ${d.telefono || '—'}\n\n` +
        `¿Todo bien? Responde **Sí** para confirmar o **No** para cambiar algo.`;
}

function iniciarFlujoReserva(prefill = {}) {
    chatFlow = { active: true, step: null, data: prefill };

    if (!prefill.fecha) {
        chatFlow.step = 'fecha';
        return '¡Con gusto! 🗓️ Vamos a apartar tu mesa.\n\n📅 ¿Para qué **día** la quieres?';
    }
    const check = checkDisponibilidad(prefill.fecha, null, prefill.personas || 2);
    if (!prefill.hora) {
        chatFlow.step = 'hora';
        return '🕐 ¿A qué **hora**?';
    }
    if (!prefill.personas) {
        chatFlow.step = 'personas';
        return '👥 ¿Cuántas **personas** serán?';
    }
    const disp = checkDisponibilidad(prefill.fecha, prefill.hora, prefill.personas);
    if (!disp.ok) {
        chatFlow.step = 'hora';
        return disp.motivo;
    }
    chatFlow.data.disp = disp;
    chatFlow.step = 'nombre';
    return disp.motivo + '\n\n👤 ¿A nombre de quién dejo la reserva?';
}

function detectarExtrasEnMensaje(texto, data) {
    const t = normTexto(texto);
    if (/\b(terraza|terrazas)\b/.test(t)) data.ubicacion = 'Terraza';
    if (/\b(privad|vip)\b/.test(t)) data.ubicacion = 'Privado';
    if (/\bcumplea(n|ñ)os?\b/.test(t)) data.celebracion = 'Cumpleaños';
    if (/\baniversario\b/.test(t)) data.celebracion = 'Aniversario';
    if (/\b(trabajo|reuni[oó]n|corporativo|empresa)\b/.test(t)) data.celebracion = 'Reunión de trabajo';
    if (/\b(romantic|cena\s+romantic|pareja)\b/.test(t)) data.celebracion = 'Cena romántica';
    if (/\b(familia|familiar)\b/.test(t)) data.celebracion = 'Reunión familiar';
}

async function procesarFlujoReserva(texto) {
    const t = normTexto(texto);
    const d = chatFlow.data;

    detectarExtrasEnMensaje(texto, d);

    if (/\b(cancel|cancelar|olvidalo|mejor no)\b/.test(t)) {
        chatFlow = { active:false, step:null, data:{} };
        return 'Sin problema 🙂. ¿Te ayudo con algo más? Puedes pedirme el menú, horarios o ubicación.';
    }

    switch (chatFlow.step) {
        case 'fecha': {
            const f = parseFecha(texto);
            if (!f) return 'No entendí la fecha 🤔. Prueba con *"viernes"*, *"mañana"* o *"28/09"*.';
            d.fecha = f;
            chatFlow.step = 'hora';
            const sched = HORARIO_SERVICIO[f.getDay()];
            return `Perfecto, **${formatearFecha(f)}** atendemos de ${formatearHora(sched.abre)} a ${formatearHora(sched.cierra)}.\n\n🕐 ¿A qué **hora** quieres la mesa?`;
        }
        case 'hora': {
            const h = parseHora(texto);
            if (h === null) return 'No entendí la hora 🕐. Prueba con *"7pm"*, *"19:00"* o *"1 de la tarde"*.';
            const personas = d.personas || parsePersonas(texto) || 2;
            const disp = checkDisponibilidad(d.fecha, h, personas);
            if (!disp.ok) {
                if (disp.motivo.includes('ya pasó')) { chatFlow.step = 'fecha'; d.fecha = null; return disp.motivo; }
                if (disp.motivo === 'HORA_INVALIDA') return 'Dame una hora válida por favor 🕐 (ej: *7:30 pm*).';
                return disp.motivo;
            }
            d.hora = h;
            d.personas = personas;
            d.disp = disp;
            chatFlow.step = d.personas ? 'nombre' : 'personas';
            if (chatFlow.step === 'personas') return disp.motivo + '\n\n👥 ¿Cuántas **personas** serán?';
            return disp.motivo + '\n\n👤 ¿A nombre de quién dejo la reserva?';
        }
        case 'personas': {
            const p = parsePersonas(texto);
            if (!p) return '¿Cuántas personas son? 👥 (ej: *"4"*)';
            if (p > 20) return 'Para grupos mayores a 20 personas te recomiendo llamarnos al 📞 +57 300 555 0147.';
            d.personas = p;
            const disp = checkDisponibilidad(d.fecha, d.hora, p);
            if (!disp.ok) { chatFlow.step = 'hora'; return disp.motivo; }
            d.disp = disp;
            chatFlow.step = 'nombre';
            return disp.motivo + '\n\n👤 ¿A nombre de quién dejo la reserva?';
        }
        case 'nombre': {
            const nombre = texto.trim().replace(/^(soy|mi nombre es|a nombre de)\s+/i, '').trim();
            if (nombre.length < 3) return 'Dame tu nombre completo por favor 👤.';
            d.nombre = nombre;
            chatFlow.step = 'telefono';
            return `Mucho gusto, **${nombre.split(' ')[0]}**! 📱\n¿Cuál es tu número de **teléfono** para confirmarte?`;
        }
        case 'telefono': {
            const tel = texto.replace(/[^\d+]/g, '');
            if (tel.length < 7) return 'Ese número se ve incompleto 📱. Escríbelo de nuevo (ej: *300 555 0147*).';
            d.telefono = tel;
            chatFlow.step = 'confirmar';
            return preguntarConfirmacion();
        }
        case 'confirmar': {
            if (/\b(si|sí|claro|correcto|ok|perfecto|listo|dale|confirmo|confirma)\b/.test(t)) {
                await guardarReservaChat({
                    nombre: d.nombre,
                    email: d.email || '',
                    telefono: d.telefono,
                    fecha: d.fecha,
                    hora: d.hora,
                    personas: d.personas,
                    ubicacion: d.ubicacion || 'Local',
                    celebracion: d.celebracion || 'Ninguna'
                });
                const ubic = d.ubicacion && d.ubicacion !== 'Local' ? `\n🏠 Sala: **${d.ubicacion}**` : '';
                const celeb = d.celebracion && d.celebracion !== 'Ninguna' ? `\n🎉 Ocasión: **${d.celebracion}**` : '';
                chatFlow = { active:false, step:null, data:{} };
                return `🎉 ¡Listo! Tu reserva quedó confirmada:\n\n📅 **${formatearFecha(d.fecha).charAt(0).toUpperCase() + formatearFecha(d.fecha).slice(1)}**\n🕐 **${formatearHora(d.hora)}**\n👥 **${d.personas}** persona${d.personas>1?'s':''}\n👤 **${d.nombre}**${ubic}${celeb}\n\nTe esperamos en Carrera 38 # 10-47, El Poblado 🔥\nSi necesitas cancelar o cambiar algo, escríbenos con tiempo.`;
            }
            if (/\b(no|cambiar|otro|mal|equivocado)\b/.test(t)) {
                chatFlow = { active:false, step:null, data:{} };
                return 'Ok, empecemos de nuevo 🙂. ¿Qué quieres cambiar? Escribe *"reservar"* cuando quieras intentar otra vez.';
            }
            return '¿Confirmas la reserva? Responde **Sí** o **No**.';
        }
    }
    chatFlow = { active:false, step:null, data:{} };
    return null;
}

async function responderInteligente(mensaje) {
    const t = normTexto(mensaje);

    if (chatFlow.active) {
        const r = await procesarFlujoReserva(mensaje);
        if (r) return r;
    }

    if (/\b(reserv|apart(a|o)|mesa)\b/.test(t) && !/\b(menu|carta|comida|plato)\b/.test(t)) {
        const f = parseFecha(mensaje);
        const h = parseHora(mensaje);
        const p = parsePersonas(mensaje);
        return iniciarFlujoReserva({ fecha: f, hora: h, personas: p });
    }

    if (/\b(disponib|hay (mesa|cup|lugar)|mesas libre|tienen (mesa|lugar|cupos?)|queda (mesa|lugar|cup))\b/.test(t)) {
        const f = parseFecha(mensaje);
        const h = parseHora(mensaje);
        const p = parsePersonas(mensaje) || 2;
        if (!f) return 'Claro! 📅 ¿Para qué **día** quieres saber la disponibilidad?';
        if (h === null) {
            const sched = HORARIO_SERVICIO[f.getDay()];
            return `El **${sched.dia}** atendemos de ${formatearHora(sched.abre)} a ${formatearHora(sched.cierra)}.\n\n${sugerirHorarios(f, p)}\n\n¿Con cuál te quedas?`;
        }
        const disp = checkDisponibilidad(f, h, p);
        if (disp.motivo === 'HORA_INVALIDA') return 'Dame una hora válida por favor 🕐 (ej: *7:30 pm*).';
        return disp.motivo + (disp.ok ? '\n\n¿Quieres que te la aparte? Solo dime *"reservar"*.' : '');
    }

    if (/\b(horario|atienden|abren|cierran|abierto|cerrado|hora de atencion)\b/.test(t)) {
        return '🕐 *Nuestros horarios:*\n\n' +
            'Lun–Mié: 12:00 – 9:30 pm\n' +
            'Jueves: 12:00 – 10:00 pm\n' +
            'Vie–Sáb: 12:00 – 11:00 pm\n' +
            'Domingo: 12:00 – 8:30 pm\n\n' +
            'Atendemos los 7 días de la semana 🔥';
    }

    if (/\b(ubicac|donde estan|direccion|como llego|encuentro)\b/.test(t)) {
        return '📍 Estamos en *Carrera 38 # 10-47, Local 102*, El Poblado, Medellín.\n\n🅿️ Tenemos parqueadero propio y estamos a 5 min del Metro Poblado.';
    }

    if (/\b(menu|carta|que tienen para comer|platos|comida|parrilla)\b/.test(t)) {
        return '🔥 *Lo más pedido de nuestra parrilla:*\n\n' +
            '🥩 Corte del Parrillero — $49.900\n' +
            '🌭 Chorizo Argentino — $28.900\n' +
            '🍖 Costilla del Fuego — $44.900\n' +
            '🍽️ Picada del Parrillero (para compartir) — $89.900\n' +
            '🧀 Provoleta a la Parrilla — $24.900\n\n' +
            'También tenemos licores, vinos y postres artesanales.\nPuedes ver la carta completa arriba en la sección *Menú* 😉';
    }

    if (/\b(pedido|domicilio|delivery|llevar|recoger)\b/.test(t)) {
        return '🛵 ¡Claro! Haz tu pedido desde el botón *Pedir* en cualquier plato del menú.\n\nDomicilios en Medellín hasta las 10:30 pm. También puedes recoger en el local.';
    }

    return null;
}
