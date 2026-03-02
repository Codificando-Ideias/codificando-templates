// Interações de tema, navegação ativa, animação e formulário
$(function () {
  const key = "rest_theme";
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

  $(".nav-link").on("click", function (e) {
    e.preventDefault();
    const target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate({ scrollTop: target.offset().top - 20 }, 450);
    }
  });

  function updateActiveNav() {
    let current = sectionIds[0];
    const pos = $(window).scrollTop() + 120;

    sectionIds.forEach(id => {
      const $section = $("#" + id);
      if ($section.length && pos >= $section.offset().top) {
        current = id;
      }
    });

    $(".nav-link").removeClass("active");
    $(`.nav-link[href='#${current}']`).addClass("active");
  }

  let countersDone = false;
  function animateCounters() {
    if (countersDone) return;

    const triggerTop = $("#apresentacao").offset().top;
    const viewportBottom = $(window).scrollTop() + $(window).height();

    if (viewportBottom >= triggerTop + 60) {
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

  function revealSections() {
    const viewportBottom = $(window).scrollTop() + $(window).height();
    $(".reveal").each(function () {
      const $el = $(this);
      if (viewportBottom > $el.offset().top + 40) {
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

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }

  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $name = $("#name");
    const $phone = $("#phone");
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

    if (!isValidPhone($phone.val().trim())) {
      setError($phone, "Informe um telefone com DDD.");
      hasError = true;
    }

    if ($msg.val().trim().length < 8) {
      setError($msg, "Descreva a reserva ou evento.");
      hasError = true;
    }

    if (hasError) {
      $fb.addClass("error").text("Revise os campos destacados.");
      return;
    }

    $btn.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(() => {
      $btn.removeClass("loading").prop("disabled", false).text("Reservar");
      $fb.addClass("ok").text("Reserva enviada. Nossa equipe confirmará em breve.");
      $form[0].reset();
    }, 700);
  });

  revealSections();
  animateCounters();
  updateActiveNav();

  $(window).on("scroll", function () {
    revealSections();
    animateCounters();
    updateActiveNav();
  });
});