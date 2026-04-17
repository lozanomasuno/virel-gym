<template>
  <footer id="contacto" class="footer">
    <div class="container footer__inner">
      <!-- Brand column -->
      <div class="footer__brand">
        <img src="@/assets/logo.svg" alt="Virel" class="footer__logo" />
        <p class="footer__tagline">
          Un espacio diseñado para el bienestar de todas las personas.
        </p>
        <div class="footer__social">
          <a href="#" aria-label="Instagram" class="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" aria-label="Facebook" class="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" class="social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </div>

      <!-- Links columns -->
      <div class="footer__links-group">
        <div class="footer__col">
          <h4 class="footer__col-title">Secciones</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#clases">Clases</a></li>
            <li><a href="#membresias">Membresías</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__col-title">Clases</h4>
          <ul>
            <li><a href="#clases">Pilates</a></li>
            <li><a href="#clases">Fuerza</a></li>
            <li><a href="#clases">Movilidad</a></li>
            <li><a href="#clases">Danza</a></li>
            <li><a href="#clases">Adulto Mayor</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__col-title">Contacto</h4>
          <ul class="footer__contact">
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Calle del Bienestar 42, Ciudad
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              hola@virel.co
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <p class="footer__copy">© 2026 Virel. Todos los derechos reservados.</p>
        <div class="footer__legal">
          <a href="#">Política de privacidad</a>
          <a href="#">Términos de uso</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: var(--color-dark);
  color: rgba(255, 255, 255, 0.75);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1.4fr 2fr;
  gap: 4rem;
  padding-top: 72px;
  padding-bottom: 56px;
}

.footer__logo {
  height: 34px;
  width: auto;
  margin-bottom: 1rem;
  filter: brightness(0) invert(1);
}

.footer__tagline {
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 260px;
}

.footer__social {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.social-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.footer__links-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer__col-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
}

.footer__col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer__col ul a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.footer__col ul a:hover {
  color: var(--color-primary);
}

.footer__contact {
  gap: 0.75rem !important;
}

.footer__contact li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

.footer__contact li svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-primary);
}

/* Bottom bar */
.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer__bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer__copy {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer__legal {
  display: flex;
  gap: 1.5rem;
}

.footer__legal a {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  transition: var(--transition);
}

.footer__legal a:hover {
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 900px) {
  .footer__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding-top: 56px;
  }

  .footer__links-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .footer__links-group {
    grid-template-columns: 1fr;
  }

  .footer__bottom-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
