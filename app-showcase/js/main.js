$(function () {
  var $window = $(window);
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var THEME_KEY = "app_showcase_theme";

  function applyTheme(theme) {
    $body.attr("data-theme", theme);
    $themeToggle.text(theme === "dark" ? "Tema: Escuro" : "Tema: Claro");
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "dark");

  $themeToggle.on("click", function () {
    var nextTheme = $body.attr("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 76 }, 480);
    }
  });

  function updateNavActive() {
    var ids = ["#home", "#features", "#modules", "#pricing", "#faq", "#preorder"];
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

    var trigger = $(".device-mock").offset().top;
    var viewportBottom = $window.scrollTop() + $window.height();

    if (viewportBottom >= trigger + 25) {
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
      if (viewportBottom > $item.offset().top + 28) {
        $item.addClass("is-visible");
      }
    });
  }

  $(".module-tab").on("click", function () {
    var $tab = $(this);
    var target = $tab.data("target");

    $(".module-tab").removeClass("active");
    $tab.addClass("active");

    $(".module-panel").removeClass("active");
    $("#" + target).addClass("active");
  });

  $("#price-toggle").on("change", function () {
    var isYear = $(this).is(":checked");

    $(".price").each(function () {
      var $price = $(this);
      var value = isYear ? $price.data("year") : $price.data("month");
      var suffix = isYear ? "/mes no plano anual" : "/mes";
      $price.html("R$ " + value + "<span>" + suffix + "</span>");
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

  $("#preorder-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $company = $("#company");
    var $email = $("#email");
    var $role = $("#role");
    var $feedback = $("#preorder-feedback");
    var $button = $("#preorder-submit");
    var hasError = false;

    $form.find(".form-control").each(function () {
      clearError($(this));
    });
    $feedback.removeClass("is-success is-error").text("");

    if ($company.val().trim().length < 2) {
      setError($company, "Informe o nome da empresa.");
      hasError = true;
    }

    if (!isValidEmail($email.val().trim())) {
      setError($email, "Informe um email corporativo valido.");
      hasError = true;
    }

    if ($role.val().trim().length < 2) {
      setError($role, "Informe seu cargo.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).text("Quero prioridade na pre-venda");
      $feedback.addClass("is-success").text("Inscricao confirmada. Voce recebera o acesso antecipado.");
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