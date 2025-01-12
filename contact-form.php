<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and collect form data
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST["message"]));

    // Check if the fields are empty
    if (empty($name) || empty($email) || empty($message)) {
        echo "Please fill in all fields.";
        exit;
    }

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    // Set up email variables
    $to = "rkritzar53@gmail.com";  // Replace with your email address
    $subject = "New Contact Form Submission";
    $body = "You have received a new message from your website contact form:\n\n".
            "Name: $name\n".
            "Email: $email\n".
            "Message:\n$message";

    $headers = "From: $email";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        header("Location: https://bus-army-dude.github.io/bus-army-dude/#");  // Redirect back to homepage or a confirmation page
        exit;
    } else {
        echo "Sorry, there was an error sending your message. Please try again later.";
    }
}
?>
