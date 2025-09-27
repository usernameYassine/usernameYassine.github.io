/* script.js — interactions: project injection, filtering, modal, theme, copy email */
const projects = [
  {
    id: 'p1',
    title: 'Conversion PDF → HTML (Formulaire obsèques)',
    desc: 'Conversion complète de formulaires PDF en HTML accessible et responsive.',
    tags: ['frontend'],
    thumb: 'assets/project-pdf-html.jpg',
    link: '#'
  },
  {
    id: 'p2',
    title: 'Call Tracking (Nimbata) & SEA',
    desc: 'Intégration du call-tracking Nimbata et configuration campagne SEA.',
    tags: ['automation'],
    thumb: 'assets/project-nimbata.jpg',
    link: '#'
  },
  {
    id: 'p3',
    title: 'Script open-source: notifications Slack depuis DB',
    desc: 'Version pédagogique d’un script pro pour envoyer des notifs Slack quand la DB change.',
    tags: ['automation'],
    thumb: 'assets/project-slack-script.jpg',
    link: '#'
  },
  {
    id: 'p4',
    title: 'CGV → HTML structuré (secteur funéraire)',
    desc: 'Conversion intégrale des conditions générales en HTML compact avec bloc annulation centré.',
    tags: ['frontend'],
    thumb: 'assets/project-cgv.jpg',
    link: '#'
  },
  {
    id: 'p5',
    title: 'Plugins & Blocs WordPress',
    desc: 'Création de blocs personnalisés, adaptation CSS/JS pour pages WordPress.',
    tags: ['wordpress'],
    thumb: 'assets/project-wp.jpg',
    link: '#'
  },
  {
    id: 'p6',
    title: 'Infra & Automation AWS (Route53, S3)',
    desc: 'Configuration DNS complète, stockage S3 pour assets et usages de déploiement.',
    tags: ['automation'],
    thumb: 'assets/project-aws.jpg',
    link: '#'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // inject stats
  document.getElementById('stat-projects').textContent = projects.length;
  document.getElementById('year').textContent = new Date().getFullYear();

  // projects grid
  const tpl = document.getElementById('projectTpl');
  const grid = document.getElementById('projectsGrid');
  projects.forEach(p => {
    const node = tpl.content.cloneNode(true);
    const article = node.querySelector('article');
    article.dataset.tags = p.tags.join(' ');
    node.querySelector('.project-thumb').src = p.thumb;
    node.querySelector('.project-thumb').alt = p.title;
    node.querySelector('.project-title').textContent = p.title;
    node.querySelector('.project-desc').textContent = p.desc;
    node.querySelector('.project-actions .view').dataset.id = p.id;
    node.querySelector('.project-actions a').href = p.link;
    grid.appendChild(node);
  });

  // filter buttons
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });

  // view modal
  grid.addEventListener('click', e => {
    if (e.target.classList.contains('view')) {
      const id = e.target.dataset.id;
      const p = projects.find(x=>x.id===id);
      openModal(`<h2>${p.title}</h2><p>${p.desc}</p><p><strong>Tags:</strong> ${p.tags.join(', ')}</p>`);
    }
  });

  // modal close
  const modal = document.getElementById('modal');
  modal.querySelector('.close').addEventListener('click', () => closeModal());
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // copy email
  document.getElementById('copyEmail').addEventListener('click', async () => {
    const txt = document.getElementById('emailText').textContent.trim();
    try {
      await navigator.clipboard.writeText(txt);
      flash('Email copié');
    } catch (err) {
      flash('Impossible de copier');
    }
  });

  // theme toggle
  const toggle = document.getElementById('themeToggle');
  const userPref = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(userPref);
  toggle.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // simple mobile menu
  document.querySelector('.menu-toggle').addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
  });

  // timeline (experiences) injection from known data
  const timeline = document.getElementById('timeline');
  const experiences = [
    {
      company: 'Simplifia',
      period: '2022 — présent',
      role: 'Missions diverses : intégration, variables Jinja2, DEP Jira, automation',
      details: [
        'Travail sur templates dynamiques avec Jinja2',
        'Participation à DEP via Jira',
        'Automatisations et scripts, cron jobs'
      ]
    },
    {
      company: 'Freelance / Projets',
      period: '2018 — 2022',
      role: 'Conversion documents, WordPress, call-tracking and SEA',
      details: [
        'Conversion CGV et formulaires PDF en HTML',
        'Intégration Nimbata (call-tracking)',
        'Blocs WordPress & CSS/JS sur-mesure'
      ]
    }
  ];
  experiences.forEach(exp => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `<h3>${exp.company} <small>${exp.period}</small></h3><p><em>${exp.role}</em></p><ul>${exp.details.map(d=>`<li>${d}</li>`).join('')}</ul>`;
    timeline.appendChild(el);
  });
});

function filterProjects(filter){
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(c => {
    const tags = c.dataset.tags.split(' ');
    if (filter === 'all' || tags.includes(filter)) {
      c.style.display = '';
    } else {
      c.style.display = 'none';
    }
  });
}

function openModal(html){
  const modal = document.getElementById('modal');
  modal.querySelector('#modalContent').innerHTML = html;
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden','true');
}

// small flash notification
function flash(message){
  const el = document.createElement('div');
  el.textContent = message;
  el.style.position='fixed';el.style.right='20px';el.style.bottom='20px';
  el.style.background='var(--card)';el.style.padding='10px 12px';el.style.borderRadius='8px';
  el.style.boxShadow='0 8px 24px rgba(2,6,23,0.2)';document.body.appendChild(el);
  setTimeout(()=>el.remove(),2000);
}

function setTheme(mode){
  if (mode==='dark') {
    document.documentElement.dataset.theme = 'dark';
    localStorage.setItem('theme','dark');
  } else {
    document.documentElement.dataset.theme = 'light';
    localStorage.setItem('theme','light');
  }
}
