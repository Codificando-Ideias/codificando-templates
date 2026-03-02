// Interações de tema, animações e validação de contato
$(function () {
  const key = "contab_theme";

  function setTheme(theme) {
    $("body").attr("data-theme", theme);
  }

  setTheme(localStorage.getItem(key) || "light");

  $("#themeToggle").on("click", () => {
    const next = $("body").attr("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(key, next);
  });

  function revealCards() {
    $(".reveal").each(function (idx) {
      const $item = $(this);
      setTimeout(() => {
        $item.addClass("visible");
      }, idx * 90);
    });
  }

  let countersDone = false;
  function animateCounters() {
    if (countersDone) return;

    $(".counter").each(function () {
      const $counter = $(this);
      const target = Number($counter.data("target"));
      const suffix = $counter.text().includes("%") ? "%" : "";

      $({ val: 0 }).animate(
        { val: target },
        {
          duration: 850,
          easing: "swing",
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
    const $company = $("#company");
    const $email = $("#email");
    const $msg = $("#msg");
    const $fb = $("#fb");
    const $btn = $("#submitBtn");

    let hasError = false;

    $form.find(".form-control").each(function () {
      clearError($(this));
    });

    $fb.removeClass("ok error").text("");

    if ($company.val().trim().length < 2) {
      setError($company, "Informe o nome da empresa.");
      hasError = true;
    }

    if (!isValidEmail($email.val().trim())) {
      setError($email, "Informe um email válido.");
      hasError = true;
    }

    if ($msg.val().trim().length < 10) {
      setError($msg, "Descreva o objetivo do diagnóstico.");
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

  revealCards();
  animateCounters();
});