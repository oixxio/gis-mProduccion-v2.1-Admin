<?php
	header('Content-type: text/html; charset=UTF-8');


function buildTree(array &$elements, $parentId = 0) {
    $branch = array();
    foreach ($elements as &$element) {
        if ($element['parentID'] == $parentId) {
            $children = buildTree($elements, $element['nodeID']);
            if ($children) {
                $element['children'] = $children;
            }
            $branch[$element['nodeID']] = $element;
            unset($element);
        }
    }
    return $branch;
}


	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require 'connDB.php';	
	$conn->query('SET CHARACTER SET utf8');
	$conn->query('SET NAMES utf8');

	$results = [""];
	$i=0;

	$query = '
		SELECT
			t1.id as nodeID,
			t1.nombre as nodeName,
			t1.parent_id as parent_id,
			t1.child_id as child_id,
			t1.parent_id as parentID,
			t1.depth as depth
		FROM sectorTree AS t1
		WHERE t1.depth=1
		UNION
		SELECT
			t2.id as nodeID,
			t2.nombre as nodeName,
			t2.parent_id as parent_id,
			t2.child_id as child_id,
			t1.id as parentID,
			t2.depth as depth
		FROM sectorTree AS t1
		LEFT JOIN sectorTree AS t2 ON t2.parent_id = t1.child_id
		WHERE t1.depth=1 AND t2.depth=2
		UNION
		SELECT
			t2.id as nodeID,
			t2.nombre as nodeName,
			t2.parent_id as parent_id,
			t2.child_id as child_id,
			t1.id as parentID,
			t2.depth as depth
		FROM sectorTree AS t1
		LEFT JOIN sectorTree AS t2 ON t2.parent_id = t1.child_id
		WHERE t1.depth=2 AND t2.depth=3
		UNION
		SELECT
			t2.id as nodeID,
			t2.nombre as nodeName,
			t2.parent_id as parent_id,
			t2.child_id as child_id,
			t1.id as parentID,
			t2.depth as depth
		FROM sectorTree AS t1
		LEFT JOIN sectorTree AS t2 ON t2.parent_id = t1.child_id
		WHERE t1.depth=3 AND t2.depth=4		
		ORDER BY nodeID'; 

	$resultQuery = $conn->query($query);

	while($result = $resultQuery->fetch_assoc()) {				
     	$results[$i] = $result;
     	$i++;
    }

    //Para convertir a estructura arbol
    //$results = buildTree($results);
    $results_tree = $results;

	if ($results_tree != NULL) {
		$json_string = json_encode($results_tree, JSON_PRETTY_PRINT);				
	}else{
		die($conn->error);
	}

	echo $json_string;
