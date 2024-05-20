document.addEventListener("DOMContentLoaded", function() {
    // Get the signup form and signup button
    var signupForm = document.getElementById("signupForm");
    var signupButton = document.getElementById("signupButton");
  
    // Add event listener to the signup button
    signupButton.addEventListener("click", function(event) {
      event.preventDefault(); // Prevent the default form submission
  
      // Get form data
      var username = document.getElementById("username").value;
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
  
      // Example: Check if fields are not empty
      if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
        alert("Please fill in all fields");
        return;
      }
  
      // Send data to server (you would typically use AJAX or fetch to send data to the server)
      // For this example, we'll just log the data to the console
      console.log("Username: " + username);
      console.log("Email: " + email);
      console.log("Password: " + password);
  
      // Submit the form
      signupForm.submit();
    });
  });
  