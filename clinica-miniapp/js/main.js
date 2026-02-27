$(function () {
  var $body = $("body");
  var $themeToggle = $("#theme-toggle");
  var THEME_KEY = "clinica_miniapp_theme";

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

  function openView(view) {
    $(".view").removeClass("active");
    $('.view[data-view="' + view + '"]').addClass("active");

    $(".tab-btn").removeClass("active");
    $('.tab-btn[data-view="' + view + '"]').addClass("active");

    $(".hub-link").removeClass("active");
    $('.hub-link[href="#' + view + '"]').addClass("active");

    $(".app-content").scrollTop(0);
  }

  $(".tab-btn, .go-view").on("click", function () {
    openView($(this).data("view") || $(this).data("target"));
  });

  $(".hub-link").on("click", function (event) {
    event.preventDefault();
    openView($(this).attr("href").replace("#", ""));
  });

  var counterDone = false;
  function animateCounters() {
    if (counterDone) {
      return;
    }

    $(".counter").each(function () {
      var $counter = $(this);
      var rawText = $counter.text();
      var target = Number($counter.data("target"));
      var suffix = rawText.includes("%") ? "%" : "";

      $({ val: 0 }).animate(
        { val: target },
        {
          duration: 800,
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

  function revealCards() {
    $(".reveal-item").each(function (index) {
      var $item = $(this);
      setTimeout(function () {
        $item.addClass("is-visible");
      }, index * 80);
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
      setFieldError($service, "Selecione uma especialidade.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $button.addClass("loading").prop("disabled", true).text("Enviando...");

    setTimeout(function () {
      $button.removeClass("loading").prop("disabled", false).text("Confirmar agendamento");
      $feedback.addClass("is-success").text("Agendamento enviado. Retornaremos em instantes.");
      $form[0].reset();
    }, 700);
  });

  animateCounters();
  revealCards();
});