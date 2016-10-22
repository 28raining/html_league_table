//Reads data from th JSON and puts into a league table, fixtures table and results table
function fill_table_function(arr, onload_detect) {
	var i;
	player_list="";
	var t_str="<table class='responstable'><tr><th>Position</th><th>Competitor</th><th>Career Games</th><th>Wins</th><th>Losses</th><th>Points</th><th>Most recent appearance</th></tr>"
	for (i=0; i<arr.players.length; i++) {
		t_str = t_str + "<tr><td>"+arr.players[i].position+"</td><td>"+arr.players[i].competitor+"</td><td>"+arr.players[i].career_games+"</td><td>"+arr.players[i].wins+"</td><td>"+arr.players[i].losses+"</td><td>"+arr.players[i].points+"</td><td>"+arr.players[i].most_recent_appearance+"</td></tr>";
		if (lowest_position <= parseInt(arr.players[i].position)) {
			lowest_position = parseInt(arr.players[i].position)+1;
		}
		player_list = player_list + "<option>" +arr.players[i].competitor + "</option>";
	}
	t_str = t_str + "</table>";
	document.getElementById("specialtable").innerHTML = t_str;
	document.getElementById("player_1").innerHTML = player_list;
	document.getElementById("player_2").innerHTML = player_list;
	document.getElementById("remove_playersname").innerHTML = player_list;
	
	var f_str="<table class='responstable'><tr><th>Player 1</th><th>Score</th><th></th><th>Score</th><th>Player 2</th><th>Due Date</th><th></th></tr>"
	for (i=0; i<arr.fixtures.length; i++) {
		f_str = f_str + "<tr><td>"+arr.fixtures[i].player_1+"</td><td><input type='text' maxlength='1' id="+arr.fixtures[i].id+"_1></input></td><td>-</td><td><input type='text' maxlength='1' id="+arr.fixtures[i].id+"_2></input></td><td>"+arr.fixtures[i].player_2+"</td><td>"+arr.fixtures[i].due_date+"</td><td><input type='submit' value='Add score' onclick='addScore("+arr.fixtures[i].id+")'></input><input type='submit' value='Send Email' onclick='send_email("+arr.fixtures[i].id+")'></input><input type='submit' value='Delete Fixture' onclick='delete_fixture("+arr.fixtures[i].id+")'></input></td></tr>";
		if (lowest_id <= parseInt(arr.fixtures[i].id)) {
			lowest_id=parseInt(arr.fixtures[i].id)+1;
		}
	}
	document.getElementById("fixtures_table").innerHTML = f_str;
	
	var r_str="<table class='responstable'><tr><th>Player 1</th><th>Score</th><th></th><th>Score</th><th>Player 2</th><th>Date</th><th></th></tr>"
	for (i=arr.results.length-1; i>=0; i--) {
		r_str = r_str + "<tr><td>"+arr.results[i].player_1+"</td><td>"+arr.results[i].score_1+"</td><td>-</td><td>"+arr.results[i].score_2+"</td><td>"+arr.results[i].player_2+"</td><td>"+arr.results[i].date+"</td><td><input type='submit' value='Remove Fixture And Undo Points' onclick='removeFixture("+arr.results[i].id+")'></input></td></tr>";
		if (lowest_result_id <= parseInt(arr.results[i].id)) {
			lowest_result_id = parseInt(arr.results[i].id)+1;
		}
	}
	document.getElementById("results_table").innerHTML = r_str;
	
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("?");
    var pair = String(vars).split("=");
	if ((pair[0]=="admin") && (pair[1]=="true")) {
		is_admin=1;
	}

	
	/*CREATE BACKUP AND CREATE NEW FILE IF ANY CHANGES BEEN MADE*/
	/*note that the league is only read on page-open, backups and an updated league table are created here*/
    if(onload_detect=='1') {
    } else {
        // window.alert("creating a backup");
        $.ajax({
        type : "POST",
        url : "save_the_json.php",
        data : {
            json : JSON.stringify(arr)
        }
        });
    }
}

