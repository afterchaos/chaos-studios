# After Chaos — Site Oficial

> Portfólio e landing page de edição de vídeo profissional.

---

## 📁 Estrutura de Pastas

```
after-chaos/
├── index.html              ← Página principal (HTML semântico)
├── README.md               ← Este arquivo
│
└── assets/
    ├── css/
    │   └── style.css       ← Todos os estilos (variáveis, reset, componentes, responsivo)
    │
    ├── js/
    │   └── main.js         ← Todos os scripts (cursor, nav, scroll, filtro, form…)
    │
    └── images/             ← Pasta para imagens locais (favicons, og:image, etc.)
```

---

## 🚀 Como usar

1. Abra `index.html` no navegador — funciona sem servidor.
2. Para deploy, suba a pasta inteira para Vercel / Netlify / GitHub Pages.

---

## ✏️ Editar conteúdo

| O que mudar              | Onde está                        |
|--------------------------|----------------------------------|
| Textos e seções          | `index.html`                     |
| Cores e tipografia       | `assets/css/style.css` → `:root` |
| Animações / interações   | `assets/js/main.js`              |
| Vídeos do portfólio      | `index.html` → seção `#portfolio`|
| Planos e preços          | `index.html` → seção `#planos`   |
| Endpoint do formulário   | `index.html` → `action=` no form |

---

## 🎨 Paleta de Cores

| Variável        | Valor       | Uso                        |
|-----------------|-------------|----------------------------|
| `--ink`         | `#050505`   | Background principal       |
| `--blood`       | `#e61919`   | Destaque / CTA             |
| `--gold`        | `#d4af37`   | Acentos dourados           |
| `--cream`       | `#f8f4f0`   | Texto principal            |
| `--smoke`       | `#a09b96`   | Texto secundário           |

---

## 📦 Dependências

Apenas Google Fonts (carregadas via CDN) — sem npm, sem build.

```
Bebas Neue     → títulos display
DM Serif Display → headings em serif
DM Sans        → corpo de texto
```

---

## 📬 Formulário de Contato

Usa [Formspree](https://formspree.io). Para trocar o endpoint:

```html
<!-- index.html, linha ~350 -->
<form id="cf" action="https://formspree.io/f/SEU_ID_AQUI" method="POST">
```

---

*© 2026 After Chaos. Todos os direitos reservados.*
