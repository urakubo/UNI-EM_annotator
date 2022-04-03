//
//
//
//
//
import { APP } from "./APP";
import { parseCSV, csvFormatter } from "./csv";
import * as hdf5 from 'jsfive';
import { SurfaceTable } from "./SurfaceTable";

// Change the opacity of all surface objects

APP.showDisks = function() {
	var rows = SurfaceTable.searchRows("act", "=",  true);
	for (var i in rows) {
		var id  = rows[i].getData().id;
  		var r   = rows[i].getData().r;
  		var g   = rows[i].getData().g;
  		var b   = rows[i].getData().b;
  		var col = r*256*256+g*256+b*1;
  		APP.addDiskObject(id, col);
  	}

}

APP.hideDisks = function() {
	APP.scene.traverse(function(obj) {
		if ( obj.name.match(/Disks/) ) {
			obj.visible = false;
		}
	});
}


APP.deleteDisks = function() {
	APP.scene.traverse(function(obj) {
		if ( obj.name.match(/Disks/) ) {
			if ( obj != undefined ) {
    			APP.scene.remove(obj);
				obj.geometry.dispose();
				obj.material.dispose();
    			APP.disposeNode(obj);
			}
		}
	});
}


// Add stl objects and a name
APP.addDiskObject = function(id, col) {

	// APP.deleteDiskObject(id)
	// Revive if it already exists.
	/*
	var obj = APP.scene.getObjectByName(name);
	if ( obj != undefined ) {
		obj.visible = true;
		return true;
		}
	*/

	const target_url = location.protocol+"//"+location.host+"/skeleton/whole/" + ( '0000000000' + id ).slice( -10 ) + ".hdf5";
	const filename   = ( '0000000000' + id ).slice( -10 ) + ".hdf5";
	const name       = 'Disks' + ( '0000000000' + id ).slice( -10 );
	
	//
	fetch(target_url)
	  .then(function(response) {
	    return response.arrayBuffer() 
	  })
	  .then(function(buffer) {
	    //
	    //
	    var f = new hdf5.File(buffer, filename);
	    let g1 = f.get('vertices');
	    let g2 = f.get('edges');
	    let g3 = f.get('radiuses');
	    let g4 = f.get('tangents');
	    var data_vertices = g1.value;
	    var data_edges    = g2.value;
	    var data_radiuses = g3.value;
	    var data_tangents = g4.value;
	    
	    data_vertices = splitArray(data_vertices, 3);
	    data_edges    = splitArray(data_edges, 2);
	    data_radiuses = splitArray(data_radiuses, 1);
	    data_tangents = splitArray(data_tangents, 3);
	    
		var i1 = undefined;
		var i2 = undefined;
		var v1 = undefined;
		var v2 = undefined;
		// console.log(data_vertices)
		// console.log('Length vertices: ' + data_vertices.length);
		// console.log('Length edges   : ' + data_edges.length);
		if (isNaN(data_vertices[0][0]) == true) {
			// console.log(data_vertices);
			console.log('No morphological data.');
			return false;
		}

		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({
			color: col,  //0x000000
			linewidth: 3,
			fog:true
		});
		
		
		var disks = new THREE.Group();
		for(var i=0;i< data_edges.length;i++){
			i1 = data_edges[i][0];
			i2 = data_edges[i][1];

			// console.log('Vertices ID: ', i1, i2 );

			v1 = new THREE.Vector3( data_vertices[i1][0], data_vertices[i1][1], data_vertices[i1][2]);
			v2 = new THREE.Vector3( data_vertices[i2][0], data_vertices[i2][1], data_vertices[i2][2]);
			geometry.vertices.push(v1, v2);


			// Create circle object
			var radius = data_radiuses[i1];
			if ( (i1 % 10 == 1) && (radius > 0.01) ) {
				// if ( data_vertices[i1][2] <= APP.BoundingboxZ * 0.05 ) {continue;}
				// if ( data_vertices[i1][1] <= APP.BoundingboxY * 0.05 ) {continue;}
				// if ( data_vertices[i1][0] <= APP.BoundingboxX * 0.05 ) {continue;}
				// if ( data_vertices[i1][2] >= APP.BoundingboxZ * 0.95 ) {continue;}
				// if ( data_vertices[i1][1] >= APP.BoundingboxY * 0.95 ) {continue;}
				// if ( data_vertices[i1][0] >= APP.BoundingboxX * 0.95 ) {continue;}
				// console.log(data_vertices[i1][0], data_vertices[i1][1], data_vertices[i1][2]);
			
				const geometry  = new THREE.CircleGeometry( radius, 20);
				const material  = new THREE.MeshPhongMaterial( {color: col, opacity: 0.3, transparent: true, side: THREE.DoubleSide} );
				const vertice_r = new THREE.Mesh( geometry, material );
				vertice_r.position.set(data_vertices[i1][0], data_vertices[i1][1], data_vertices[i1][2]);
				var theta_z = Math.atan(data_tangents[i1][1] / data_tangents[i1][0])
				var theta_x = Math.acos(data_tangents[i1][2])
				//vertice_r.lookAt(new THREE.Vector3(0, 0, 0));
				//vertice_r.rotation.set(rx,0,rz)
				
				var q = new THREE.Quaternion();
				var axis1 = new THREE.Vector3(0,0,1);
				var axis2 = new THREE.Vector3(data_tangents[i1][0], data_tangents[i1][1], data_tangents[i1][2]);
				q.setFromUnitVectors ( axis1, axis2 ) ;
				vertice_r.quaternion.multiply( q );


				//vertice_r.quaternion.multiply( q );
				disks.add( vertice_r )

				}
			}
		var line = new THREE.LineSegments( geometry, material );
		disks.add( line )

		disks.name = name;
		APP.scene.add( disks );
	    //
	    //
	  });
	}


// Change the color of a skeleton object specified by a name.
APP.changeDiskObjectColor = function(id, col) {
	name = 'Disks' + ( '0000000000' + id ).slice( -10 );
	var obj = APP.scene.getObjectByName(name);
	if ( obj != undefined ) {
		obj.material.color.setHex( col );
		}
	}


// Remove a stl object by the name.
APP.hideDiskObject = function(id) {
	name = 'Disks' + ( '0000000000' + id ).slice( -10 );
	var obj = APP.scene.getObjectByName(name);
	if ( obj != undefined ) {
		// APP.scene.remove(obj);
		obj.visible = false;
		}
	}

APP.deleteDiskObject = function(id) {
	name = 'Disks' + ( '0000000000' + id ).slice( -10 );
	var obj = APP.scene.getObjectByName(name);
	if ( obj != undefined ) {
    		APP.scene.remove(obj);
			obj.geometry.dispose();
			obj.material.dispose();
    		APP.disposeNode(obj);
		}
	}


function splitArray(array, part) {
    var tmp = [];
    for(var i = 0; i < array.length; i += part) {
        tmp.push(array.slice(i, i + part));
    }
    return tmp;
}





