<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Adresse email à laquelle envoyer le message
    $to = "mathis.vangi@gmail.com";
    $subject = "Nouveau message de contact";
    $headers = "From: " . $email;

    // Envoi de l'email
    if (mail($to, $subject, $message, $headers)) {
        echo "Merci pour votre message, " . $name . "!";
    } else {
        echo "Désolé, votre message n'a pas pu être envoyé.";
    }
}
?>
