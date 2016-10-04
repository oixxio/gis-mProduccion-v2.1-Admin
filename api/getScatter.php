<?php
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$results = [""];
	$i=0;

	//Para que tome los datos de input del POST desde el front
	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$id = $JSON->id;
	$type = $JSON->type;
	$contratype = '';

	if ($type == 'region') {
		$contratype = 'sector';
	} else {
		$contratype = 'region';
	}

	$query = '
		SELECT
		t1.id,
		t1.'.$contratype.'_id as sub_id,
		t2.nombre,
		t2.color,
		t1.empleo_var,
		t1.empleo_coef_esp,
		t1.empleo_part,
		t1.empleo_var_fake,
		t1.empleo_coef_esp_fake,
		t1.export_var,
		t1.export_coef_esp,
		t1.export_part,
		t1.export_var_fake,
		t1.export_coef_esp_fake
		FROM '.$type.'_scatter as t1
		INNER JOIN '.$contratype.'Tree as t2 ON t1.'.$contratype.'_id = t2.id
		WHERE '.$type.'_id = '.$id.'
		ORDER BY id';

	$resultQuery = $conn->query($query);

	while($result = $resultQuery->fetch_assoc()) {				
     	$results[$i] = $result;
     	$i++;
    }

	if ($results[0] != NULL) {
		$json_string = json_encode($results, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;