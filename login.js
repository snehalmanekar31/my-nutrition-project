function loginUser(event) {
    event.preventDefault(); // ✅ Page Refresh होऊ नये म्हणून

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email && password) {
        window.location.href = "login next.html"; // ✅ यशस्वी लॉगिन -> पुढच्या पानावर जा
    } else {
        alert("कृपया सर्व माहिती भरा!");
    }
}

function resetPassword(event) {
    event.preventDefault(); // ✅ Page refresh होऊ नये म्हणून

    let email = document.getElementById("resetEmail").value;

    if (email) {
        alert("Password reset link sent to " + email);
        window.location.href = "login.html"; // ✅ Reset केल्यावर Login Page वर परत जा
    } else {
        alert("कृपया Email ID टाका!");
    }
}

