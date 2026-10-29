// ==========================================
// 1. FORM VALIDATION
// ==========================================
const form = document.getElementById('signup'); // Corrected function name

if (form) {
  const validators = {
    name(v) {
      v = v.trim();
      if (!v) return 'Name is required.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(v)) return 'Name can only contain letters, spaces, apostrophes, dots and hyphens.';
      return '';
    },
    email(v) {
      v = v.trim();
      if (!v) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email address.';
      return '';
    },
    phone(v) {
      v = v.trim();
      if (!v) return 'Phone number is required.';
      if (!/^\+?[\d\s()-]+$/.test(v)) return 'Use only digits, spaces, dashes, parentheses and an optional leading +.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) return 'Phone number must have 8 to 15 digits.';
      return '';
    },
    country(v) {
      return v ? '' : 'Please select a country.';
    },
    password(v) {
      if (!v) return 'Password is required.';
      if (v.length < 8) return 'Password must be at least 8 characters.';
      if (!/[a-z]/.test(v)) return 'Include at least one lowercase letter.';
      if (!/[A-Z]/.test(v)) return 'Include at least one uppercase letter.';
      if (!/\d/.test(v)) return 'Include at least one number.';
      if (!/[^A-Za-z0-9]/.test(v)) return 'Include at least one special character.';
      return '';
    },
    confirm(v) {
      if (!v) return 'Please confirm your password.';
      if (v !== form.password.value) return 'Passwords do not match.';
      return '';
    },
    terms(_, input) {
      return input.checked ? '' : 'You must accept the terms.';
    }
  };

  function validateField(input) {
    const check = validators[input.name];
    if (!check) return true;
    const message = check(input.value, input);
    input.setCustomValidity(message); 
    const errorEl = document.getElementById(input.id + '-error');
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  const fields = [...form.elements].filter(el => validators[el.name]);

  fields.forEach(input => {
    input.addEventListener('blur', () => validateField(input));

    const live = () => {
      if (input.hasAttribute('aria-invalid')) validateField(input);
      if (input.name === 'password' && form.confirm && form.confirm.hasAttribute('aria-invalid')) {
        validateField(form.confirm);
      }
    };
    input.addEventListener('input', live);
    input.addEventListener('change', live);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const results = fields.map(validateField);
    if (results.every(Boolean)) {
      const data = Object.fromEntries(new FormData(form));
      delete data.password; delete data.confirm; 
      console.log('Valid, submitting:', data);
      const successEl = document.getElementById('success');
      if (successEl) successEl.textContent = 'Thank you! Your form is valid and submitted.';
    } else {
      const invalidField = fields.find(f => f.getAttribute('aria-invalid') === 'true');
      if (invalidField) invalidField.focus();
    }
  });
}


// ==========================================
// 2. GALLERY LIGHTBOX FUNCTIONALITY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Find all images inside gallery containers
  const galleryImages = document.querySelectorAll('.gallery-img-container img');

  // Create modal markup dynamically
  const modalHTML = `
    <div class="modal fade" id="galleryLightboxModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark border-0">
          <div class="modal-header border-0 pb-0">
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-3">
            <img id="lightboxImage" src="" class="img-fluid rounded shadow" alt="Enlarged View">
          </div>
        </div>
      </div>
    </div>
  `;

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const lightboxModalElement = document.getElementById('galleryLightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const bsModal = new bootstrap.Modal(lightboxModalElement);

  // Attach click listeners to gallery images
  galleryImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || 'Gallery View';
      bsModal.show();
    });
  });
});