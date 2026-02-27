$(function () {
  var $window = $(window);
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var THEME_KEY = "confeitaria_theme";

  function applyTheme(theme) {
    $body.attr("data-theme", theme);
    $themeToggle.text(theme === "light" ? "Tema: Claro" : "Tema: Escuro");
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  $themeToggle.on("click", function () {
    var nextTheme = $body.attr("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 82 }, 500);
    }
  });

  function updateNavActive() {
    var ids = ["#inicio", "#colecao", "#processo", "#faq", "#pedido"];
    var current = ids[0];
    var pos = $window.scrollTop() + 120;

    $.each(ids, function (_, id) {
      var $section = $(id);
      if ($section.length && pos >= $section.offset().top) {
        current = id;
      }
    });

    $(".nav-link").removeClass("active");
    $(".nav-link[href='" + current + "']").addClass("active");
  }

  var counterDone = false;
  function animateCounters() {
    if (counterDone) {
      return;
    }

    var trigger = $(".tile-kpis").offset().top;
    var viewportBottom = $window.scrollTop() + $window.height();

    if (viewportBottom >= trigger + 20) {
      $(".counter").each(function () {
        var $counter = $(this);
        var target = Number($counter.data("target"));
        var suffix = $counter.text().includes("%") ? "%" : "";

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

      counterDone = true;
    }
  }

  function revealOnScroll() {
    var viewportBottom = $window.scrollTop() + $window.height();
    $(".reveal-item").each(function () {
      var $item = $(this);
      if (viewportBottom > $item.offset().top + 26) {
        $item.addClass("is-visible");
      }
    });
  }

  $(".filter-group .btn").on("click", function () {
    var $btn = $(this);
    var filter = $btn.data("filter");

    $(".filter-group .btn").removeClass("active");
    $btn.addClass("active");

    $(".cake-item").each(function () {
      var $item = $(this);
      var category = $item.data("category");
      var show = filter === "all" || filter === category;

      if (show) {
        $item.stop(true, true).fadeIn(180);
      } else {
        $item.stop(true, true).fadeOut(120);
      }
    });
  });

  function setError($field, message) {
    $field.addClass("is-invalid");
    $field.siblings(".invalid-feedback").text(message);
  }

  function clearError($field) {
    $field.removeClass("is-invalid");
    $field.siblings(".invalid-feedback").text("");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  $("#cake-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $name = $("#name");
    var $email = $("#email");
    var $event = $("#event");
    var $feedback = $("#cake-feedback");
    var $button = $("#cake-submit");
    var hasError = false;

    $form.find(".form-control").each(function () {
      clearError($(this));
    });
    $feedback.removeClass("is-success is-error").text("");

    if ($name.val().trim().length < 3) {
      setError($name, "Informe seu nome completo.");
      hasError = true;
    }

    if (!isValidEmail($email.val().trim())) {
      setError($email, "Informe um email valido.");
      hasError = true;
    }

    if ($event.val().trim().length < 3) {
      setError($event, "Informe o tipo de evento.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).text("Enviar pedido");
      $feedback.addClass("is-success").text("Pedido enviado. Retornaremos com proposta em breve.");
      $form[0].reset();
    }, 700);
  });

  animateCounters();
  revealOnScroll();
  updateNavActive();

  $window.on("scroll", function () {
    animateCounters();
    revealOnScroll();
    updateNavActive();
  });
});