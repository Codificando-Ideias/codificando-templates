// Interações de tema, scroll-navegação, animações e formulário
$(function () {
  const key = "vidro_theme";
  const sectionIds = ["apresentacao", "servicos", "diferenciais", "contato"];

  function setTheme(theme) {
    $("body").attr("data-theme", theme);
  }

  setTheme(localStorage.getItem(key) || "light");

  $("#themeToggle").on("click", () => {
    const next = $("body").attr("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(key, next);
  });

  $(".dot").on("click", function (e) {
    e.preventDefault();
    const id = $(this).attr("href");
    const root = $("#scrollRoot");
    const target = $(id);
    if (target.length) {
      root.animate({ scrollTop: root.scrollTop() + target.position().top }, 450);
    }
  });

  function updateDots() {
    const root = $("#scrollRoot");
    const pos = root.scrollTop() + root.height() * 0.4;
    let current = sectionIds[0];

    sectionIds.forEach(id => {
      const el = $("#" + id);
      if (el.length) {
        const top = el.position().top + root.scrollTop();
        if (pos >= top) current = id;
      }
    });

    $(".dot").removeClass("active");
    $(`.dot[href='#${current}']`).addClass("active");
  }

  let countersDone = false;
  function animateCounters() {
    if (countersDone) return;

    const root = $("#scrollRoot");
    const top = $("#apresentacao").position().top;
    if (root.scrollTop() > top - 120) {
      $(".counter").each(function () {
        const $counter = $(this);
        const target = Number($counter.data("target"));
        const suffix = $counter.text().includes("%") ? "%" : "";

        $({ val: 0 }).animate(
          { val: target },
          {
            duration: 850,
            step: function () {
              $counter.text(Math.floor(this.val) + suffix);
            },
            complete: function () {
              $counter.text(target + suffix);
            }
          }
        );
      });
      countersDone = true;
    }
  }

  function revealOnScroll() {
    const root = $("#scrollRoot");
    const viewportBottom = root.scrollTop() + root.height();

    $(".reveal").each(function () {
      const $el = $(this);
      const top = $el.closest("section").position().top + root.scrollTop();
      if (viewportBottom > top + 40) {
        $el.addClass("visible");
      }
    });
  }

  function setError($field, msg) {
    $field.addClass("is-invalid");
    $field.siblings(".invalid-feedback").text(msg);
  }

  function clearError($field) {
    $field.removeClass("is-invalid");
    $field.siblings(".invalid-feedback").text("");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $name = $("#name");
    const $email = $("#email");
    const $msg = $("#msg");
    const $fb = $("#fb");
    const $btn = $("#submitBtn");
    let hasError = false;

    $form.find(".form-control").each(function () {
      clearError($(this));
    });
    $fb.removeClass("ok error").text("");

    if ($name.val().trim().length < 3) {
      setError($name, "Informe seu nome completo.");
      hasError = true;
    }

    if (!isValidEmail($email.val().trim())) {
      setError($email, "Informe um email válido.");
      hasError = true;
    }

    if ($msg.val().trim().length < 10) {
      setError($msg, "Descreva seu projeto com mais detalhes.");
      hasError = true;
    }

    if (hasError) {
      $fb.addClass("error").text("Revise os campos destacados.");
      return;
    }

    $btn.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(() => {
      $btn.removeClass("loading").prop("disabled", false).text("Solicitar diagnóstico");
      $fb.addClass("ok").text("Solicitação enviada. Retornaremos em breve.");
      $form[0].reset();
    }, 700);
  });

  $("#scrollRoot").on("scroll", function () {
    updateDots();
    animateCounters();
    revealOnScroll();
  });

  updateDots();
  animateCounters();
  revealOnScroll();
});