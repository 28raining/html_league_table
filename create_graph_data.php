<?php	
function create_graph_data() {
	//scan through all backups and collect the last 20 league positions
	$color_array = array();
	$color_array[0]='rgba(255,99,132,1)';
    $color_array[1]='rgba(54, 162, 235, 1)';
    $color_array[2]='rgba(255, 206, 86, 1)';
    $color_array[3]='rgba(75, 192, 192, 1)';
    $color_array[4]='rgba(153, 102, 255, 1)';
    $color_array[5]='rgba(255, 159, 64, 1)';
	$color_array[6]='rgb(154,16,162 )';
	$color_array[7]='rgb(86,184,87)';
	$color_array[8]='rgb(116,91,246 )';
	$color_array[9]='rgb(247,21,18)';
	$color_array[10]='rgb(23,236,101 )';
	$color_array[11]='rgb(233,231,58 )';
	$color_array[12]='rgb(64,34,32)';
	$color_array[13]='rgb(169,197,245)';
	$color_array[14]='rgb(50,159,245)';
	$color_array[15]='rgb(18,11,73)';
	$color_array[16]='rgb(243,102,24)';
	
	$backup_leagues = scandir("D:\home\site\wwwroot\backup_leagues",SCANDIR_SORT_DESCENDING);
	array_unshift($backup_leagues, "..\league_data.js");
	$position_array = array();
	$data_array = array();
	$array_entries=0;
	$labels_string="";
	$datasets_string = " ";
	$last_place=0;
	//var_dump ($backup_leagues[0]);
	for ($i=0; $i<count($backup_leagues); $i++) {
		$string = file_get_contents("D:\home\site\wwwroot\backup_leagues\\" . $backup_leagues[$i]);
		$temp2 = json_decode($string,true);
		//var_dump( $temp2["players"]);
		$position_change = 0;
		if ($array_entries >0) {	//check if there is a position change
			foreach ($temp2["players"] as $temp3) {
				$temp4=explode(" ",$temp3['competitor']);
				if($position_array[$temp4[0]][$array_entries-1] != $temp3['position']) {
					$position_change=1;
					/*echo ("position change found at $temp3");
					echo "abc=>".$position_array[$temp4[0]][$array_entries-1];
					echo "efg=>".$temp3['position'];
					echo "<br>";
					break;*/
				}
			}
		} else $position_change = 1;
		if ($position_change==1) {
			foreach ($temp2["players"] as $temp3) {
				$temp4=explode(" ",$temp3['competitor']);
				$position_array[$temp4[0]][$array_entries] = $temp3['position'];
				if ($temp3['position'] > $last_place) $last_place=$temp3['position'];
			}
			if($array_entries>0) $data_array[$array_entries]=substr($backup_leagues[$i],6,8);
			$array_entries++;
		}
		if ($array_entries==8) break;
	}
	//var_dump($position_array);
	$player_names=array_keys($position_array);
	
	//increase the length of the arrays so they are all the same
	for ($z=0;$z<count($position_array);$z++) {
		if (count($position_array[$player_names[$z]]) < $array_entries) {
			//echo "we need to add entries for $player_names[$z]";
			$no_new_items=$array_entries-count($position_array[$player_names[$z]]);
			for ($zz=0; $zz<$no_new_items; $zz++) {
				//echo "adding item $zz";
				array_push($position_array[$player_names[$z]],$last_place);
			}
		}
	}
	
	//Create strings from the arrays. These strings are dumped directly onto the wave generator
	$data_array=array_reverse($data_array);
	foreach ($data_array as $label) {
		$labels_string = $labels_string . "\"" . $label ."\",";
	}
	$labels_string = $labels_string ."\"latest\"";

	for ($j=count($position_array)-1; $j>-1; $j--) {
		$datasets_string = $datasets_string."\n\t{\t label: '".$player_names[$j]."',\n\t\t data: [";
		for ($k=0; $k<count($position_array[$player_names[$j]]); $k++) {
		//foreach ($position_array[$player_names[$j]] as $position) {
			$index=count($position_array[$player_names[$j]])-$k-1;
			//echo $index;
			$datasets_string = $datasets_string . $position_array[$player_names[$j]][$index] . ",";	
		}
		$datasets_string = substr($datasets_string,0,-1) . "],
		borderColor: ['$color_array[$j]'],
        borderWidth: 1,
		fill: false\t},";
	}
	$datasets_string = substr($datasets_string,0,-1);
	//echo "heerio";
	//echo $datasets_string;
	return array($datasets_string,$last_place,$labels_string);
	}
?>