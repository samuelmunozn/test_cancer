// Función serverless de Vercel: recibe las respuestas y las envía por correo con Resend.
const CLAVE = [0, 1, 2]; // Respuestas correctas: 1-A, 2-B, 3-C
const L = ['A', 'B', 'C'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Método no permitido' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const nombre = String(b.nombre || '').trim().slice(0, 150);
  const fecha = String(b.fecha || '').trim().slice(0, 20);
  const obs = String(b.obs || '').trim().slice(0, 1000);
  const ans = Array.isArray(b.ans) ? b.ans.slice(0, 3) : [];

  if (!nombre || !fecha || ans.length !== 3 || !ans.every((a) => [0, 1, 2].includes(a))) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos' });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.TO_EMAIL || 'janethangelicanarvaezfigueroa@gmail.com';
  const from = process.env.FROM_EMAIL || 'Post test Prevención del Cáncer <onboarding@resend.dev>';
  if (!key) return res.status(500).json({ ok: false, error: 'Falta RESEND_API_KEY en Vercel' });

  const score = ans.filter((a, i) => a === CLAVE[i]).length;
  const filas = ans
    .map((a, i) => `Pregunta ${i + 1}: ${L[a]} ${a === CLAVE[i] ? '(correcta)' : `(incorrecta, correcta: ${L[CLAVE[i]]})`}`)
    .join('\n');
  const text = `POSTTEST - Prevención del cáncer\n\nNombre: ${nombre}\nFecha: ${fecha}\nPuntaje: ${score}/3\n\n${filas}\n\nObservaciones: ${obs || '-'}`;
  const html = `<h2>Pretest · Prevención del cáncer</h2><p><b>Nombre:</b> ${esc(nombre)}<br><b>Fecha:</b> ${esc(fecha)}<br><b>Puntaje:</b> ${score}/3</p><pre>${esc(filas)}</pre><p><b>Observaciones:</b> ${esc(obs || '-')}</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject: `Pretest cáncer - ${nombre} (${score}/3)`, text, html }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'Error del servicio de correo', detail: await r.text() });
    return res.status(200).json({ ok: true, score });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el correo' });
  }
}
