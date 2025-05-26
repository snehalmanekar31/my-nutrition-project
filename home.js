document.addEventListener("DOMContentLoaded", function () {
    const tryRecognitionBtn = document.querySelector(".btn.orange");

    tryRecognitionBtn.addEventListener("click", function () {
        alert("Redirecting to face recognition page...");
        redirectToFaceCapture(); // Redirect function call
    });
});

function redirectToFaceCapture() {
    window.location.href = "face_capture.html";
}
function redirectToLogin() {
    window.location.href = "login.html"; // Login Page ला Redirect
}
async function sendToBackend(imageData) {
    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageData })
        });

        const result = await response.json();
        console.log("Prediction Result:", result);
        document.getElementById("result").innerText = "Deficiency: " + result.nutrient_deficiency;
    } catch (error) {
        console.error("Error connecting to backend:", error);
    }
}