//when a player is removed this function ensures the positions are re-aligned
function re_organise_positions() {
    var lowest_pos=100;
    // window.alert(global_arr);
    // window.alert(global_arr.players)
    for (j=1; j<=global_arr["players"].length; j++) {
        lowest_pos=100;
        for (i=0; i<global_arr["players"].length; i++) {
            if ((global_arr.players[i].position < lowest_pos) && (global_arr.players[i].position >= j)) {
                player_num = i;
                lowest_pos = global_arr.players[i].position;
            }
        }
        global_arr.players[player_num].position = j;
    }
}

//Adds a new player
function addPlayer() {
	//var temp_array = [lowest_position,document.getElementById("playersname").value,0,0,0];
	var temp_array = 	{
		"position": lowest_position,
		"competitor": document.getElementById("playersname").value,
		"email": document.getElementById("playersemail").value,
		"career_games": "0",
		"wins": "0",
		"losses": "0",
		"points": "0",
		"most_recent_appearance": "N/A"
	};
	document.getElementById("playersname").value="";
	global_arr["players"].push(temp_array);
	fill_table_function(global_arr);
	return false;
}

//Removes a player
function removePlayer() {
	//var temp_array = [lowest_position,document.getElementById("playersname").value,0,0,0];
	if (is_admin==0) {
		window.alert("you must be admin to do this, see bottom of page");
	} else {
		var remove_name = document.getElementById("remove_playersname").value;
		for (i=0; i<global_arr["players"].length; i++) {
			if (global_arr.players[i].competitor == remove_name) {
				global_arr.players.splice(i,1);
			}
		}
		for (i=0; i<global_arr.fixtures.length; i++) {
			if ((global_arr.fixtures[i].player_1 == remove_name) || (global_arr.fixtures[i].player_2 == remove_name)) {
				global_arr.fixtures.splice(i,1);
			}
		}
        re_organise_positions()
		fill_table_function(global_arr);
	}
	return false;
}

//removes a result and undoes the points obtained in that game
function removeFixture(id) {
	if (is_admin==0) {
		window.alert("you must be admin to do this, see bottom of page");
	} else {
	for (i=0; i<global_arr.results.length; i++) {
		if (global_arr.results[i].id == id) {
			for(j=0; j<global_arr.players.length; j++) {
				if (global_arr.players[j].competitor == global_arr.results[i].player_1) {
					global_arr.players[j].career_games = parseInt(global_arr.players[j].career_games) - 1;
					if (parseInt(global_arr.results[i].score_1) > parseInt(global_arr.results[i].score_2)) {
						global_arr.players[j].wins = parseInt(global_arr.players[j].wins) - 1;
					} else {
						global_arr.players[j].losses = parseInt(global_arr.players[j].losses) - 1;
					}
				} else if (global_arr.players[j].competitor == global_arr.results[i].player_2) {
					global_arr.players[j].career_games = parseInt(global_arr.players[j].career_games) - 1;
					if (parseInt(global_arr.results[i].score_1) < parseInt(global_arr.results[i].score_2)) {
						global_arr.players[j].wins = parseInt(global_arr.players[j].wins) - 1;
					} else {
						global_arr.players[j].losses = parseInt(global_arr.players[j].losses) - 1;
					}
				}
			}
			global_arr.results.splice(i,1);
		}
	}
	fill_table_function(global_arr);
	}
	return false;
}

//removes a future fixture
function delete_fixture(id) {
	if (is_admin==0) {
		window.alert("you must be admin to do this, see bottom of page");
	} else {
	for (i=0; i<global_arr.fixtures.length; i++) {
		if (global_arr.fixtures[i].id == id) {
			global_arr.fixtures.splice(i,1);
		}
	}
	fill_table_function(global_arr);
	}
	return false;
}

//Creates an entry for a future fixture between two players/teams
function addFixture() {
	//var temp_array = [lowest_position,document.getElementById("playersname").value,0,0,0];
	var someDate = new Date();
var numberOfDaysToAdd = 6;
someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
	//window.alert(nextWeek.toDateString());
	var temp_array = 	{
		"player_1": document.getElementById("player_1").value,
		"player_2": document.getElementById("player_2").value,
		"id": lowest_id,
		"due_date": someDate.toDateString()
	};
	global_arr["fixtures"].push(temp_array);
	fill_table_function(global_arr);
	return false;
}

