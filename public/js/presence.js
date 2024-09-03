import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyAu4F0kqrekcti0Z8bXa95WAHy_4Tga5Vs",
//   authDomain: "fatoules-102e8.firebaseapp.com",
//   projectId: "fatoules-102e8",
//   storageBucket: "fatoules-102e8.appspot.com",
//   messagingSenderId: "219900667587",
//   appId: "1:219900667587:web:027597cb3267799dfbe476",
//   measurementId: "G-N00MPPRHJZ",
// };

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch Firebase configuration from the server
    const configResponse = await fetch("/api/firebase-config");
    if (!configResponse.ok) throw new Error("Failed to fetch Firebase config");
    const firebaseConfig = await configResponse.json();
    // Initialize Firebase directly using the hardcoded config
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app); // Initialize Firestore

    setupSubmitForm(db); // Pass the Firestore `db` instance to the form setup function
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    console.log("Failed to initialize Firebase from presence.");
  }
});

function setupSubmitForm(db) {
  const form = document.getElementById("submitForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const toggle = document.getElementById("toggle").checked;

    // Debugging output
    console.log(
      "First Name:",
      firstName,
      "Last Name:",
      lastName,
      "Toggle:",
      toggle
    );

    try {
      const docRef = await addDoc(collection(db, "responses"), {
        firstName,
        lastName,
        toggle,
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id); // Added for debugging
      alert("Form submitted successfully!");
      form.reset(); // Optionally reset the form
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
      alert("Error submitting form. Please try again.");
    }
  });
}
