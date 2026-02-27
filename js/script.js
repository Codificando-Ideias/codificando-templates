let templates = [];
const THEME_KEY = "marketplace_theme";
const fallbackThumb =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
      <rect width='100%' height='100%' fill='#e9ecef'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6c757d' font-family='Arial, sans-serif' font-size='24'>
        Preview indisponivel
      </text>
    </svg>`
  );

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  const button = document.getElementById("themeToggle");
  if (button) {
    button.textContent = theme === "dark" ? "Light" : "Dark";
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);

  const button = document.getElementById("themeToggle");
  if (!button) return;

  button.addEventListener("click", function () {
    const current = document.body.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

async function loadTemplates() {
  const response = await fetch("data/templates.json");
  templates = await response.json();

  populateFilter();
  renderTemplates(templates);
}

function populateFilter() {
  const segments = [...new Set(templates.map(t => t.segment))];
  const filter = document.getElementById("segmentFilter");

  segments.forEach(segment => {
    const option = document.createElement("option");
    option.value = segment;
    option.textContent = segment;
    filter.appendChild(option);
  });
}

function renderTemplates(list) {
  const container = document.getElementById("templateContainer");
  container.innerHTML = "";

  list.forEach(template => {
    const thumb = template.thumbnail || `${template.slug}/preview.png`;
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card template-card h-100">
          <img src="${thumb}" class="card-img-top template-thumb" alt="${template.name}">
          <div class="card-body">
            <h5 class="card-title">${template.name}</h5>
            <p class="card-text">${template.description}</p>
            <div class="d-flex justify-content-between">
              <a href="${template.slug}/" target="_blank" class="btn btn-dark btn-sm">Visualizar</a>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.querySelectorAll(".template-thumb").forEach(img => {
    img.addEventListener("error", function () {
      if (this.src !== fallbackThumb) {
        this.src = fallbackThumb;
      }
    });
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(value)
  );
  renderTemplates(filtered);
});

document.getElementById("segmentFilter").addEventListener("change", function () {
  if (this.value === "all") {
    renderTemplates(templates);
  } else {
    renderTemplates(templates.filter(t => t.segment === this.value));
  }
});

initTheme();
loadTemplates();