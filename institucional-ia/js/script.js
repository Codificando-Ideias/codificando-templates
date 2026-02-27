$(function () {
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var $drawer = $("#app-drawer");
  var $overlay = $("#drawer-overlay");
  var THEME_KEY = "institucional_ia_theme";

  function applyTheme(theme) {
    $body.attr("data-theme", theme);
    $themeToggle.html(theme === "light" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>');
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  $themeToggle.on("click", function () {
    var next = $body.attr("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  function openDrawer() {
    $drawer.addClass("open").attr("aria-hidden", "false");
    $overlay.addClass("show");
  }

  function closeDrawer() {
    $drawer.removeClass("open").attr("aria-hidden", "true");
    $overlay.removeClass("show");
  }

  $("#drawer-open").on("click", openDrawer);
  $("#drawer-close, #drawer-overlay").on("click", closeDrawer);

  function goToSection(id) {
    var $target = $("#" + id);
    if ($target.length) {
      $("html, body").animate({ scrollTop: $target.offset().top - 70 }, 430);
    }
  }

  $(".tab").on("click", function () {
    var target = $(this).data("target");
    goToSection(target);
  });

  $(".drawer-link").on("click", function (event) {
    event.preventDefault();
    var target = $(this).attr("href").replace("#", "");
    goToSection(target);
    closeDrawer();
  });

  function updateActiveNav() {
    var ids = ["apresentacao", "servicos", "diferenciais", "contato"];
    var current = ids[0];
    var pos = $(window).scrollTop() + 140;

    $.each(ids, function (_, id) {
      var $section = $("#" + id);
      if ($section.length && pos >= $section.offset().top) {
        current = id;
      }
    });

    $(".tab").removeClass("active");
    $(".tab[data-target='" + current + "']").addClass("active");
  }

  var countersDone = false;
  function animateCounters() {
    if (countersDone) {
      return;
    }

    var trigger = $("#diferenciais").offset().top;
    var viewportBottom = $(window).scrollTop() + $(window).height();

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

      countersDone = true;
    }
  }

  $(".acc-trigger").on("click", function () {
    var $item = $(this).closest(".acc-item");
    $item.toggleClass("open");
  });

  function revealPanels() {
    $(".reveal").each(function (idx) {
      var $item = $(this);
      setTimeout(function () {
        $item.addClass("visible");
      }, idx * 70);
    });
  }

  function setFieldError($field, message) {
    $field.addClass("is-invalid");
    $field.siblings(".invalid-feedback").text(message);
  }

  function clearFieldError($field) {
    $field.removeClass("is-invalid");
    $field.siblings(".invalid-feedback").text("");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  $("#contact-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $feedback = $("#contact-feedback");
    var $button = $("#contact-submit");

    var $name = $("#name");
    var $email = $("#email");
    var $message = $("#message");

    var hasError = false;

    $form.find(".form-control").each(function () {
      clearFieldError($(this));
    });

    $feedback.removeClass("is-success is-error").text("");

    if ($name.val().trim().length < 3) {
      setFieldError($name, "Informe seu nome completo.");
      hasError = true;
    }

    if (!isValidEmail($email.val().trim())) {
      setFieldError($email, "Informe um email valido.");
      hasError = true;
    }

    if ($message.val().trim().length < 10) {
      setFieldError($message, "Descreva seu desafio com mais detalhes.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).html('<i class="bi bi-hourglass-split me-1"></i>Enviando...');

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).html('<i class="bi bi-send me-1"></i>Falar com especialista');
      $feedback.addClass("is-success").text("Mensagem enviada. Nosso time retorna em breve.");
      $form[0].reset();
    }, 700);
  });

  revealPanels();
  animateCounters();
  updateActiveNav();

  $(window).on("scroll", function () {
    animateCounters();
    updateActiveNav();
  });
});