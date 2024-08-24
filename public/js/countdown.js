// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Set the target date and time for the countdown (in UTC)
  const targetDate = new Date("2024-08-24T16:00:00Z");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // If the target date has passed
      document.getElementById("countdown-clock").innerHTML = "We did it !!!";
    } else {
      // Calculate remaining time
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update the HTML element with the countdown
      document.getElementById("countdown-clock").innerHTML = `
          Tik Tak ...<br>
          ${days} ημέρες - ${hours} ώρες - ${minutes} λεπτά - ${seconds} δευτερόλεπτα
        `;
    }
  }

  // Update the countdown every second
  setInterval(updateCountdown, 1000);

  // Initial call to display the countdown immediately
  updateCountdown();
});
