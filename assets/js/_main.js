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

  // Resume "request access" modal — must run before Stickyfill/sidebar logic (resume page has no .sticky; Stickyfill.init can abort the rest of this file if it runs first).
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

  function resumeDialogEl() {
    return document.getElementById("resume-access-dialog");
  }

  function openResumeModal() {
    var dlg = resumeDialogEl();
    if (!dlg || !$resumeModal.length) {
      return;
    }
    resetResumeModal();
    dlg.hidden = false;
    dlg.removeAttribute("hidden");
    $resumeModal.attr("aria-hidden", "false");
    $("body").addClass("resume-modal-open");
    var $email = $("#resume-req-email");
    if ($email.length) {
      $email.trigger("focus");
    } else {
      $resumeModal.find(".resume-access-modal__close").first().trigger("focus");
    }
  }

  function focusResumeNavLink() {
    var $modalLink = $(".masthead__link--resume-modal");
    if ($modalLink.length) {
      $modalLink.first().trigger("focus");
      return;
    }
    if ($("body").is("[data-resume-autopen]")) {
      var $navResume = $("#site-nav a[href*='/resume']");
      if ($navResume.length) {
        $navResume.first().trigger("focus");
      }
    }
  }

  function closeResumeModal() {
    var dlg = resumeDialogEl();
    if (dlg) {
      dlg.hidden = true;
    }
    $resumeModal.attr("hidden", "").attr("aria-hidden", "true");
    $("body").removeClass("resume-modal-open");
    resetResumeModal();
    focusResumeNavLink();
  }

  function showResumeRequestSuccess(title, detail) {
    $(".resume-access-modal__step--form").attr("hidden", "");
    $(".resume-access-modal__step--thanks").removeAttr("hidden");
    $(".resume-access-modal__success-title").text(title);
    $(".resume-access-modal__success-detail").text(detail);
    $(".resume-access-modal__copy-block").attr("hidden", "");
    $(".resume-access-modal__done").trigger("focus");
  }

  function showResumeFailureCopy(name, email, ownerEmail) {
    $(".resume-access-modal__step--form").attr("hidden", "");
    $(".resume-access-modal__step--thanks").removeAttr("hidden");
    $(".resume-access-modal__success-title").text("One more step");
    $(".resume-access-modal__success-detail").html(
      "Copy the line below and send it to <strong>" + ownerEmail + "</strong>."
    );
    var line = "Résumé request — please reply to: " + email + (name ? " — " + name : "");
    $(".resume-access-modal__copy-text").val(line);
    $(".resume-access-modal__copy-block").removeAttr("hidden");
    $(".resume-access-modal__copy-btn").trigger("focus");
  }

  function openMailtoResumeRequest(name, email, ownerEmail, siteLabel) {
    var body = "Hello,\n\nI’d like a copy of your résumé";
    if (siteLabel) {
      body += " (" + siteLabel + ")";
    }
    body += ".\n\n—\nMy email: " + email;
    if (name) {
      body += "\nName: " + name;
    }
    window.location.href =
      "mailto:" +
      ownerEmail +
      "?subject=" +
      encodeURIComponent("Résumé request") +
      "&body=" +
      encodeURIComponent(body);
    showResumeRequestSuccess(
      "Almost done",
      "Your email app should open — send the message and you’re all set."
    );
  }

  function submitWeb3Forms(accessKey, name, email, siteLabel, messageBody) {
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "Résumé request — " + (siteLabel || "Portfolio"),
        name: name || "Portfolio visitor",
        email: email,
        replyto: email,
        message: messageBody,
        from_name: name || "Résumé request",
        botcheck: false
      })
    }).then(function(r) {
      return r.json().then(function(data) {
        if (r.ok && data && data.success === true) {
          return;
        }
        throw new Error("Web3Forms");
      });
    });
  }

  function submitFormspree(endpoint, email, name, messageBody, siteLabel) {
    var fd = new FormData();
    fd.append("_subject", "Résumé request — " + (siteLabel || "Portfolio"));
    fd.append("email", email);
    fd.append("name", name);
    fd.append("message", messageBody);
    return fetch(endpoint, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" }
    }).then(function(r) {
      if (r.ok) {
        return;
      }
      throw new Error("Formspree");
    });
  }

  $(document).on("click", "[data-resume-modal-dismiss]", function() {
    closeResumeModal();
  });

  $(document).on("click", ".masthead__link--resume-modal", function(e) {
    e.preventDefault();
    openResumeModal();
  });

  $(document).on("keydown", function(e) {
    if (e.keyCode !== 27) {
      return;
    }
    var dlg = resumeDialogEl();
    if (dlg && !dlg.hidden) {
      closeResumeModal();
    }
  });

  $("#resume-request-form").on("submit", function(e) {
    e.preventDefault();
    var $form = $(this);
    var web3Key = ($form.attr("data-web3forms-key") || "").trim();
    var endpoint = ($form.attr("data-formspree") || "").trim();
    var ownerEmail = ($form.attr("data-owner-email") || "").trim();
    var siteLabel = ($form.attr("data-site-label") || "").trim();
    var name = ($form.find("[name=name]").val() || "").trim();
    var email = ($form.find("[name=email]").val() || "").trim();

    if (!email) {
      $form.find("[name=email]").attr("aria-invalid", "true").trigger("focus");
      return false;
    }

    var messageBody =
      "Résumé access request from your portfolio.\n\n" +
      "Work email (reply here): " +
      email +
      "\n" +
      "Name: " +
      (name || "—");

    var $btn = $form.find("[type=submit]");
    var btnLabel = $btn.text();
    $btn.prop("disabled", true).text("Sending…");

    function restoreBtn() {
      $btn.prop("disabled", false).text(btnLabel);
    }

    function ok() {
      restoreBtn();
      showResumeRequestSuccess("Request sent", "Thanks — you’ll get my résumé by email shortly.");
    }

    function fail() {
      restoreBtn();
      if (ownerEmail) {
        showResumeFailureCopy(name, email, ownerEmail);
      } else {
        showResumeRequestSuccess("Something went wrong", "Please try again in a moment.");
      }
    }

    if (web3Key) {
      submitWeb3Forms(web3Key, name, email, siteLabel, messageBody)
        .then(ok)
        .catch(function() {
          if (endpoint) {
            submitFormspree(endpoint, email, name, messageBody, siteLabel)
              .then(ok)
              .catch(function() {
                if (ownerEmail) {
                  restoreBtn();
                  openMailtoResumeRequest(name, email, ownerEmail, siteLabel);
                } else {
                  fail();
                }
              });
          } else if (ownerEmail) {
            restoreBtn();
            openMailtoResumeRequest(name, email, ownerEmail, siteLabel);
          } else {
            fail();
          }
        });
      return false;
    }

    if (endpoint) {
      submitFormspree(endpoint, email, name, messageBody, siteLabel)
        .then(ok)
        .catch(function() {
          if (ownerEmail) {
            openMailtoResumeRequest(name, email, ownerEmail, siteLabel);
            restoreBtn();
          } else {
            fail();
          }
        });
      return false;
    }

    if (ownerEmail) {
      openMailtoResumeRequest(name, email, ownerEmail, siteLabel);
    } else {
      showResumeRequestSuccess("Unavailable", "Résumé requests are not configured.");
    }
    restoreBtn();
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
        $(btn).text("Copy");
      }, 2000);
    } catch (err) {}
  });

  function pathLooksLikeResumePage() {
    var path = (window.location.pathname || "/").replace(/\/+/g, "/");
    return /\/resume\/?$/.test(path);
  }

  if ($("body").is("[data-resume-autopen]") || pathLooksLikeResumePage()) {
    openResumeModal();
  }

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

  // init smooth scroll (skip résumé modal nav — it uses in-page dialog)
  $("a").not(".masthead__link--resume-modal").smoothScroll({offset: -20});

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
