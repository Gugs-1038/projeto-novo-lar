(() => {
document.documentElement.classList.replace("sem-js", "js");

const controleMenu = document.querySelector(".controle-menu");
const controlesSubmenu = document.querySelectorAll(".controle-submenu");
const consultaMobile = window.matchMedia("(max-width: 768px)");

function definirEstado(controle, aberto) {
  controle.setAttribute("aria-expanded", String(aberto));

  if (controle.classList.contains("controle-menu")) {
    controle.setAttribute(
      "aria-label",
      aberto ? "Fechar menu principal" : "Abrir menu principal"
    );
    return;
  }

  controle.setAttribute(
    "aria-label",
    aberto ? "Fechar submenu de Projetos" : "Abrir submenu de Projetos"
  );
}

function fecharSubmenus() {
  controlesSubmenu.forEach((controle) => definirEstado(controle, false));
}

function fecharNavegacao() {
  if (controleMenu) {
    definirEstado(controleMenu, false);
  }
  fecharSubmenus();
}

if (controleMenu) {
  controleMenu.addEventListener("click", () => {
    const aberto = controleMenu.getAttribute("aria-expanded") === "true";
    definirEstado(controleMenu, !aberto);

    if (aberto) {
      fecharSubmenus();
    }
  });
}

controlesSubmenu.forEach((controle) => {
  controle.addEventListener("click", () => {
    const aberto = controle.getAttribute("aria-expanded") === "true";
    fecharSubmenus();
    definirEstado(controle, !aberto);
  });
});

document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".cabecalho")) {
    fecharNavegacao();
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") {
    return;
  }

  const submenuAberto = document.querySelector(
    '.controle-submenu[aria-expanded="true"]'
  );
  const menuAberto = controleMenu?.getAttribute("aria-expanded") === "true";

  fecharNavegacao();

  if (submenuAberto) {
    submenuAberto.focus();
  } else if (menuAberto && controleMenu) {
    controleMenu.focus();
  }
});

document.querySelector(".navegacao")?.addEventListener("click", (evento) => {
  if (consultaMobile.matches && evento.target.closest("a")) {
    fecharNavegacao();
  }
});

consultaMobile.addEventListener("change", fecharNavegacao);
window.addEventListener("hashchange", fecharNavegacao);
})();
