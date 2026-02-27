$(function () {
  var $window = $(window);
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var THEME_KEY = "portfolio_album_theme";

  function applyTheme(theme) {
    $body.attr("data-theme", theme);
    $themeToggle.text(theme === "dark" ? "Tema: Escuro" : "Tema: Claro");
  }

  var savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  $themeToggle.on("click", function () {
    var current = $body.attr("data-theme") === "dark" ? "light" : "dark";
    applyTheme(current);
    localStorage.setItem(THEME_KEY, current);
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 76 }, 500);
    }
  });

  var counterDone = false;
  function animateCounters() {
    if (counterDone) {
      return;
    }
    var trigger = $(".stat-card").offset().top;
    var viewportBottom = $window.scrollTop() + $window.height();
    if (viewportBottom >= trigger + 30) {
      $(".counter").each(function () {
        var $counter = $(this);
        var target = Number($counter.data("target"));
        $({ val: 0 }).animate(
          { val: target },
          {
            duration: 900,
            step: function () {
              $counter.text(Math.floor(this.val));
            },
            complete: function () {
              $counter.text(target);
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
      if (viewportBottom > $item.offset().top + 28) {
        $item.addClass("is-visible");
      }
    });
  }

  animateCounters();
  revealOnScroll();
  $window.on("scroll", function () {
    animateCounters();
    revealOnScroll();
  });

  $(".filter-group .btn").on("click", function () {
    var $btn = $(this);
    var filter = $btn.data("filter");

    $(".filter-group .btn").removeClass("active");
    $btn.addClass("active");

    $(".gallery-item").each(function () {
      var $item = $(this);
      var category = $item.data("category");
      var visible = filter === "all" || filter === category;
      if (visible) {
        $item.stop(true, true).fadeIn(180);
      } else {
        $item.stop(true, true).fadeOut(120);
      }
    });
  });

  var imageModal = new bootstrap.Modal(document.getElementById("imageModal"));

  $(".image-card").on("click", function () {
    var $card = $(this);
    $("#imageModalTitle").text($card.data("title"));
    $("#imageModalSrc").attr("src", $card.data("image"));
    imageModal.show();
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

  $("#contact-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $feedback = $("#contact-feedback");
    var $button = $("#contact-submit");

    var $name = $("#name");
    var $email = $("#email");
    var $project = $("#project");

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

    if ($project.val().trim().length < 3) {
      setError($project, "Descreva o tipo de projeto.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).text("Enviar briefing");
      $feedback.addClass("is-success").text("Briefing enviado. Retornaremos em breve.");
      $form[0].reset();
    }, 700);
  });
});