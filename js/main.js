function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

const MAX_PHOTOS = 3;
// FormSubmit accepts at most 10 MB of attachments in total; phone photos are
// often 3-6 MB each, so every photo is scaled down before it is sent.
const PHOTO_MAX_SIDE = 1600;
const PHOTO_QUALITY = 0.8;

function resizePhoto(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', PHOTO_QUALITY);
    };
    // Formats the browser can't draw (e.g. HEIC on some devices) are sent as they are.
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

// Copy of the request (without name/e-mail/phone) for the private UP dashboard. Never blocks the form.
const LEAD_URL = 'https://up-collector.up-dashboard.workers.dev/lead';

function sendLeadCopy(form, services, extras) {
  try {
    const kind = form.querySelector('input[name="klanttype"]:checked')?.value === 'Particulier' ? 'particulier' : 'bedrijf';
    fetch(LEAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        page: location.pathname,
        services: services.join(', '),
        extras: extras.join(', '),
        postcode: form.querySelector('#postcode')?.value || '',
        kind,
        _honeypot: form.querySelector('input[name="_honeypot"]')?.value || '',
      }),
    }).catch(() => {});
  } catch (e) { /* the dashboard copy is optional */ }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  const photoInput = form.querySelector('#fotos');
  const photoStatus = form.querySelector('#fotos-status');
  const companyField = form.querySelector('#bedrijf-veld');
  const submitButton = form.querySelector('button[type="submit"]');

  form.querySelectorAll('input[name="klanttype"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      companyField.hidden = form.querySelector('input[name="klanttype"]:checked').value === 'Particulier';
    });
  });

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const count = photoInput.files.length;
      if (count > MAX_PHOTOS) {
        photoStatus.textContent = `Je koos ${count} foto's. We sturen de eerste ${MAX_PHOTOS} mee.`;
      } else {
        photoStatus.textContent = count ? `${count} foto${count > 1 ? "'s" : ''} gekozen.` : '';
      }
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.className = '';

    const services = [...form.querySelectorAll('input[name="dienst"]:checked')].map((box) => box.value);
    const email = form.querySelector('#email').value;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let problem = '';
    if (!services.length) problem = 'Kies wat we mogen reinigen.';
    else if (!form.checkValidity() || !emailValid) problem = 'Vul je naam, postcode (4 cijfers) en een geldig e-mailadres in.';
    if (problem) {
      status.textContent = problem;
      status.className = 'error';
      return;
    }

    const data = new FormData(form);
    // Checkboxes with the same name would arrive as separate fields, so join them into one line.
    data.delete('dienst');
    data.delete('extra');
    data.set('diensten', services.join(', '));
    const extras = [...form.querySelectorAll('input[name="extra"]:checked')].map((box) => box.value);
    if (extras.length) data.set('extra', extras.join(', '));

    submitButton.disabled = true;
    status.textContent = 'Bezig met versturen...';

    try {
      const photos = photoInput ? [...photoInput.files].slice(0, MAX_PHOTOS) : [];
      const resized = await Promise.all(photos.map(resizePhoto));
      resized.forEach((blob, i) => data.append(`foto${i + 1}`, blob, `foto${i + 1}.jpg`));

      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = 'Bedankt! We bekijken je aanvraag en sturen je zo snel mogelijk een prijs.';
        status.className = 'success';
        sendLeadCopy(form, services, extras);
        form.reset();
        companyField.hidden = true;
        if (photoStatus) photoStatus.textContent = '';
      } else {
        status.textContent = 'Er ging iets mis bij het versturen. Probeer het opnieuw of stuur ons een WhatsApp.';
        status.className = 'error';
      }
    } catch (err) {
      status.textContent = 'Er ging iets mis bij het versturen. Probeer het opnieuw of stuur ons een WhatsApp.';
      status.className = 'error';
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initContactForm();
});
