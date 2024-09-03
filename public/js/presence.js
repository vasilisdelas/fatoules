// presence.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch Firebase configuration from the server
    const configResponse = await fetch("/api/firebase-config");
    if (!configResponse.ok) throw new Error("Failed to fetch Firebase config");
    const firebaseConfig = await configResponse.json();

    // Initialize Firebase directly using the fetched config
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app); // Initialize Firestore

    setupSubmitForm(db); // Pass the Firestore `db` instance to the form setup function
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    alert("Failed to initialize Firebase. Check console for details.");
  }
});

function setupSubmitForm(db) {
  const form = document.getElementById("submitForm");

  if (!form) {
    console.error("Form element with ID 'submitForm' not found.");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const toggle = document.getElementById("toggle").checked;

    // Debugging output
    console.log(
      "Form data - First Name:",
      firstName,
      "Last Name:",
      lastName,
      "Toggle:",
      toggle
    );

    try {
      // Ensure form fields are not empty
      if (!firstName || !lastName) {
        alert("Please fill out all required fields.");
        return;
      }

      const docRef = await addDoc(collection(db, "responses"), {
        firstName,
        lastName,
        toggle,
        timestamp: new Date(),
      });

      console.log("Document written with ID:", docRef.id); // Debugging output
      alert("Form submitted successfully!");
      form.reset(); // Optionally reset the form
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
      alert("Error submitting form. Please try again.");
    }
  });
}
