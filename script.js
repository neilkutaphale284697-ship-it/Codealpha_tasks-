document.addEventListener("DOMContentLoaded", function () {
    const images = Array.from(document.querySelectorAll(".gallery-image"));

    const filterButtons = document.querySelectorAll("[data-filter]");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const imageCaption = document.getElementById("imageCaption");

    const closeButton = document.querySelector(".close");
    const previousButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let currentIndex = 0;
    let visibleImages = images;

    function updateVisibleImages() {
        visibleImages = images.filter(function (image) {
            return !image.hidden;
        });
    }

    function showImage() {
        if (visibleImages.length === 0) return;

        const image = visibleImages[currentIndex];

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        imageCaption.textContent = image.alt;
    }

    function openLightbox(image) {
        updateVisibleImages();
        currentIndex = visibleImages.indexOf(image);

        if (currentIndex === -1) return;

        showImage();
        lightbox.hidden = false;
    }

    function closeLightbox() {
        lightbox.hidden = true;
    }

    function changeImage(direction) {
        if (visibleImages.length === 0) return;

        currentIndex =
            (currentIndex + direction + visibleImages.length) %
            visibleImages.length;

        showImage();
    }

    // Category filters
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const category = button.dataset.filter;

            images.forEach(function (image) {
                image.hidden =
                    category !== "all" &&
                    image.dataset.category !== category;
            });

            // Highlight the active filter button
            filterButtons.forEach(function (btn) {
                const isActive = btn === button;
                btn.classList.toggle("active", isActive);
                btn.setAttribute("aria-pressed", isActive);
            });

            updateVisibleImages();

            if (!lightbox.hidden) {
                closeLightbox();
            }
        });
    });

    // Open lightbox on image click
    images.forEach(function (image) {
        image.addEventListener("click", function () {
            openLightbox(image);
        });
    });

    // Lightbox controls
    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", function () {
        changeImage(-1);
    });

    nextButton.addEventListener("click", function () {
        changeImage(1);
    });

    // Click the dark background to close
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener("keydown", function (event) {
        if (lightbox.hidden) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowRight") {
            changeImage(1);
        } else if (event.key === "ArrowLeft") {
            changeImage(-1);
        }
    });

    updateVisibleImages();
});
