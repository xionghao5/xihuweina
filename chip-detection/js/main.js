/* ==========================================
   芯卫纳 主 JavaScript 文件
   ========================================== */

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

/* ---- Hamburger menu ---- */
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('active');
}

/* ---- Smooth scroll ---- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* Nav link click */
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      scrollToSection(href.slice(1));
      // Close mobile menu
      document.getElementById('navLinks').classList.remove('open');
    }
  });
});

/* ---- Active nav highlight ---- */
function updateActiveNav() {
  const sections = ['home', 'devices', 'specs', 'about', 'contact'];
  const scrollY = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-item[href="#${id}"]`);
    if (!el || !link) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* ==========================================
   PARTICLE CANVAS
   ========================================== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#00d4ff' : '#7b2fff';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initParts() {
    particles = [];
    const count = Math.floor((W * H) / 8000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawLines() {
    const dist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < dist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / dist) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  initParts();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParts();
  });
})();

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.closest('.stat-item').dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = (isDecimal ? val.toFixed(2) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ==========================================
   DEVICE FILTER
   ========================================== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.device-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ==========================================
   SPEC TABS
   ========================================== */
document.querySelectorAll('.spec-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.spec-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.spec-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ==========================================
   CAPABILITY BAR ANIMATION
   ========================================== */
function animateBars() {
  document.querySelectorAll('.cap-fill').forEach(el => {
    const w = el.dataset.width;
    el.style.width = w + '%';
  });
}

/* ==========================================
   RADAR CHART (Canvas)
   ========================================== */
function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const R = Math.min(cx, cy) - 40;
  const labels = ['检测精度', '处理速度', 'AI智能', '自动化', '可靠性', '兼容性'];
  const values = [0.998, 0.94, 0.97, 0.96, 0.985, 0.92];
  const n = labels.length;
  const angles = labels.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid rings
  [0.2, 0.4, 0.6, 0.8, 1.0].forEach(scale => {
    ctx.beginPath();
    angles.forEach((a, i) => {
      const x = cx + R * scale * Math.cos(a);
      const y = cy + R * scale * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,212,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Draw axes
  angles.forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.strokeStyle = 'rgba(0,212,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Animate data polygon
  let progress = 0;
  function animateRadar() {
    progress = Math.min(progress + 0.025, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Re-draw grid
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(scale => {
      ctx.beginPath();
      angles.forEach((a, i) => {
        const x = cx + R * scale * Math.cos(a);
        const y = cy + R * scale * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,212,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    angles.forEach(a => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Data polygon
    ctx.beginPath();
    angles.forEach((a, i) => {
      const r = R * values[i] * eased;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(0,212,255,0.25)');
    grad.addColorStop(1, 'rgba(123,47,255,0.15)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,212,255,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    angles.forEach((a, i) => {
      const r = R * values[i] * eased;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    if (progress < 1) requestAnimationFrame(animateRadar);
  }
  requestAnimationFrame(animateRadar);
}

/* ==========================================
   INTERSECTION OBSERVER - Reveal animations
   ========================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger special animations
      if (entry.target.closest('#home') || entry.target.id === 'home') {
        animateCounters();
      }
    }
  });
}, { threshold: 0.15 });

// Observe elements
document.querySelectorAll('.device-card, .highlight-item, .contact-card, .tl-item').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Special observers for stats and bars
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

const barsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateBars();
      drawRadar();
      barsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const specVis = document.querySelector('.specs-visual');
if (specVis) barsObserver.observe(specVis);

/* ==========================================
   DEVICE DETAIL MODAL
   ========================================== */
const deviceDetails = {
  aoi9800: {
    name: 'AOI-9800 全自动光学检测仪',
    badge: '光学检测',
    badgeClass: 'badge-optical',
    desc: 'AOI-9800采用自研双波段UV光学系统，配合第五代深度学习算法，实现对晶圆表面及封装引脚的纳米级缺陷检测。支持8/12英寸晶圆全自动上下片，可集成至现有MES系统。',
    specs: [
      { key: '检测分辨率', val: '0.3 μm' },
      { key: '扫描速度', val: '300片/小时' },
      { key: '检出率', val: '>99.98%' },
      { key: '误报率', val: '<0.02%' },
      { key: '成像幅面', val: '300×300 mm' },
      { key: '光源类型', val: 'UV 365/405nm' },
    ]
  },
  etsx6: {
    name: 'ETS-X6 极速电性测试平台',
    badge: '电学测试',
    badgeClass: 'badge-electrical',
    desc: 'ETS-X6是业界首款支持64路真并行测试通道的SoC测试平台，全面兼容RF射频、模拟信号及数字逻辑混合测试，显著降低测试成本并提升产能利用率。',
    specs: [
      { key: '测试通道', val: '64路并行' },
      { key: '信号频率', val: 'DC~5GHz' },
      { key: '时序精度', val: '10ps' },
      { key: '测试覆盖率', val: '>99.9%' },
      { key: '换型时间', val: '<15min' },
      { key: 'MTBF', val: '>10,000h' },
    ]
  },
  xri3d: {
    name: 'XRI-3D 三维X射线检测系统',
    badge: 'X射线',
    badgeClass: 'badge-xray',
    desc: 'XRI-3D运用锥束X射线层析成像技术，可对BGA、CSP、QFN等封装形式进行全方位三维扫描，精准识别内部焊点空洞、桥接等缺陷，无损检测，零破坏。',
    specs: [
      { key: '成像分辨率', val: '1 μm' },
      { key: '成像方式', val: '3D层析' },
      { key: '缺陷识别率', val: '>98%' },
      { key: '扫描范围', val: '300×300mm' },
      { key: 'X射线能量', val: '30~160 kV' },
      { key: '辐射防护', val: 'X级屏蔽' },
    ]
  },
  visionai: {
    name: 'VisionAI-Pro 智能视觉检测站',
    badge: 'AI视觉',
    badgeClass: 'badge-ai',
    desc: 'VisionAI-Pro内置自研DeepChip™神经网络模型，搭载工业级4K高速相机与多光谱光源，可实时处理图像流并对100+种芯片缺陷类型进行智能分类与定位，支持持续自学习优化。',
    specs: [
      { key: 'AI模型精度', val: 'mAP>97.5%' },
      { key: '图像分辨率', val: '4K@120fps' },
      { key: '缺陷分类', val: '100+种' },
      { key: '推理延迟', val: '<5ms/帧' },
      { key: '存储容量', val: '100TB' },
      { key: '自学习', val: '在线更新' },
    ]
  },
  semultra: {
    name: 'SEM-Ultra 超高分辨率扫描电镜',
    badge: '光学检测',
    badgeClass: 'badge-optical',
    desc: 'SEM-Ultra采用场发射电子枪，分辨率达0.8nm，支持BSE/SE/EDS多模式成像与元素分析，适用于先进制程节点（3nm/5nm）的工艺失效分析及缺陷根因定位。',
    specs: [
      { key: '分辨率', val: '0.8nm' },
      { key: '加速电压', val: '0.1~30kV' },
      { key: '成像模式', val: 'SE/BSE/EDS' },
      { key: '放大倍率', val: '10x~1,000,000x' },
      { key: '工作距离', val: '1~40mm' },
      { key: '样品台', val: '5轴驱动' },
    ]
  },
  thermoscan: {
    name: 'ThermoScan-9 动态热成像测试仪',
    badge: '电学测试',
    badgeClass: 'badge-electrical',
    desc: 'ThermoScan-9集成高灵敏红外焦平面阵列，热分辨率高达±0.05°C，实时动态显示芯片工作状态下的热分布图，自动识别热点、热失控区域，为可靠性验证提供全面数据支撑。',
    specs: [
      { key: '热精度', val: '±0.05°C' },
      { key: '帧率', val: '200Hz' },
      { key: '像素分辨率', val: '640×512' },
      { key: '温度范围', val: '-20~300°C' },
      { key: '测量距离', val: '5~100mm' },
      { key: '接口', val: 'GigE/USB3.0' },
    ]
  }
};

function showDeviceDetail(id) {
  const data = deviceDetails[id];
  if (!data) return;
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <h2>${data.name}</h2>
    <span class="modal-badge ${data.badgeClass}">${data.badge}</span>
    <p>${data.desc}</p>
    <h4 style="margin-bottom:16px;color:var(--text-secondary);font-size:0.85rem;text-transform:uppercase;letter-spacing:1px;">核心参数</h4>
    <div class="modal-spec-grid">
      ${data.specs.map(s => `
        <div class="modal-spec-item">
          <div class="spec-key">${s.key}</div>
          <div class="spec-value">${s.val}</div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:24px;">
      <button class="btn-primary" style="width:100%;justify-content:center;display:flex;align-items:center;gap:8px;" onclick="closeModal();scrollToSection('contact')">
        <i class="fas fa-envelope"></i> 咨询这款产品
      </button>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ==========================================
   CONTACT FORM
   ========================================== */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> 立即发送';
    btn.disabled = false;
    e.target.reset();
    showToast();
  }, 1500);
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ==========================================
   INIT
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();

  // Stagger device card reveals
  document.querySelectorAll('.device-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });

  // Stagger timeline items
  document.querySelectorAll('.tl-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
});
