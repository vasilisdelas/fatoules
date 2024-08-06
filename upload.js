import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAu4F0kqrekcti0Z8bXa95WAHy_4Tga5Vs",
  authDomain: "fatoules-102e8.firebaseapp.com",
  projectId: "fatoules-102e8",
  storageBucket: "fatoules-102e8.appspot.com",
  messagingSenderId: "219900667587",
  appId: "1:219900667587:web:027597cb3267799dfbe476",
  measurementId: "G-N00MPPRHJZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const commonPassword = "fatou";

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const fileInput = document.getElementById("photo");
    const files = fileInput.files;

    if (password !== commonPassword) {
      alert("Incorrect password.");
      return;
    }

    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    // Array to hold promises of upload operations
    let uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file.size > 1 * 1024 * 1024) {
        // 1 MB limit
        alert("File size exceeds 1 MB. Resizing image.");
        try {
          file = await resizeImage(file);
        } catch (error) {
          console.error("Error resizing image:", error);
          alert("Error resizing image. Check console for details.");
          return;
        }
      }

      // Push upload promise to the array
      uploadPromises.push(uploadFileToFirebase(file, name));
    }

    // Wait for all uploads to complete
    try {
      await Promise.all(uploadPromises);
      alert("All files uploaded successfully.");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Check console for details.");
    } finally {
      document.getElementById("uploadForm").reset(); // Reset the form after all uploads
    }
  });

async function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 1024; // Maximum dimension size (width or height)
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          function (blob) {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject("Failed to convert canvas to blob.");
            }
          },
          file.type,
          0.7
        ); // Adjust quality for JPEG images
      };
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function uploadFileToFirebase(file, name) {
  console.log("Uploading file:", file);
  const storageRef = ref(storage, name + "_" + file.name);
  return uploadBytes(storageRef, file)
    .then(() => {
      console.log("File uploaded successfully:", file.name);
    })
    .catch((error) => {
      console.error("Error uploading file", error);
      throw error; // Rethrow error to handle it in the submit handler
    });
}
