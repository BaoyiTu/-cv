const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeLabel = document.querySelector('.theme-label');
const savedTheme = localStorage.getItem('resume-theme');
const resumeData = window.resumeData || {};

function renderNav() {
  const nav = document.querySelector('#main-nav');
  if (!nav || !resumeData.site?.nav) return;

  nav.innerHTML = resumeData.site.nav
    .map(
      (item) => `
        <a class="nav-link ${item.active ? 'active' : ''}" href="${item.href}">${item.label}</a>
      `
    )
    .join('');
}

function renderHero() {
  const headline = document.querySelector('#hero-headline');
  const intro = document.querySelector('#hero-intro');

  if (headline) headline.innerHTML = resumeData.hero?.headline || '';
  if (intro) intro.textContent = resumeData.hero?.intro || '';
}

function renderStats() {
  const statsWrap = document.querySelector('#stats-strip');
  if (!statsWrap || !resumeData.stats) return;

  statsWrap.innerHTML = resumeData.stats
    .map(
      (item) => `
        <div>
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `
    )
    .join('');
}

function renderExperience() {
  const experienceList = document.querySelector('#experience-list');
  if (!experienceList || !resumeData.experience) return;

  experienceList.innerHTML = resumeData.experience
    .map(
      (item) => `
        <article class="timeline-item reveal">
          <div class="timeline-date">${item.date}</div>
          <div class="timeline-marker"></div>
          <div class="timeline-card">
            <p class="role-type">${item.type}</p>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="tag-row">
              ${item.tags.map((tag) => `<span>${tag}</span>`).join('')}
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function renderSkills() {
  const intro = document.querySelector('#skills-intro');
  const skillsList = document.querySelector('#skills-list');

  if (intro) intro.textContent = resumeData.skills?.intro || '';
  if (!skillsList || !resumeData.skills?.items) return;

  skillsList.innerHTML = resumeData.skills.items
    .map(
      (skill) => `
        <div class="skill-row">
          <div class="skill-meta">
            <strong>${skill.name}</strong>
            <span>${skill.value}%</span>
          </div>
          <div class="progress-track">
            <span style="--progress: ${skill.value}%"></span>
          </div>
        </div>
      `
    )
    .join('');
}

function renderProjects() {
  const projectGrid = document.querySelector('#project-grid');
  if (!projectGrid || !resumeData.projects) return;

  projectGrid.innerHTML = resumeData.projects
    .map(
      (project, index) => {
        const visualMap = {
          research: '<span class="project-index">01 / RESEARCH</span><div class="visual-chart"><i></i><i></i><i></i><i></i><i></i></div><span class="visual-label">EXPORT<br />COMPETITIVENESS</span>',
          legal: '<span class="project-index">02 / LEGAL OPS</span><div class="visual-browser"><div></div><div></div><div></div></div><span class="visual-label">CROSS-BORDER<br />DOCUMENTS</span>',
          field: '<span class="project-index">03 / FIELDWORK</span><div class="visual-lines"><i></i><i></i><i></i><i></i></div><span class="visual-label">ASSET<br />PRESERVATION</span>'
        };

        const visualClassMap = {
          research: 'visual-red',
          legal: 'visual-dark',
          field: 'visual-paper'
        };

        const projectIndex = String(index + 1).padStart(2, '0');
        const visualHtml = visualMap[project.visual] || visualMap.research;
        const visualClass = visualClassMap[project.visual] || 'visual-red';

        return `
          <article class="project-card ${index === 0 ? 'project-card-featured' : ''} reveal" data-project="${project.id}" tabindex="0" role="button" aria-expanded="false">
            <div class="project-visual ${visualClass}">
              ${visualHtml.replace('01 / RESEARCH', `${projectIndex} / ${project.visual.toUpperCase()}`)}
            </div>
            <div class="project-info">
              <div>
                <p class="project-kicker">${project.kicker}</p>
                <h3>${project.title}</h3>
              </div>
              <span class="expand-icon">↗</span>
            </div>
            <div class="project-detail">
              <p>${project.detail}</p>
              <div class="tag-row">
                ${project.tags.map((tag) => `<span>${tag}</span>`).join('')}
              </div>
            </div>
          </article>
        `;
      }
    )
    .join('');
}

function renderContact() {
  const heading = document.querySelector('#contact-heading');
  const contactLinks = document.querySelector('#contact-links');

  if (heading) heading.innerHTML = resumeData.contact?.heading || '';
  if (!contactLinks || !resumeData.contact) return;

  contactLinks.innerHTML = `
    <p>${resumeData.contact.description}</p>
    ${resumeData.contact.links
      .map(
        (link) => `
          <a href="${link.href}" class="contact-link">${link.label} <span>↗</span></a>
        `
      )
      .join('')}
    <div class="social-links">
      ${resumeData.contact.socials.map((social) => `<a href="#contact">${social}</a>`).join('')}
    </div>
  `;
}

function setTheme(isDark) {
  body.classList.toggle('dark', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换深色模式');
  themeIcon.textContent = isDark ? '☾' : '☼';
  themeLabel.textContent = isDark ? '浅色模式' : '深色模式';
}

function initTheme() {
  if (!themeToggle || !themeIcon || !themeLabel) return;
  setTheme(savedTheme === 'dark');
  themeToggle.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark');
    setTheme(isDark);
    localStorage.setItem('resume-theme', isDark ? 'dark' : 'light');
  });
}

function initRevealObserver() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        skillsSection.classList.add('in-view');
        skillsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
  }
}

function initProjectCards() {
  document.querySelectorAll('.project-card').forEach((card) => {
    const toggleProject = () => {
      const expanded = card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', String(expanded));
    };
    card.addEventListener('click', toggleProject);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleProject();
      }
    });
  });
}

function initNavObserver() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach((section) => navObserver.observe(section));
}

function bootstrap() {
  renderNav();
  renderHero();
  renderStats();
  renderExperience();
  renderSkills();
  renderProjects();
  renderContact();
  initTheme();
  initRevealObserver();
  initProjectCards();
  initNavObserver();
}

bootstrap();