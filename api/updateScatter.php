<?php 
	header('Content-type: text/html; charset=UTF-8');

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$results = [""];

	//Para que tome los datos de input del POST desde el front
	$rawJSON = file_get_contents('php://input');
	$JSON = json_decode($rawJSON);
	$data = $JSON->data;
	$type = $JSON->type;

	$sqlPrep = $conn->prepare("update region_scatter set 
				empleo_var = ?,
				empleo_coef_esp = ?,
				empleo_part = ?,
				export_var = ?,
				export_coef_esp = ?,
				export_part = ?
				where id = ?");
	$sqlPrep->bind_param("sssssss",$data->empleo_var,
								$data->empleo_part,
								$data->empleo_coef_esp,
								$data->export_var,
								$data->export_part,
								$data->export_coef_esp,
								$data->id);
	$status = $sqlPrep->execute();

	if ($sqlPrep->affected_rows != 0) {
		echo "200";
	}else{
		die($conn->error);
	}
?>