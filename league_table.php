<html>
<head>
 <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1"> 
<link href="main.css" rel="stylesheet" type="text/css">
<!--League table data is store in this file-->
<?php
	 $str = file_get_contents('league_data.js');
     echo "<script>var global_arr = ".$str."</script>";
	 include 'create_graph_data.php';
	 $chart_data=create_graph_data();
?>

<script src="jquery/jquery-2.2.3.min.js"></script>
<script src="Chart.js"></script>
<script> //Global Variables
var lowest_position=1;
var lowest_id=1;
var lowest_result_id=1;
var player_list="";
var is_admin=0
</script>
<script type="text/javascript" src="league_functions.js"></script>


<title>Table tennis league table</title>
</head>
<body onload="re_organise_positions();fill_table_function(global_arr,1)">
<h1>Table Tennis Upcoming fixtures <span>Swindon Silicon Systems</span></h1>
<p>All fixtures are a best of 3</p>
<p>You may only challenge players 3 places ahead of you</p>

<div id="fixtures_table">
</div>
<h1>Table Tennis League Table</h1>
<canvas id="myChart2" width="300" height="65"></canvas>
<div id="specialtable">
</div>

<form onSubmit="return addFixture();">
<table><tr><td>Add a new fixture:</td><td><select id="player_1" type="select" maxlength="30"></select></td><td><select id="player_2" type="select" maxlength="30"></select></td><td><input type="submit" value="ADD"></input></td></tr></table>
</form>

<form onSubmit="return addPlayer();">
<table><tr><td>Add a new player. Name:</td><td><input id="playersname" type="text" maxlength="30"></input></td><td>Email: <input id="playersemail" type="text" maxlength="50"></input></td><td><input type="submit" value="ADD"></input></td></tr></table>
</form>

<form onSubmit="return removePlayer();">
<table><tr><td>Remove a player:</td><td><select id="remove_playersname" type="select" maxlength="30"></select></td><td><input type="submit" value="Remove Player"></input></td></tr></table>
</form>
<p> </p>

<h3>Previous Results</h3>
<div id="results_table">
</div>

<p>To aceess some admin stuff put this at the end of your URL: ?admin=true</p>
  
</body>


<!-- BELOW IS CODE TO GENERATE THE GRAPH -->

<script>
var ctx = document.getElementById("myChart2");
var myChart = new Chart(ctx, {
    type: 'line',
	options: {
        responsive: true,
		backgroundcolor:'white',
		title: {
            display: true,
            text: 'League Postion vs Time'
        },
		legend: {
			position: 'right',
			display: true
		},
		scales: {
			xAxes : [{
				gridLines : {
					display: false
				}
			}],
			yAxes : [{
				gridLines : {
					display: false
				},
				ticks: {
					stepsize: 1,
				 	maxTicksLimit: <? echo $chart_data[1]; ?>
				}
			}]
		}
    },
    data: {
        labels: [<?php echo $chart_data[2]; ?>],
        datasets: [
		<?php echo $chart_data[0]; ?>
		]
    },
});
</script>

<!-- END OF GRAPH GENERATING CODE -->

</html>