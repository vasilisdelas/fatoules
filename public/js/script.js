const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach((item) =>
  item.addEventListener("click", function () {
    this.classList.toggle("collapsible--expanded");
  })
);

document.addEventListener("DOMContentLoaded", function () {
  const navbarLinks = document.querySelectorAll(".navbar a");
  const offset = 60;

  navbarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Check if the link is an internal link (starts with "#")
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});

document.getElementById("menu-toggle").addEventListener("click", function (e) {
  e.preventDefault();
  const navbarUl = document.querySelector(".navbar__ul");
  navbarUl.classList.toggle("open");
});

const resetForm = () => {
  setTimeout(() => {
    const form =
      document.getElementById("uploadForm") ||
      document.getElementById("submitForm");
    if (form) {
      form.reset();
    } else {
      console.warn("Form with ID 'uploadForm' or 'submitForm' not found.");
    }
  }, 1000);
};

resetForm();
