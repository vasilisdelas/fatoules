// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Function to fetch Firebase configuration from backend
async function getFirebaseConfig() {
  try {
    const configResponse = await fetch("/api/firebase-config");
    if (!configResponse.ok) {
      throw new Error("Failed to load Firebase configuration.");
    }
    return await configResponse.json();
  } catch (error) {
    console.error(error);
    console.log("Failed to load Firebase configuration.");
  }
}

// Lazy loading observer - declare this before use
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src; // Assign the actual image URL
        img.onload = () => img.classList.add("loaded"); // Optional: Add loaded class
        observer.unobserve(img);
      }
    });
  },
  { threshold: 0.1 }
);

// Function to initialize Firebase and display images
async function initializeAndDisplayImages() {
  const firebaseConfig = await getFirebaseConfig();

  if (!firebaseConfig) {
    return; // Exit if config could not be loaded
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  async function displayImages() {
    const galleryDiv = document.getElementById("gallery");
    const storageRef = ref(storage, ""); // Use '' to list all files in root

    try {
      const res = await listAll(storageRef);

      // Display images
      res.items.forEach(async (itemRef, index) => {
        try {
          const img = document.createElement("img");
          if (index < 20) {
            // Load only the first 20 images immediately
            const url = await getDownloadURL(itemRef);
            img.src = url; // Load immediately for the first few images
            img.alt = itemRef.name;
          } else {
            // Lazy load the remaining images
            img.dataset.src = await getDownloadURL(itemRef); // Store URL in data-src
            img.alt = itemRef.name;
            img.classList.add("lazy"); // Optional: Add lazy class for styling
            observer.observe(img); // Lazy load with IntersectionObserver
          }

          // Add click event listener for modal
          img.onclick = function () {
            openModal(img.src || img.dataset.src, itemRef.name);
          };

          galleryDiv.appendChild(img);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  }

  // Call function to display images
  displayImages();
}

// Function to open modal with image
function openModal(src, alt) {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  modal.style.display = "block";
  modalImg.src = src;
  captionText.innerHTML = alt;
}

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
};

// Initialize Firebase and display images
initializeAndDisplayImages();
