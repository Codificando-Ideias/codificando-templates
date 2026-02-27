$(function () {
  var $window = $(window);
  var $sidebar = $("#sidebar");
  var $toggle = $("#sidebar-toggle");
  var chartInstance = null;

  $toggle.on("click", function () {
    $sidebar.toggleClass("open");
  });

  $("a[href^='#']").on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 18 }, 400);
      if ($window.width() < 992) {
        $sidebar.removeClass("open");
      }
    }
  });

  function updateActiveNav() {
    var ids = ["#overview", "#analytics", "#projects", "#team", "#settings"];
    var current = ids[0];
    var pos = $window.scrollTop() + 140;

    $.each(ids, function (_, id) {
      var $section = $(id);
      if ($section.length && pos >= $section.offset().top) {
        current = id;
      }
    });

    $(".sidebar-nav .nav-link").removeClass("active");
    $(".sidebar-nav .nav-link[href='" + current + "']").addClass("active");
  }

  var animated = false;
  function animateCounters() {
    if (animated) {
      return;
    }

    $(".counter").each(function () {
      var $counter = $(this);
      var target = Number($counter.data("target"));
      $({ val: 0 }).animate(
        { val: target },
        {
          duration: 900,
          easing: "swing",
          step: function () {
            $counter.text(Math.floor(this.val));
          },
          complete: function () {
            $counter.text(target);
          }
        }
      );
    });

    animated = true;
  }

  var chartDataByPeriod = {
    "7d": [62, 48, 71, 57, 66, 74, 69],
    "30d": [55, 64, 60, 68, 72, 70, 75],
    "90d": [49, 58, 61, 64, 67, 70, 73]
  };

  function buildChart(period) {
    var $canvas = $("#channelChart");
    if (!$canvas.length || typeof Chart === "undefined") {
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart($canvas, {
      type: "line",
      data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
        datasets: [
          {
            label: "Inbound",
            data: chartDataByPeriod[period],
            borderColor: "#31d0aa",
            backgroundColor: "rgba(49, 208, 170, 0.2)",
            tension: 0.35,
            fill: true,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#c3cede"
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#8e9bb0" },
            grid: { color: "rgba(80, 95, 118, 0.2)" }
          },
          y: {
            ticks: { color: "#8e9bb0" },
            grid: { color: "rgba(80, 95, 118, 0.2)" }
          }
        }
      }
    });
  }

  buildChart("7d");

  $(".period-filter .btn").on("click", function () {
    var $btn = $(this);
    var period = $btn.data("period");

    $(".period-filter .btn").removeClass("active");
    $btn.addClass("active");
    buildChart(period);
  });

  var SETTINGS_KEY = "novaops_dashboard_settings";

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

  function loadSettings() {
    var raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return;
    }

    try {
      var data = JSON.parse(raw);
      $("#company-name").val(data.company || "");
      $("#admin-email").val(data.email || "");
      $("#timezone").val(data.timezone || "");
      $("#email-alerts").prop("checked", Boolean(data.alerts));
    } catch (error) {
      localStorage.removeItem(SETTINGS_KEY);
    }
  }

  loadSettings();

  $("#settings-form").on("submit", function (event) {
    event.preventDefault();

    var $form = $(this);
    var $feedback = $("#settings-feedback");
    var $save = $("#settings-save");
    var $company = $("#company-name");
    var $email = $("#admin-email");
    var $timezone = $("#timezone");

    var hasError = false;

    $form.find(".form-control, .form-select").each(function () {
      clearFieldError($(this));
    });
    $feedback.removeClass("is-success is-error").text("");

    if ($company.val().trim().length < 2) {
      setFieldError($company, "Informe o nome da empresa.");
      hasError = true;
    }

    if (!isValidEmail($email.val().trim())) {
      setFieldError($email, "Informe um email valido.");
      hasError = true;
    }

    if (!$timezone.val()) {
      setFieldError($timezone, "Selecione um fuso horario.");
      hasError = true;
    }

    if (hasError) {
      $feedback.addClass("is-error").text("Revise os campos destacados.");
      return;
    }

    $save.addClass("loading").prop("disabled", true).text("Salvando...");

    setTimeout(function () {
      var payload = {
        company: $company.val().trim(),
        email: $email.val().trim(),
        timezone: $timezone.val(),
        alerts: $("#email-alerts").is(":checked")
      };

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
      $save.removeClass("loading").prop("disabled", false).text("Salvar alteracoes");
      $feedback.addClass("is-success").text("Configuracoes salvas com sucesso.");
    }, 700);
  });

  animateCounters();
  updateActiveNav();
  $window.on("scroll", updateActiveNav);
});