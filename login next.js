document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");
    
    boxes.forEach((box, index) => {
        box.style.opacity = "0";
        box.style.transform = "translateY(-20px)";
        setTimeout(() => {
            box.style.transition = "opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
            box.style.opacity = "1";
            box.style.transform = "translateY(0)";
        }, index * 300);
    });
});

document.getElementById("bodyTypeCard").addEventListener("click", function() {
    document.getElementById("questionContainer").style.display = "block";
});

function closeContainer() {
    document.getElementById("questionContainer").style.display = "none";
}

function nextQuestion() {
    if (!validateAnswers()) {
        alert("Please answer all questions before proceeding.");
        return;
    }

    currentSet++;
    if (currentSet < questions.length) {
        updateQuestions();
    } else {
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("doneBtn").style.display = "inline-block";
    }
}

let currentSet = 0;
const questions = [
    ["What is your Gender?", "What is your Age?", "What is your SholderWidth?", "What is your ChestWidth?", "What is the size of your stomatch?"],
    ["What is your waist?", "What is the size of your hips?", "What is the length of your arms?", "What is the distance from your waist to your knees?"],
    ["What is the length of your legs?", "What is your total height?", "What is your body fat percentage?"]
];

function openQuestionnaire() {
    document.getElementById("questionContainer").style.display = "block";
    currentSet = 0;
    updateQuestions();
}

function closeQuestion() {
    if (!validateAnswers()) {
        alert("Please answer all questions before finishing.");
        return;
    }
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("nextBtn").style.display = "inline-block";
    document.getElementById("doneBtn").style.display = "none";
    analyzeBodyType(); // <-- Trigger body type analysis when done
}

function updateQuestions() {
    const questionText = document.getElementById("questionText");
    questionText.innerHTML = questions[currentSet]
        .map(q => `<p>${q}</p><input type="text" class="answerInput" placeholder="Enter your answer" required>`)
        .join("");
}

function validateAnswers() {
    let inputs = document.querySelectorAll(".answerInput");
    for (let input of inputs) {
        if (input.value.trim() === "") {
            return false;
        }
    }
    return true;
}


const video = document.getElementById("video");
const canvas = document.getElementById("canvas"); // You can remove if unused now
const capturedImg = document.getElementById("captured-img");
const resultBox = document.getElementById("analysis-result");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");

function openFaceAnalyzePopup() {
  document.getElementById("face-analyze-popup").style.display = "flex";
  startCamera();
  capturedImg.style.display = "none";
  video.style.display = "block";
  captureBtn.style.display = "inline-block";
  retakeBtn.style.display = "none";
  resultBox.innerHTML = "";
}

function closeFaceAnalyzePopup() {
  document.getElementById("face-analyze-popup").style.display = "none";
  stopCamera();
  capturedImg.style.display = "none";
  resultBox.innerHTML = "";
}

function startCameraFromIcon() {
  const video = document.getElementById('video');
  const iconBtn = document.querySelector('.camera-icon-btn');
  const captureBtn = document.getElementById('captureBtn');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.style.display = 'block';
      iconBtn.style.display = 'none';
      captureBtn.style.display = 'inline-block';
    })
    .catch(error => {
      console.error('Camera access error:', error);
    });
}

function captureImage() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const capturedImg = document.getElementById('captured-img');
  capturedImg.src = canvas.toDataURL('image/png');
  capturedImg.style.display = 'block';
  video.style.display = 'none';

  

  const stream = video.srcObject;
  stream.getTracks().forEach(track => track.stop());

  document.getElementById('captureBtn').style.display = 'none';
  document.getElementById('retakeBtn').style.display = 'inline-block';
  document.getElementById('analyzeBtn').style.display = 'inline-block'; // 👈 Show Analyze button
 
const resultBox = document.getElementById('analysis-result');
resultBox.style.display = 'none'; // 👉 इथे लपवा
resultBox.innerHTML = '';         // 👉 reset करा
}

function retakeImage() {
  const capturedImg = document.getElementById('captured-img');
  const iconBtn = document.querySelector('.camera-icon-btn');
  const retakeBtn = document.getElementById('retakeBtn');

  capturedImg.style.display = 'none';
  iconBtn.style.display = 'block';
  retakeBtn.style.display = 'none';
}

function analyzeImage() {
    // तू analysis करतोस इथे, for example placeholder:
    const resultText = "Deficiency: Iron, Vitamin B12";
  
    const resultBox = document.getElementById('analysis-result');
    resultBox.textContent = resultText;
    resultBox.style.display = 'block'; // 👉 आता दिसायला लागेल
  }
  
  function analyzeBodyType() {
    const inputs = Array.from(document.querySelectorAll(".answerInput"));
    const answers = {};
    inputs.forEach((input, index) => {
        answers[`q${index + 1}`] = input.value.trim();
    });

    fetch("http://127.0.0.1:8000", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "http://127.0.0.1:8000"  // ← इथे तुझा API key टाक
        },
        body: JSON.stringify({ answers: answers })
    })
    .then(response => response.json())
    .then(result => {
        const resultBox = document.getElementById("body-type-result");
        resultBox.innerHTML = `
            <strong>Body Type:</strong> ${result.body_type}<br>
            <strong>Ayurvedic Type:</strong> ${result.ayurvedic_type}
        `;
        resultBox.style.display = "block";

        setTimeout(() => {
            document.addEventListener("click", outsideQuestionContainerHandler);
        }, 100);
    })
    .catch(error => {
        console.error("Error calling body type API:", error);
        alert("Something went wrong while detecting body type.");
    });
}

function outsideQuestionContainerHandler(event) {
    const container = document.getElementById("questionContainer");
    const resultBox = document.getElementById("body-type-popup-result");

    if (!container.contains(event.target) && !resultBox.contains(event.target)) {
        container.style.display = "none";
        resultBox.style.display = "none";
        document.removeEventListener("click", outsideQuestionContainerHandler);
    }
}

document.getElementById("closeQuestionBtn").addEventListener("click", function () {
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("body-type-result").style.display = "none";
});