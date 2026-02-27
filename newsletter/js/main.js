$(function () {
    var $window = $(window);
    var $navbar = $(".navbar");

    function toggleNavbarScrolled() {
        $navbar.toggleClass("scrolled", $window.scrollTop() > 12);
    }

    toggleNavbarScrolled();
    $window.on("scroll", toggleNavbarScrolled);

    $("a[href^='#']").on("click", function (event) {
        var target = $(this.getAttribute("href"));

        if (target.length) {
            event.preventDefault();
            $("html, body").animate({ scrollTop: target.offset().top - 74 }, 500);
        }
    });

    function revealOnScroll() {
        var viewportBottom = $window.scrollTop() + $window.height();

        $(".reveal-item").each(function () {
            var $item = $(this);
            if (viewportBottom > $item.offset().top + 36) {
                $item.addClass("is-visible");
            }
        });
    }

    revealOnScroll();
    $window.on("scroll", revealOnScroll);

    $(".btn-filter").on("click", function () {
        var $btn = $(this);
        var filter = $btn.data("filter");

        $(".btn-filter").removeClass("active");
        $btn.addClass("active");

        $(".topic-item").each(function () {
            var $item = $(this);
            var topic = $item.data("topic");
            var visible = filter === "all" || filter === topic;

            if (visible) {
                $item.stop(true, true).fadeIn(180);
            } else {
                $item.stop(true, true).fadeOut(120);
            }
        });
    });

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    var STORAGE_KEY = "newsletter_subscriber_email";
    var $email = $("#subscriber-email");
    var $feedback = $("#subscribe-feedback");
    var $submit = $("#subscribe-submit");
    var submitDefaultText = $submit.text();

    function setSubscribedState(savedEmail) {
        $feedback
            .removeClass("is-error")
            .addClass("is-success")
            .text("Este navegador ja esta inscrito com " + savedEmail + ".");
    }

    var savedSubscriber = localStorage.getItem(STORAGE_KEY);
    if (savedSubscriber) {
        setSubscribedState(savedSubscriber);
    }

    $("#subscribe-form").on("submit", function (event) {
        event.preventDefault();

        var value = $email.val().trim();

        $email.removeClass("is-invalid");
        $email.siblings(".invalid-feedback").text("");
        $feedback.removeClass("is-success is-error").text("");

        if (!isValidEmail(value)) {
            $email.addClass("is-invalid");
            $email.siblings(".invalid-feedback").text("Informe um email valido para assinar.");
            $feedback.addClass("is-error").text("Nao foi possivel concluir. Revise o email informado.");
            return;
        }

        $submit.addClass("loading").prop("disabled", true).text("Enviando...");

        setTimeout(function () {
            localStorage.setItem(STORAGE_KEY, value);
            $feedback.addClass("is-success").text("Inscricao confirmada. A proxima edicao chegara no seu email.");
            $submit.removeClass("loading").prop("disabled", false).text(submitDefaultText);
            $("#subscribe-form")[0].reset();
        }, 700);
    });
});
