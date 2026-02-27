$(function () {
    var $window = $(window);
    var $navbar = $(".navbar");

    function toggleNavbarScrolled() {
        $navbar.toggleClass("scrolled", $window.scrollTop() > 16);
    }

    toggleNavbarScrolled();
    $window.on("scroll", toggleNavbarScrolled);

    $("a[href^='#']").on("click", function (event) {
        var target = $(this.getAttribute("href"));

        if (target.length) {
            event.preventDefault();
            $("html, body").animate(
                { scrollTop: target.offset().top - 72 },
                500
            );
        }
    });

    var animated = false;

    function animateCounters() {
        if (animated) {
            return;
        }

        var sectionTop = $(".hero-card").offset().top;
        var viewportBottom = $window.scrollTop() + $window.height();

        if (viewportBottom >= sectionTop + 30) {
            $(".counter").each(function () {
                var $counter = $(this);
                var target = Number($counter.data("target"));
                var suffix = "%";

                if ($counter.text().includes("dias")) {
                    suffix = " dias";
                }

                $({ val: 0 }).animate(
                    { val: target },
                    {
                        duration: 1000,
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
    }

    animateCounters();
    $window.on("scroll", animateCounters);

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

    $("#lead-form").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $feedback = $("#form-feedback");
        var hasError = false;

        var $nome = $form.find("#nome");
        var $email = $form.find("#email");
        var $telefone = $form.find("#telefone");
        var $empresa = $form.find("#empresa");
        var $mensagem = $form.find("#mensagem");

        $form.find(".form-control").each(function () {
            clearFieldError($(this));
        });

        $feedback.removeClass("is-success is-error").text("");

        if ($nome.val().trim().length < 3) {
            setFieldError($nome, "Informe um nome com pelo menos 3 caracteres.");
            hasError = true;
        }

        if (!isValidEmail($email.val().trim())) {
            setFieldError($email, "Informe um email valido.");
            hasError = true;
        }

        if (!isValidPhone($telefone.val().trim())) {
            setFieldError($telefone, "Informe um telefone com DDD.");
            hasError = true;
        }

        if ($empresa.val().trim().length < 2) {
            setFieldError($empresa, "Informe o nome da empresa.");
            hasError = true;
        }

        if ($mensagem.val().trim().length < 10) {
            setFieldError($mensagem, "Descreva o objetivo com pelo menos 10 caracteres.");
            hasError = true;
        }

        if (hasError) {
            $feedback.addClass("is-error").text("Revise os campos destacados e tente novamente.");
            return;
        }

        $feedback.addClass("is-success").text("Contato enviado com sucesso. Em breve nossa equipe retornara.");
        $form[0].reset();
    });
});
