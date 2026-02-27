$(function () {
    var $window = $(window);
    var $navbar = $(".navbar");
    var $backToTop = $("#back-to-top");

    function toggleNavbarScrolled() {
        $navbar.toggleClass("scrolled", $window.scrollTop() > 16);
    }

    function toggleBackToTop() {
        $backToTop.toggleClass("visible", $window.scrollTop() > 420);
    }

    toggleNavbarScrolled();
    toggleBackToTop();

    $("a[href^='#']").on("click", function (event) {
        var target = $(this.getAttribute("href"));

        if (target.length) {
            event.preventDefault();
            $("html, body").animate({ scrollTop: target.offset().top - 72 }, 500);
        }
    });

    $backToTop.on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 450);
    });

    var counterAnimated = false;
    function animateCounters() {
        if (counterAnimated) {
            return;
        }

        var trigger = $(".hero-panel").offset().top;
        var viewportBottom = $window.scrollTop() + $window.height();

        if (viewportBottom >= trigger + 32) {
            $(".counter").each(function () {
                var $counter = $(this);
                var target = Number($counter.data("target"));

                $({ val: 0 }).animate(
                    { val: target },
                    {
                        duration: 950,
                        easing: "swing",
                        step: function () {
                            $counter.text(Math.floor(this.val) + "%");
                        },
                        complete: function () {
                            $counter.text(target + "%");
                        }
                    }
                );
            });

            counterAnimated = true;
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

    var sectionIds = ["#inicio", "#sobre", "#programas", "#equipe", "#planos", "#galeria", "#faq", "#contato"];
    function updateActiveNav() {
        var scrollPos = $window.scrollTop() + 110;
        var current = sectionIds[0];

        $.each(sectionIds, function (_, id) {
            var $section = $(id);
            if ($section.length && scrollPos >= $section.offset().top) {
                current = id;
            }
        });

        $(".nav-link").removeClass("active");
        $(".nav-link[href='" + current + "']").addClass("active");
    }

    animateCounters();
    revealOnScroll();
    updateActiveNav();

    $window.on("scroll", function () {
        toggleNavbarScrolled();
        toggleBackToTop();
        animateCounters();
        revealOnScroll();
        updateActiveNav();
    });

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

    function isValidPhone(value) {
        var digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 11;
    }

    $("#contact-form").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $feedback = $("#form-feedback");
        var $button = $("#contact-submit");

        var $nome = $("#nome");
        var $email = $("#email");
        var $telefone = $("#telefone");

        var hasError = false;

        $form.find(".form-control").each(function () {
            clearFieldError($(this));
        });
        $feedback.removeClass("is-success is-error").text("");

        if ($nome.val().trim().length < 3) {
            setFieldError($nome, "Informe um nome valido.");
            hasError = true;
        }

        if (!isValidEmail($email.val().trim())) {
            setFieldError($email, "Informe um email valido.");
            hasError = true;
        }

        if (!isValidPhone($telefone.val().trim())) {
            setFieldError($telefone, "Informe telefone com DDD.");
            hasError = true;
        }

        if (hasError) {
            $feedback.addClass("is-error").text("Revise os campos e tente novamente.");
            return;
        }

        $button.addClass("loading").prop("disabled", true).text("Enviando...");

        setTimeout(function () {
            $feedback.addClass("is-success").text("Contato enviado. Nossa equipe retornara em breve.");
            $button.removeClass("loading").prop("disabled", false).text("Solicitar contato");
            $form[0].reset();
        }, 650);
    });
});