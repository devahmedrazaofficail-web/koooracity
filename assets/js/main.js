/* ============================================================
   كورة سيتي — Kora City
   Vanilla JS: mobile nav, league filter, contact form validation.
   No libraries. No backend calls.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("mainNav");
  var scrim = document.querySelector(".nav-scrim");

  function openNav() {
    nav.classList.add("open");
    if (scrim) scrim.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    nav.classList.remove("open");
    if (scrim) scrim.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.contains("open") ? closeNav() : openNav();
    });
    if (scrim) scrim.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---------- League filter (matches page) ---------- */
  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var buttons = filterBar.querySelectorAll(".filter-btn");
    var groups = document.querySelectorAll("[data-league-group]");
    var emptyMsg = document.getElementById("noMatchesMsg");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        var f = btn.getAttribute("data-filter");
        var visibleGroups = 0;
        groups.forEach(function (g) {
          var show = f === "all" || g.getAttribute("data-league-group") === f;
          g.style.display = show ? "" : "none";
          if (show) visibleGroups++;
        });
        if (emptyMsg) emptyMsg.style.display = visibleGroups ? "none" : "";
      });
    });
  }

  /* ---------- Contact form validation ----------
     Static site: no backend. On valid submit we open the visitor's
     email app (mailto) with the message pre-filled. */
  var form = document.getElementById("contactForm");
  if (form) {
    var fields = {
      name: {
        input: document.getElementById("cf-name"),
        test: function (v) { return v.trim().length >= 2; },
        msg: "فضلاً أدخل الاسم."
      },
      email: {
        input: document.getElementById("cf-email"),
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
        msg: "فضلاً أدخل بريداً إلكترونياً صحيحاً."
      },
      subject: {
        input: document.getElementById("cf-subject"),
        test: function (v) { return v.trim().length >= 3; },
        msg: "فضلاً أدخل موضوع الرسالة."
      },
      message: {
        input: document.getElementById("cf-message"),
        test: function (v) { return v.trim().length >= 10; },
        msg: "الرسالة قصيرة جداً (10 أحرف على الأقل)."
      }
    };

    function validateField(key) {
      var f = fields[key];
      var wrap = f.input.closest(".field");
      var ok = f.test(f.input.value);
      wrap.classList.toggle("invalid", !ok);
      var err = wrap.querySelector(".error-msg");
      if (err && !ok) err.textContent = f.msg;
      return ok;
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener("blur", function () { validateField(key); });
      fields[key].input.addEventListener("input", function () {
        this.closest(".field").classList.remove("invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = Object.keys(fields).map(validateField).every(Boolean);
      var status = document.getElementById("formStatus");
      if (!allOk) {
        status.textContent = "فضلاً صحّح الحقول المحددة ثم أعد المحاولة.";
        status.className = "notice notice-warn";
        status.style.display = "";
        status.setAttribute("role", "alert");
        return;
      }
      var to = "info@koracity.com";
      var subject = encodeURIComponent("[كورة سيتي] " + fields.subject.input.value.trim());
      var body = encodeURIComponent(
        "الاسم: " + fields.name.input.value.trim() + "\n" +
        "البريد: " + fields.email.input.value.trim() + "\n\n" +
        fields.message.input.value.trim()
      );
      status.textContent = "شكراً لك! سيُفتح تطبيق البريد لديك لإرسال الرسالة.";
      status.className = "notice notice-info";
      status.style.display = "";
      status.setAttribute("role", "status");
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      form.reset();
    });
  }
})();
