<?php 
require 'vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
$email_one = $_POST["email_one"];
$email_two = $_POST["email_two"];
$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                          // Enable verbose debug output

$mail->isSMTP();                                        // Set mailer to use SMTP 
$mail->Host = 'smtp.sendgrid.net';             // Specify main/backup SMTP servers 
$mail->SMTPAuth = true;                           // Enable SMTP authentication 
$mail->Username ='';    // SMTP username -- !!!!! VERY IMPORTANT
$mail->Password = '';    // SMTP password  -- !!!!! VERY IMPORTANT
$mail->SMTPSecure = 'tls';                        // Enable TLS/SSL encryption 
$mail->Port = 587;                                      // TCP port to connect to

$mail->From = 'ghost@league_table.scm.azurewebsites.net'; 
$mail->FromName = 'League Table'; 
$mail->addAddress($email_one, 'Player One');     // Add a recipient
$mail->addAddress($email_two, 'Player Two');     // Add a recipient

$mail->WordWrap = 50;                              // Set word wrap to 50 characters 
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'League Table - Fixture Reminder'; 
$mail->Body    = $_POST["message"] . "<p><a href=\"http://willsblogjsleague.azurewebsites.net\">See website here</a></p>";

if(!$mail->send()) { 
    echo 'Message could not be sent.'; 
    echo 'Mailer Error: ' . $mail->ErrorInfo; 
} else { 
    echo 'Message has been sent'; 
}

?>