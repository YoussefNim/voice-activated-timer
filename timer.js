// Timer display element
const timerDisplay = document.getElementById('timer-display');

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

  // Function to start the countdown
  function startCountdown(seconds) {
    clearInterval(countdownInterval); // Clear any previous countdowns
    totalTime = seconds;
    updateTimerDisplay(totalTime);

    countdownInterval = setInterval(() => {
      totalTime--;
      updateTimerDisplay(totalTime);

      if (totalTime <= 0) {
        clearInterval(countdownInterval);
        timerDisplay.textContent = 'Time\'s up!';
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

  // Start listening as soon as the page loads
  recognition.start();
  timerDisplay.textContent = 'Listening...';
}
