// Wait for DOM to be fully loaded before running any code
document.addEventListener("DOMContentLoaded", () => {
  // === CUSTOM CURSOR ===
  // Grabbed the cursor elements from the DOM
  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");

  // Only show custom cursor on devices with a mouse (not on phones/tablets)
  // This media query checks if the device can actually hover
  if (cursorDot && cursorOutline && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    // Track mouse position and update cursor location
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Move the small dot instantly with the mouse
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Animate the outline to follow with a slight delay (smoother effect)
      cursorOutline.animate(
        {
          left: `${posX}px`,
          top: `${posY}px`,
        },
        { duration: 500, fill: "forwards" }
      );
    });
  }

  // Make cursor expand when hovering over interactive elements
  const hoverTriggers = document.querySelectorAll(".hover-trigger, a, button, .tech-card, .project-card, .dot");
  hoverTriggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      document.body.classList.add("hovering");
    });
    trigger.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovering");
    });
  });

  // === EASTER EGG - RETRO MODE ===
  // Fun little surprise - clicking the dot after my name triggers Windows 98 theme
  const easterEggTrigger = document.getElementById("easterEggTrigger");

  if (easterEggTrigger) {
    const activateEasterEgg = () => {
      // Add the retro-mode class to transform the whole site
      document.body.classList.add("retro-mode");

      // Log some fun messages to the console (for fellow developers!)
      console.log(
        "%cWELCOME TO WINDOWS 98",
        "color: #000080; background: #c0c0c0; font-size: 20px; padding: 10px; font-family: 'MS Sans Serif', sans-serif; border: 2px outset #dfdfdf;"
      );
      console.log("%cSystem has entered retro mode...", "color: #000080; background: #ffffff; font-size: 14px; padding: 5px;");

      // Automatically revert back to normal after 10 seconds
      setTimeout(() => {
        document.body.classList.remove("retro-mode");
        console.log("%cReturning to modern mode...", "color: #64ffda; font-size: 14px;");
      }, 10000);
    };

    // Activate on click
    easterEggTrigger.addEventListener("click", activateEasterEgg);

    // Also make it work with keyboard (accessibility!)
    // Pressing Enter or Space will trigger it too
    easterEggTrigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent page from scrolling with spacebar
        activateEasterEgg();
      }
    });
  }

  // === SCROLL ANIMATIONS ===
  // Sections fade in as they come into view
  const sections = document.querySelectorAll(".section");

  // Configure when to trigger the animations
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: "0px 0px -50px 0px", // Start slightly before it enters viewport
  };

  // Using Intersection Observer instead of scroll events for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Section is visible, add the 'visible' class to trigger CSS animation
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Start observing all sections
  sections.forEach((section) => {
    observer.observe(section);
  });

  // === ACTIVE NAV HIGHLIGHTING ===
  // Highlight the current section in the navigation menu as you scroll
  const navLinks = document.querySelectorAll(".nav-menu a");

  const highlightNavigation = () => {
    let current = "";

    // Figure out which section we're currently viewing
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Check if we're in the range of this section (with a 200px buffer)
      if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
        current = section.getAttribute("id");
      }
    });

    // Update the active state on nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  // Use requestAnimationFrame to throttle scroll events (better performance)
  // This prevents the function from running 60+ times per second
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(highlightNavigation);
  });

  // === CONTACT FORM VALIDATION ===
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  // Simple regex to validate email format (not perfect but good enough)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form) {
    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Stop the form from actually submitting (no backend yet)

      let isValid = true;
      const inputs = form.querySelectorAll("input, textarea");

      // Clear any previous feedback
      feedback.textContent = "";

      // Check each input field
      inputs.forEach((input) => {
        const formGroup = input.closest(".form-group");
        formGroup.classList.remove("error", "success");

        // Special validation for email fields
        if (input.type === "email") {
          if (!input.value || !emailRegex.test(input.value)) {
            isValid = false;
            formGroup.classList.add("error");
          } else {
            formGroup.classList.add("success");
          }
        } else {
          // Use HTML5 validation for other fields (required, minlength, etc.)
          if (!input.checkValidity()) {
            isValid = false;
            formGroup.classList.add("error");
          } else {
            formGroup.classList.add("success");
          }
        }
      });

      if (isValid) {
        // Everything looks good!
        feedback.style.color = "#64ffda";
        feedback.textContent = "Message sent successfully! (Simulated)";

        // Log the form data to console (helpful for testing)
        const formData = new FormData(form);
        console.log("Form Data:", Object.fromEntries(formData));

        // Clear the form
        form.reset();

        // Remove success indicators after 3 seconds
        setTimeout(() => {
          inputs.forEach((i) => i.closest(".form-group").classList.remove("success"));
          feedback.textContent = "";
        }, 3000);
      } else {
        // There are errors - show error message
        feedback.style.color = "#ff6b6b";
        feedback.textContent = "⚠ Please fix the errors above.";

        // Focus on the first error field (helps with accessibility)
        const firstError = form.querySelector(".form-group.error input, .form-group.error textarea");
        if (firstError) {
          firstError.focus();
        }
      }
    });

    // Real-time validation as user types
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      // Remove error styling as soon as the input becomes valid
      input.addEventListener("input", () => {
        const formGroup = input.closest(".form-group");

        if (input.type === "email") {
          if (emailRegex.test(input.value)) {
            formGroup.classList.remove("error");
          }
        } else {
          if (input.checkValidity()) {
            formGroup.classList.remove("error");
          }
        }
      });

      // Validate when user leaves the field
      input.addEventListener("blur", () => {
        const formGroup = input.closest(".form-group");

        // Only show error if field has content (don't show error on empty fields until submit)
        if (input.type === "email") {
          if (input.value && !emailRegex.test(input.value)) {
            formGroup.classList.add("error");
          }
        } else {
          if (input.value && !input.checkValidity()) {
            formGroup.classList.add("error");
          }
        }
      });
    });
  }

  // === SMOOTH SCROLLING ===
  // Make internal anchor links scroll smoothly instead of jumping
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Ignore empty hash links (like href="#")
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Smooth scroll to the target section
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update the URL without jumping (nice for sharing links)
        history.pushState(null, null, href);

        // Move focus to the target section (helps screen readers)
        target.setAttribute("tabindex", "-1");
        target.focus();
      }
    });
  });

  // === LAZY LOADING IMAGES ===
  // Load images only when they're about to enter the viewport (saves bandwidth)
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Swap data-src to src to actually load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img); // Stop watching this image
          }
        }
      });
    });

    // Find all images with data-src attribute and start observing them
    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // === FLOATING ACTION BUTTON (FAB) ===
  // Quick contact button that appears after scrolling
  const fab = document.getElementById("fabButton");
  const contactSection = document.getElementById("contact");

  if (fab && contactSection) {
    // Show/hide FAB based on scroll position
    const handleFabVisibility = () => {
      const scrolled = window.pageYOffset;
      const contactTop = contactSection.offsetTop;
      const contactHeight = contactSection.clientHeight;

      // Show FAB after scrolling 300px
      if (scrolled > 300) {
        fab.classList.add("visible");
      } else {
        fab.classList.remove("visible");
      }

      // Hide FAB when in contact section (no need for it there)
      if (scrolled >= contactTop - 100 && scrolled < contactTop + contactHeight) {
        fab.classList.add("hidden");
        fab.classList.remove("visible");
      } else if (scrolled > 300) {
        fab.classList.remove("hidden");
      }
    };

    // Smooth scroll to contact section when FAB is clicked
    fab.addEventListener("click", () => {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Focus on the first input for accessibility
      setTimeout(() => {
        const firstInput = contactSection.querySelector("input, textarea");
        if (firstInput) {
          firstInput.focus();
        }
      }, 800); // Wait for smooth scroll to complete
    });

    // Listen to scroll events with throttling for performance
    let fabScrollTimeout;
    window.addEventListener("scroll", () => {
      if (fabScrollTimeout) {
        window.cancelAnimationFrame(fabScrollTimeout);
      }
      fabScrollTimeout = window.requestAnimationFrame(handleFabVisibility);
    });

    // Check initial state on page load
    handleFabVisibility();
  }

  // === CONSOLE WELCOME MESSAGE ===
  // Little greeting for anyone who opens the dev console :)
  console.log("%c👋 Welcome to Fabio's Portfolio!", "font-size: 20px; font-weight: bold; color: #64ffda;");
  console.log("%cBuilt with HTML5, CSS3, and Vanilla JavaScript", "font-size: 14px; color: #8892b0;");
  console.log("%cBest Practices Applied", "font-size: 14px; color: #64ffda; font-weight: bold;");
});
