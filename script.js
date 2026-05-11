const form = document.getElementById('leadForm');
const statusEl = document.getElementById('status');
let appConfig = { botUsername: 'ustoyor_service_bot', adminUsername: 'safiyulloh_dev', whatsappNumber: '992990906023', phoneNumber: '992711822211' };

async function loadConfig(){
  try { appConfig = await (await fetch('/api/config')).json(); } catch(e) {}
  const tg = `https://t.me/${appConfig.adminUsername}`;
  const wa = `https://wa.me/${appConfig.whatsappNumber}`;
  ['tgTop'].forEach(id => document.getElementById(id).href = tg);
  ['waTop','waHero'].forEach(id => document.getElementById(id).href = wa);
  document.getElementById('contacts').textContent = ` Telegram: @${appConfig.adminUsername} • WhatsApp: +${appConfig.whatsappNumber} • Тел: +${appConfig.phoneNumber}`;
}

document.querySelectorAll('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
  if (btn.dataset.package) form.packageName.value = btn.dataset.package;
  document.getElementById('request').scrollIntoView({behavior:'smooth'});
}));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.className = '';
  statusEl.textContent = 'Отправляем заявку...';
  const data = Object.fromEntries(new FormData(form).entries());
  try {
   const res = await fetch('https://ustoyor-backend.onrender.com/api/lead', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const json = await res.json();
    if(!res.ok || !json.ok) throw new Error(json.message || 'Ошибка');
    statusEl.className = 'ok';
    statusEl.textContent = 'Спасибо! Заявка отправлена в Telegram-бот.';
    form.reset();
  } catch(err) {
    statusEl.className = 'err';
    statusEl.textContent = 'Ошибка отправки. Напишите напрямую в WhatsApp или Telegram.';
  }
});

loadConfig();

