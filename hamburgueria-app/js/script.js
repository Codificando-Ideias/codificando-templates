// Interacoes de tema, navegacao e formulario
$(function () {
  const key = "burger_theme";

  function setTheme(theme) {
    $("body").attr("data-theme", theme);
  }

  setTheme(localStorage.getItem(key) || "light");

  $("#themeToggle").on("click", function () {
    const next = $("body").attr("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(key, next);
  });

  function openScreen(id) {
    $(".tab").removeClass("active");
    $(`.tab[data-screen='${id}']`).addClass("active");
    $(".screen").removeClass("active");
    $(`#${id}`).addClass("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $(".tab").on("click", function () {
    openScreen($(this).data("screen"));
  });

  $(".go-screen").on("click", function () {
    openScreen($(this).data("target"));
  });

  let animated = false;
  function animateCounters() {
    if (animated) return;

    $(".counter").each(function () {
      const $counter = $(this);
      const target = Number($counter.data("target"));
      const suffix = $counter.text().includes("%") ? "%" : "";

      $({ val: 0 }).animate(
        { val: target },
        {
          duration: 900,
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

    animated = true;
  }

  animateCounters();

  $(".filter-group .btn").on("click", function () {
    const $btn = $(this);
    const filter = $btn.data("filter");

    $(".filter-group .btn").removeClass("active");
    $btn.addClass("active");

    $(".menu-item").each(function () {
      const $item = $(this);
      const cat = $item.data("cat");
      const show = filter === "all" || filter === cat;

      if (show) {
        $item.stop(true, true).slideDown(140);
      } else {
        $item.stop(true, true).slideUp(120);
      }
    });
  });

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
      setError($email, "Informe um email valido.");
      hasError = true;
    }

    if ($msg.val().trim().length < 10) {
      setError($msg, "Descreva seu desafio com mais detalhes.");
      hasError = true;
    }

    if (hasError) {
      $fb.addClass("error").text("Revise os campos destacados.");
      return;
    }

    $btn.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(function () {
      $btn.removeClass("loading").prop("disabled", false).text("Enviar");
      $fb.addClass("ok").text("Mensagem enviada. Nosso time comercial retornará em breve.");
      $form[0].reset();
    }, 700);
  });
});