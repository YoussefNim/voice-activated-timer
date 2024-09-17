// Timer display element
const timerDisplay = document.getElementById('timer-display');
const enableAudioButton = document.getElementById('enable-audio');

// Speech Recognition API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert('Speech Recognition API not supported in this browser.');
} else {
  const recognition = new SpeechRecognition();
  
  // Set up the recognition to listen continuously
  recognition.continuous = true;
  recognition.interimResults = false; // Don't show partial results

  // Countdown variables
  let countdownInterval;
  let totalTime = 0;
  let audioEnabled = false; // To track if audio is enabled

  // Load alert sound
  let alertSound;
  function loadAlertSound() {
    alertSound = new Audio('last 4 seconds race-start-beeps.mp3');
    alertSound.preload = 'auto'; // Preload audio file to ensure it's ready
  }

  // Function to play alert sound
  function playAlertSound() {
    if (audioEnabled && alertSound) { // Only play sound if audio is enabled
      alertSound.play().catch(error => {
        console.error('Error playing alert sound:', error);
      });
    }
  }

  // Function to start the countdown
  function startCountdown(seconds) {
    clearInterval(countdownInterval); // Clear any previous countdowns
    totalTime = seconds;
    updateTimerDisplay(totalTime);
    alertSoundPlayed = false; // Reset alert sound status

    countdownInterval = setInterval(() => {
      totalTime--;
      updateTimerDisplay(totalTime);

      if (totalTime === 4 && !alertSoundPlayed && audioEnabled) {
        playAlertSound(); // Play alert sound when 4 seconds are remaining
        alertSoundPlayed = true; // Ensure sound is played only once
      }

      if (totalTime <= 0) {
        clearInterval(countdownInterval);
        timerDisplay.textContent = 'Time\'s up!';
        if (!alertSoundPlayed && audioEnabled) {
          playAlertSound(); // Play alert sound at 0 if not already played
        }
        setTimeout(() => {
          timerDisplay.textContent = 'Listening...'; // Reset display after a short delay
        }, 2000); // Change the delay as needed
      }
    }, 1000);
  }

  // Function to update the timer display
  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // Function to interpret voice commands and start the countdown
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('You said: ', transcript);

    // Extract minutes and seconds from the transcript
    let minutes = 0;
    let seconds = 0;

    // Regular expressions to find minutes and seconds
    const minutesMatch = transcript.match(/(\d+)\s*minute/);
    const secondsMatch = transcript.match(/(\d+)\s*second/);

    if (minutesMatch) {
      minutes = parseInt(minutesMatch[1]);
    }
    if (secondsMatch) {
      seconds = parseInt(secondsMatch[1]);
    }

    // Convert everything to seconds
    let totalSeconds = (minutes * 60) + seconds;

    if (totalSeconds > 0) {
      startCountdown(totalSeconds);
    } else {
      timerDisplay.textContent = 'Could not recognize time';
    }
  };

  // Function to handle errors
  recognition.onerror = function (event) {
    if (event.error === 'no-speech') {
      // Do nothing if no speech detected
      console.log('No speech detected. Listening...');
    } else {
      console.error('Speech recognition error:', event.error);
      timerDisplay.textContent = 'Error in speech recognition';
    }
  };

  // Function to handle end of speech recognition
  recognition.onend = function () {
    console.log('Speech recognition ended, restarting...');
    recognition.start(); // Restart listening automatically
  };

  // Function to enable audio
  enableAudioButton.onclick = function () {
    audioEnabled = true;
    enableAudioButton.style.display = 'none'; // Hide the button after enabling audio
    timerDisplay.textContent = 'Listening... (Audio enabled)';
  };

  // Load the alert sound when the page loads
  loadAlertSound();

  // Start listening as soon as the page loads
  recognition.start();
  timerDisplay.textContent = 'Listening...';
}