//Sens an email to both players
function send_email(id) {
	for (i=0; i<global_arr.fixtures.length; i++) {
		if (global_arr.fixtures[i].id == id) {
			var temp_player1=global_arr.fixtures[i].player_1;
			var temp_player2=global_arr.fixtures[i].player_2;
			for (j=0; j<global_arr.players.length; j++) {
				if (global_arr.players[j].competitor==temp_player1) {
					var player1_email = global_arr.players[j].email;
				}
				if (global_arr.players[j].competitor==temp_player2) {
					var player2_email = global_arr.players[j].email;
				}
			}
		}
	}
	//window.alert(player1_email + " " + player2_email + " " + temp_player1 + " " + temp_player2 + global_arr.players.length);
	var temp_message = prompt("Enter a little message?", "Get on the table!");
	$.post("send_the_email.php", //Required URL of the page on server
		{ // Data Sending With Request To Server
			email_one:player1_email,
			email_two:player2_email,
			message:temp_message
	});
}

//commits a score from a future fixture into the results and points tally
//This function also determines how the league table is ordered
function addScore(id) {
	var m_names = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December");
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	dateFormat = curr_date + "-" + m_names[curr_month] + "-" + curr_year;
	//var temp_array = [lowest_position,document.getElementById("playersname").value,0,0,0];
	for (i=0; i<=global_arr.fixtures.length; i++) {
        // window.alert("trying here");
        // window.alert(global_arr.fixtures);
		if (parseInt(global_arr.fixtures[i].id) == id) {
			var temp_array = 	{
				"player_1": global_arr.fixtures[i].player_1,
				"player_2": global_arr.fixtures[i].player_2,
				"date": dateFormat,
				"score_1": document.getElementById(id + "_1").value,
				"score_2": document.getElementById(id + "_2").value,
				"id":lowest_result_id
			};
			lowest_result_id++;
			global_arr["results"].push(temp_array);
			var winner = (document.getElementById(id + "_1").value > document.getElementById(id + "_2").value) ? global_arr.fixtures[i].player_1 : global_arr.fixtures[i].player_2;
			var loser = (document.getElementById(id + "_1").value > document.getElementById(id + "_2").value) ? global_arr.fixtures[i].player_2 : global_arr.fixtures[i].player_1;
			for (j=0; j<global_arr.players.length; j++) {
				if (global_arr.players[j].competitor == winner) {
					global_arr.players[j].wins = parseInt(global_arr.players[j].wins) + 1;
					global_arr.players[j].career_games = parseInt(global_arr.players[j].career_games) + 1;
					global_arr.players[j].most_recent_appearance = dateFormat;
					var player_winner = j;
				}
				if (global_arr.players[j].competitor == loser) {
					global_arr.players[j].losses = parseInt(global_arr.players[j].losses) + 1;
					global_arr.players[j].career_games = parseInt(global_arr.players[j].career_games) + 1;
					global_arr.players[j].most_recent_appearance = dateFormat;
					var player_loser = j;
				}			
			}
            // window.alert("splicing");
			global_arr.fixtures.splice(i,1);
		
		/*THE FOLLOWING CODE RE-ORDERS POSITIONS USING A WINNER-TAKES-POSITION METHOD*/
		//manipulate positions using the position-swap league version
		var winning_position = parseInt(global_arr.players[player_winner].position);
		var losing_position = parseInt(global_arr.players[player_loser].position);
		if ((winning_position > losing_position) && ((winning_position - losing_position) < 4)) {
			//The winner has earnt a position jump by beating somebody within 3 places above them
			for (x=0; x<global_arr.players.length; x++) {
				if (parseInt(global_arr.players[x].position) > winning_position) {
				} else if (parseInt(global_arr.players[x].position) >= losing_position) {
					global_arr.players[x].position = parseInt(global_arr.players[x].position) + 1;
				}
			}
			global_arr.players[player_winner].position = losing_position;
		}
		
		global_arr.players.sort(function(a,b){return parseInt(a.position) - parseInt(b.position)}); 
        break;
		}
		/*END OF RE-ORDERING CODE*/
	}
	fill_table_function(global_arr);
	return false;
}