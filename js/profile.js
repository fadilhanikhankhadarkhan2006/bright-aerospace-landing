// ── DROPDOWN (nav "More" menu) ──
function toggleDropdown(e) {
  e.preventDefault();
  document.getElementById('dropdownMenu').classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown'))
    document.getElementById('dropdownMenu').classList.remove('open');
});

// ── USER MENU ──
function toggleUserMenu() {
  document.getElementById('navUser').classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('#navUser'))
    document.getElementById('navUser').classList.remove('open');
});

// ── SCROLL TO FOOTER ──
function scrollToFooter() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ── WEEKLY MARKS CHART ──
const ctx  = document.getElementById('marksChart').getContext('2d');
const grad = ctx.createLinearGradient(0, 0, 0, 220);
grad.addColorStop(0, 'rgba(201,174,0,0.18)');
grad.addColorStop(1, 'rgba(201,174,0,0.00)');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'],
    datasets: [
      {
        label: 'Weekly Score',
        data: [72, 78, 80, 82, 93, 85, 88, 87],
        borderColor: '#c9ae00',
        backgroundColor: grad,
        borderWidth: 2.5,
        pointBackgroundColor: '#FADB0F',
        pointBorderColor: '#c9ae00',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Avg (84.6)',
        data: [84.6, 84.6, 84.6, 84.6, 84.6, 84.6, 84.6, 84.6],
        borderColor: '#cacdd5',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e4e6ea',
        borderWidth: 1,
        titleColor: '#1a1c20',
        bodyColor: '#777c89',
        titleFont: { family: 'Koulen', size: 13 },
        bodyFont: { family: 'Sedan', size: 12 },
        padding: 12,
        callbacks: {
          label: c => c.dataset.label === 'Weekly Score'
            ? ` Score: ${c.parsed.y} / 100`
            : ` Avg: ${c.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#f0f1f4' },
        ticks: { color: '#b0b5c0', font: { family: 'Koulen', size: 11 } }
      },
      y: {
        min: 50, max: 100,
        grid: { color: '#f0f1f4' },
        ticks: {
          color: '#b0b5c0',
          font: { family: 'Koulen', size: 11 },
          callback: v => v + '%'
        }
      }
    }
  }
});

// ── PROGRESS BAR ANIMATION ON LOAD ──
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-fill, .intern-progress-fill').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = w; }, 300);
  });
});
