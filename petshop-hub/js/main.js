$(function () {
  var $window = $(window);
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var THEME_KEY = "petshop_hub_theme";

  function applyTheme(theme) {
    $body.attr("data-theme", theme);
    $themeToggle.html(theme === "light" ? '<i class="bi bi-sun me-1"></i>Tema: Claro' : '<i class="bi bi-moon-stars me-1"></i>Tema: Escuro');
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  $themeToggle.on("click", function () {
    var next = $body.attr("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 20 }, 450);
    }
  });

  function updateActiveNav() {
    var ids = ["#visao", "#servicos", "#planos", "#faq", "#agenda"];
    var current = ids[0];
    var pos = $window.scrollTop() + 130;

    $.each(ids, function (_, id) {
      var $section = $(id);
      if ($section.length && pos >= $section.offset().top) {
        current = id;
      }
    });

    $(".hub-link").removeClass("active");
    $(".hub-link[href='" + current + "']").addClass("active");
  }

  var countersDone = false;
  function animateCounters() {
    if (countersDone) {
      return;
    }

    var trigger = $(".stat-box").offset().top;
    var viewportBottom = $window.scrollTop() + $window.height();

    if (viewportBottom >= trigger + 20) {
      $(".counter").each(function () {
        var $counter = $(this);
        var target = Number($counter.data("target"));
        var suffix = $counter.text().includes("%") ? "%" : "";

        $({ val: 0 }).animate(
          { val: target },
          {
            duration: 900,
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
    var viewportBottom = $window.scrollTop() + $window.height();
    $(".reveal-item").each(function () {
      var $item = $(this);
      if (viewportBottom > $item.offset().top + 24) {
        $item.addClass("is-visible");
      }
    });
  }

  $(".switch-btn").on("click", function () {
    var $btn = $(this);
    var target = $btn.data("target");

    $(".switch-btn").removeClass("active");
    $btn.addClass("active");

    $(".services-panel").removeClass("active");
    $("#service-" + target).addClass("active");
  });

  function setFieldError($field, message) {
    $field.addClass("is-invalid");
    $field.siblings(".invalid-feedback").text(message);
  }

  function clearFieldError($field) {
    $field.removeClass("is-invalid");
    $field.siblings(".invalid-feedback").text("");
  }

  function isValidPhone(value) {
    var digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }

  $("#booking-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $feedback = $("#booking-feedback");
    var $button = $("#booking-submit");

    var $tutor = $("#tutor");
    var $pet = $("#pet");
    var $phone = $("#phone");
    var $service = $("#service");

    var hasError = false;

    $form.find(".form-control, .form-select").each(function () {
      clearFieldError($(this));
    });
    $feedback.removeClass("is-success is-error").text("");

    if ($tutor.val().trim().length < 3) {
      setFieldError($tutor, "Informe o nome do tutor.");
      hasError = true;
    }

    if ($pet.val().trim().length < 2) {
      setFieldError($pet, "Informe o nome do pet.");
      hasError = true;
    }

    if (!isValidPhone($phone.val().trim())) {
      setFieldError($phone, "Informe um WhatsApp com DDD.");
      hasError = true;
    }

    if (!$service.val()) {
      setFieldError($service, "Selecione um servico.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).html('<i class="bi bi-hourglass-split me-1"></i>Enviando...');

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).html('<i class="bi bi-send me-1"></i>Enviar agendamento');
      $feedback.addClass("is-success").text("Agendamento enviado. Retornaremos em instantes.");
      $form[0].reset();
    }, 700);
  });

  animateCounters();
  revealOnScroll();
  updateActiveNav();

  $window.on("scroll", function () {
    animateCounters();
    revealOnScroll();
    updateActiveNav();
  });
});