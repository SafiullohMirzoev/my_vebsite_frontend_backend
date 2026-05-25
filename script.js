const form = document.getElementById('leadForm');
const statusEl = document.getElementById('status');

let appConfig = {
  adminUsername: 'safiyulloh_dev',
  whatsappNumber: '992990906023',
  phoneNumber: '992711822211'
};

function setLinks() {
  const tg = https://t.me/${appConfig.adminUsername};
  const wa = https://wa.me/${appConfig.whatsappNumber};

  ['tgTop','tgBottom'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = tg;
  });

  ['waTop','waHero','waBottom'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = wa;
  });

  const contacts = document.getElementById('contacts');
  if (contacts) {
    contacts.textContent = Telegram: @${appConfig.adminUsername} • WhatsApp: +${appConfig.whatsappNumber} • Тел: +${appConfig.phoneNumber};
  }
}

document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.package && form) {
      form.packageName.value = btn.dataset.package;
    }
    document.getElementById('request').scrollIntoView({ behavior: 'smooth' });
  });
});

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.className = '';
    statusEl.textContent = 'Отправляем заявку...';

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('https://ustoyor-backend.onrender.com/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok || !json.ok) throw new Error('Ошибка');

      statusEl.className = 'ok';
      statusEl.textContent = 'Спасибо! Заявка отправлена.';
      form.reset();
    } catch {
      statusEl.className = 'err';
      statusEl.textContent = 'Ошибка отправки. Напишите напрямую в Telegram или WhatsApp.';
    }
  });
}

setLinks();
