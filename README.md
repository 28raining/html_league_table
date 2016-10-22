# html_league_table
HTML / JavaScript based League Table

EXAMPLE: http://willsblogjsleague.azurewebsites.net/

#To use this website

1 - Downlaod all files and extract folder into the same directory

2 - Note that all league data is stored inside league_data.js in a JSON format. Every time there is a change then a backup is placed in the backup_leagues folder. Therefore you an't accidently loose all your data!

3 - If you will using an alternative language than PHP to save your data then search and replace any PHP code - note that sending an email uses PHP mailer but you should be able to replace it with a different mailer

4 - modify send_the_email.php to include an active SMTP server. If you don't have one then I recommend using SendGrid, all you will have to do then is put your Username and Password into the send_the_email.php (I was using SendGrid)

5 - (more involved) if your league table will be points based rather than winner-takes-position based then the function 
addScore() inside league_functions.js must be edited between the stated comments. This is something I could do if there is a request.

Good luck - and please send me a question if you get stuck!!

Will
