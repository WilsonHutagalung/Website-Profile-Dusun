document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const body = document.body;
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.getElementById('gallery-grid');

    
    // Define category-to-image mapping manually
    const imageCategories = {
        "all": [],
        "Kesehatan": [
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu.jpg", alt: "Posyandu Bunga Rosela" },            
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(1).jpg", alt: "Posyandu Bunga Rosela" },            
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(2).jpg", alt: "Posyandu Bunga Rosela" },            
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(3).jpg", alt: "Posyandu Bunga Rosela" },                       
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(5).jpg", alt: "Posyandu Bunga Rosela" },            
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(6).jpg", alt: "Posyandu Bunga Rosela" },            
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(7).jpg", alt: "Posyandu Bunga Rosela" },            
            { src: "/assets/galeri/Kesehatan/Kegiatan Posyandu(8).jpg", alt: "Posyandu Bunga Rosela" },            
        ],
        "Pariwisata": [
            { src: "/assets/galeri/Pariwisata/Hutan-mangrove.jpg", alt: "Mangrove" }
        ],
        "Lingkungan": [,
        { src: "/assets/galeri/Lingkungan/Penanaman dan Budidaya Mangrove.jpg", alt: "Penanaman dan Budidaya Mangrove" },
        { src: "/assets/galeri/Lingkungan/Penanaman dan Budidaya Mangrove (1).jpg", alt: "Penanaman dan Budidaya Mangrove" },
        ],
        "Olahraga": [
            { src: "/assets/galeri/Olahraga/Bermain Voli.jpg", alt: "Bermain Voli Bersama Warga" },
            { src: "/assets/galeri/Olahraga/Bermain Voli(2).jpg", alt: "Bermain Voli Bersama Warga" }
        ],
        "Pendidikan": [
            { src: "/assets/galeri/Pendidikan/Day 2-MPLS.jpg", alt: "MPLS" },
            { src: "/assets/galeri/Pendidikan/Day 2-MPLS(1).jpg", alt: "MPLS" },
            { src: "/assets/galeri/Pendidikan/Day 2-MPLS(2).jpg", alt: "MPLS" }
        ],
        "Perekonomian": [],
        "Perkebunan": [
            { src: "/assets/galeri/Perkebunan/Kebun RT 21.jpg", alt: "Berkebun di Kebun Pak RT 21" },
            { src: "/assets/galeri/Perkebunan/Kebun RT 21 (1).jpg", alt: "Berkebun di Kebun Pak RT 21" },
            { src: "/assets/galeri/Perkebunan/Kebun RT 21 (2).jpg", alt: "Berkebun di Kebun Pak RT 21" }
        ],
        "SeniBudaya": [], // Changed from "Seni Budaya"
        "Kemasyrakatan": [
            { src: "/assets/galeri/Kemasyrakatan/Makan Bersama.jpg", alt: "Makan Bersama Kader Posyandu dan Kepala Dusun" },
            { src: "/assets/galeri/Kemasyrakatan/Menyambut 10 Muharam.jpg", alt: "Menyambut 10 Muhamaram" },
            { src: "/assets/galeri/Kemasyrakatan/Mencari Kerang Bersama Warga Teluk Lombok.jpg", alt: "Menyambut 10 Muhamaram" },
            { src: "/assets/galeri/Kemasyrakatan/Kerja Bakti.jpg", alt: "Kerja Bakti Bersama Warga" },
            { src: "/assets/galeri/Kemasyrakatan/Kerja Bakti(2).jpg", alt: "Kerja Bakti Bersama Warga" },
            { src: "/assets/galeri/Kemasyrakatan/Kerja Bakti(3).jpg", alt: "Kerja Bakti Bersama Warga" },
            { src: "/assets/galeri/Kemasyrakatan/Kerja Bakti(4).jpg", alt: "Kerja Bakti Bersama Warga" },
            { src: "/assets/galeri/Kemasyrakatan/Kerja Bakti(5).jpg", alt: "Kerja Bakti Bersama Warga" },
        ], // Changed from "Sosial dan Masyarakat"
        "Pemerintah": [],
        "Teknologi": [],
    };

    // Cache for gallery items
    const galleryCache = new Map();
    let currentCategory = null; // Initialize as null to force initial render

    // Preload all images
    function preloadImages() {
        const allImages = Object.values(imageCategories).flat().map(item => item.src || item);
        allImages.forEach(imageSrc => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => console.log(`Image preloaded: ${imageSrc}`);
            img.onerror = () => console.log(`Failed to preload image: ${imageSrc}`);
        });
    }

    // Helper function to extract category from image path
    function getCategoryFromPath(path) {
        const match = path.match(/\/assets\/galeri\/([^\/]+)\//);
        return match ? match[1] : 'unknown';
    }

    // Function to check if a category has images
    function hasImages(category) {
        if (category === 'all') {
            return Object.values(imageCategories).some(images => images.length > 0);
        }
        return imageCategories[category]?.length > 0;
    }

    // Function to create a gallery item
    function createGalleryItem(imageSrc, category, altText) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.setAttribute('data-category', category);

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = altText || `Image from ${category}`;
        img.loading = 'lazy'; // Optimize loading
        img.onload = () => console.log(`Image loaded: ${imageSrc}`);
        img.onerror = () => {
            img.src = '/assets/galeri/placeholder.jpg';
            img.alt = 'Placeholder Image';
            console.log(`Failed to load image: ${imageSrc}, using placeholder`);
        };

        galleryItem.appendChild(img);
        return galleryItem;
    }

    // Function to populate gallery grid
    function populateGallery(category) {
        console.log(`Populating gallery for category: ${category}`); // Debug log
        // Update active button state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        } else {
            console.error(`No button found for category: ${category}`);
        }

        // Fade out gallery grid
        galleryGrid.style.opacity = '0';
        setTimeout(() => {
            // Hide all gallery items and no-images message
            galleryGrid.querySelectorAll('.gallery-item, p').forEach(item => {
                item.style.display = 'none';
            });

            // Show no images message if applicable
            if (!hasImages(category)) {
                let noImagesMessage = galleryGrid.querySelector('p');
                if (!noImagesMessage) {
                    noImagesMessage = document.createElement('p');
                    noImagesMessage.textContent = 'No images found for this category.';
                    galleryGrid.appendChild(noImagesMessage);
                }
                noImagesMessage.style.display = 'block';
                galleryGrid.style.opacity = '1';
                currentCategory = category;
                return;
            }

            // Determine images to show
            let imagesToShow = category === 'all'
                ? Object.values(imageCategories).flat()
                : imageCategories[category] || [];

            // Add images to gallery if not already in cache
            imagesToShow.forEach(image => {
                const imageSrc = image.src || image;
                const altText = image.alt || `Image from ${category}`;
                const cat = category === 'all' ? getCategoryFromPath(imageSrc) : category;

                if (!galleryCache.has(imageSrc)) {
                    const galleryItem = createGalleryItem(imageSrc, cat, altText);
                    galleryCache.set(imageSrc, galleryItem);
                    galleryGrid.appendChild(galleryItem);
                }
                galleryCache.get(imageSrc).style.display = 'block';
            });

            // Fade in gallery grid
            setTimeout(() => {
                galleryGrid.style.opacity = '1';
            }, 10);

            currentCategory = category;
        }, 300); // Match with CSS transition duration
    }

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for same-page anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = button.getAttribute('data-category');
            console.log(`Filter button clicked for category: ${category}`); // Debug log
            populateGallery(category);
        });
    });

    // Preload images and load "all" category by default
    preloadImages();
    populateGallery('all');
});

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 650) { // Ubah 50 sesuai kebutuhan, ini adalah titik scroll dalam pixel
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll to Top Functionality
window.onscroll = function() {
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopButton.classList.add("show");
    } else {
        scrollToTopButton.classList.remove("show");
    }
};

document.getElementById("scrollToTop").addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Header scroll effect
window.addEventListener("scroll", function() {
    const header = document.getElementById("header");
    if (window.pageYOffset > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});