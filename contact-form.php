<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Email recipient
    $to = "rkritzar53@gmail.com";  // Replace with your email address
    $subject = "New Contact Form Submission from " . $name;

    // Email body content
    $body = "
    Name: $name\n
    Email: $email\n
    Message:\n
    $message
    ";

    // Email headers
    $headers = "From: $email";

    // Sending email
    if (mail($to, $subject, $body, $headers)) {
        // Redirect to homepage after successful submission
        header("Location: https://bus-army-dude.github.io/bus-army-dude/"); // Redirect to your homepage
        exit;
    } else {
        echo "There was an error submitting your form. Please try again.";
    }
}
?>

<!-- Contact Form HTML -->
<form action="" method="POST" class="contact-form">
    <h2>Contact Me</h2>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4" required></textarea>

    <button type="submit">Send Message</button>
</form>
