$(function () {
  var $window = $(window);
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var THEME_KEY = "pizzaria_showcase_theme";

  function applyTheme(theme) {
    $body.attr("data-theme", theme);
    $themeToggle.text(theme === "dark" ? "Tema: Escuro" : "Tema: Claro");
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  $themeToggle.on("click", function () {
    var nextTheme = $body.attr("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 76 }, 500);
    }
  });

  function updateNavActive() {
    var ids = ["#inicio", "#sabores", "#mesa", "#combos", "#faq", "#pedido"];
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

  var countersDone = false;
  function animateCounters() {
    if (countersDone) {
      return;
    }

    var trigger = $(".hero-card").offset().top;
    var viewportBottom = $window.scrollTop() + $window.height();

    if (viewportBottom >= trigger + 20) {
      $(".counter").each(function () {
        var $counter = $(this);
        var target = Number($counter.data("target"));
        $({ val: 0 }).animate(
          { val: target },
          {
            duration: 850,
            step: function () {
              $counter.text(Math.floor(this.val));
            },
            complete: function () {
              $counter.text(target);
            }
          }
        );
      });

      countersDone = true;
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

    $(".flavor-item").each(function () {
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

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }

  $("#table-form").on("submit", function (event) {
    event.preventDefault();

    var $field = $("#table-number");
    var $feedback = $("#table-feedback");
    var value = $field.val().trim();

    clearError($field);
    $feedback.removeClass("is-success is-error").text("");

    if (!/^\d{1,3}$/.test(value)) {
      setError($field, "Informe um numero de mesa valido.");
      $feedback.addClass("is-error").text("Nao foi possivel ativar a mesa.");
      return;
    }

    $("#preview-table").text(value);
    $feedback.addClass("is-success").text("Mesa " + value + " ativada para pedido QR.");
    $field.val(value);
  });

  $("#order-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $name = $("#name");
    var $phone = $("#phone");
    var $flavor = $("#flavor");
    var $feedback = $("#order-feedback");
    var $button = $("#order-submit");
    var hasError = false;

    $form.find(".form-control").each(function () {
      clearError($(this));
    });
    $feedback.removeClass("is-success is-error").text("");

    if ($name.val().trim().length < 3) {
      setError($name, "Informe seu nome completo.");
      hasError = true;
    }

    if (!isValidPhone($phone.val().trim())) {
      setError($phone, "Informe um WhatsApp com DDD.");
      hasError = true;
    }

    if ($flavor.val().trim().length < 3) {
      setError($flavor, "Informe o sabor desejado.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).text("Confirmar pedido");
      $feedback.addClass("is-success").text("Pedido enviado. Em instantes confirmamos no WhatsApp.");
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
