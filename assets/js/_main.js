/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function(){
   // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);
  // FitVids init
  $("#main").fitVids();

  // init sticky sidebar
  $(".sticky").Stickyfill();

  var stickySideBar = function(){
    var show = $(".author__urls-wrapper button").length === 0 ? $(window).width() > 1024 : !$(".author__urls-wrapper button").is(":visible");
    // console.log("has button: " + $(".author__urls-wrapper button").length === 0);
    // console.log("Window Width: " + windowWidth);
    // console.log("show: " + show);
    //old code was if($(window).width() > 1024)
    if (show) {
      // fix
      Stickyfill.rebuild();
      Stickyfill.init();
      $(".author__urls").show();
    } else {
      // unfix
      Stickyfill.stop();
      $(".author__urls").hide();
    }
  };

  stickySideBar();

  $(window).resize(function(){
    stickySideBar();
  });

  // Follow menu drop down

  $(".author__urls-wrapper button").on("click", function() {
    $(".author__urls").fadeToggle("fast", function() {});
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // init smooth scroll
  $("a").smoothScroll({offset: -20});

  // Resume "request access" modal (opens on /resume/; stays in-page — no mailto unless Formspree is set)
  var $resumeModal = $("#resume-access-dialog");

  function resetResumeModal() {
    var formEl = document.getElementById("resume-request-form");
    if (formEl) {
      formEl.reset();
    }
    $(".resume-access-modal__step--form").removeAttr("hidden");
    $(".resume-access-modal__step--thanks").attr("hidden", "");
    $(".resume-access-modal__copy-block").attr("hidden", "");
    $resumeModal.find("[aria-invalid=true]").removeAttr("aria-invalid");
  }

  function openResumeModal() {
    resetResumeModal();
    $resumeModal.removeAttr("hidden").attr("aria-hidden", "false");
    $("body").addClass("resume-modal-open");
    var $name = $("#resume-req-name");
    if ($name.length) {
      $name.trigger("focus");
    } else {
      $resumeModal.find(".resume-access-modal__close").first().trigger("focus");
    }
  }

  function closeResumeModal() {
    $resumeModal.attr("hidden", "").attr("aria-hidden", "true");
    $("body").removeClass("resume-modal-open");
    resetResumeModal();
    if ($("body").is("[data-resume-autopen]")) {
      var $navResume = $("#site-nav a[href*='/resume']");
      if ($navResume.length) {
        $navResume.first().trigger("focus");
      }
    }
  }

  function showResumeFormspreeSuccess() {
    $(".resume-access-modal__step--form").attr("hidden", "");
    $(".resume-access-modal__step--thanks").removeAttr("hidden");
    $(".resume-access-modal__success-title").text("Request sent");
    $(".resume-access-modal__success-detail").text("Thanks — the owner will get your message by email.");
    $(".resume-access-modal__copy-block").attr("hidden", "");
    $(".resume-access-modal__done").trigger("focus");
  }

  function showResumeCopyFallback(name, email, msg, ownerEmail) {
    $(".resume-access-modal__step--form").attr("hidden", "");
    $(".resume-access-modal__step--thanks").removeAttr("hidden");
    $(".resume-access-modal__success-title").text("Copy your request");
    $(".resume-access-modal__success-detail").html(
      "Paste the text below into your email to <strong>" + ownerEmail + "</strong> (nothing opens automatically)."
    );
    var lines = [];
    if (name || email) {
      lines.push("From: " + (name || "—") + (email ? " <" + email + ">" : ""));
    }
    lines.push(msg.trim());
    $(".resume-access-modal__copy-text").val(lines.join("\n\n"));
    $(".resume-access-modal__copy-block").removeAttr("hidden");
    $(".resume-access-modal__copy-btn").trigger("focus");
  }

  $(document).on("click", "[data-resume-modal-dismiss]", function() {
    closeResumeModal();
  });

  $(document).on("keydown", function(e) {
    if (e.keyCode === 27 && !$resumeModal.is("[hidden]")) {
      closeResumeModal();
    }
  });

  $("#resume-request-form").on("submit", function(e) {
    var $form = $(this);
    var endpoint = ($form.attr("data-formspree") || "").trim();
    var ownerEmail = ($form.attr("data-owner-email") || "").trim();
    var name = $form.find("[name=name]").val() || "";
    var email = $form.find("[name=email]").val() || "";
    var message = $form.find("[name=message]").val() || "";

    if (!message.trim()) {
      e.preventDefault();
      $form.find("[name=message]").attr("aria-invalid", "true").trigger("focus");
      return false;
    }

    if (!endpoint) {
      e.preventDefault();
      showResumeCopyFallback(name, email, message, ownerEmail);
      return false;
    }

    e.preventDefault();
    var fd = new FormData($form[0]);
    fetch(endpoint, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" }
    }).then(function(r) {
      if (r.ok) {
        showResumeFormspreeSuccess();
      } else {
        showResumeCopyFallback(name, email, message, ownerEmail);
      }
    }).catch(function() {
      showResumeCopyFallback(name, email, message, ownerEmail);
    });
    return false;
  });

  $(document).on("click", ".resume-access-modal__copy-btn", function() {
    var ta = document.getElementById("resume-access-copy-text");
    if (!ta) {
      return;
    }
    ta.select();
    ta.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy");
      $(this).text("Copied!");
      var btn = this;
      setTimeout(function() {
        $(btn).text("Copy message");
      }, 2000);
    } catch (err) {}
  });

  if ($("body").is("[data-resume-autopen]")) {
    openResumeModal();
  }

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

});
