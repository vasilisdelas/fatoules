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
    alert("Failed to load Firebase configuration.");
  }
}

// Function to initialize Firebase and display images
async function initializeAndDisplayImages() {
  const firebaseConfig = await getFirebaseConfig();

  if (!firebaseConfig) {
    return; // Exit if config could not be loaded
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  // Function to fetch and display images
  async function displayImages() {
    console.log("Fetching images...");
    const galleryDiv = document.getElementById("gallery");
    const storageRef = ref(storage, ""); // Use '' to list all files in root

    try {
      const res = await listAll(storageRef);
      console.log("Files listed:", res.items.length);
      res.items.forEach(async (itemRef) => {
        try {
          const url = await getDownloadURL(itemRef);
          console.log("Image URL fetched:", url);
          const img = document.createElement("img");
          img.src = url;
          img.alt = itemRef.name;
          img.onclick = function () {
            openModal(url, itemRef.name);
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
