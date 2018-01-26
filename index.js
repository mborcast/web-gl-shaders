var camera;
var scene;
var renderer;
var effect;
var cross;
var controls;
var windowHalfX;
var windowHalfY;
var uniforms;
var percent;
var percentComplete;

init();
animate();

function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.x = 45;
	camera.position.y = 35;
	camera.position.z = 60;
	
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	
	uniforms = {
		time: { type: "f", value: 1.0 },
	};

	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent
	});

	percent = document.getElementById("percent");
	
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			percentComplete = xhr.loaded / xhr.total * 100;
			percent.innerHTML = (Math.round(percentComplete, 2) + '%');

			if (percentComplete >= 100) {			
				document.getElementById("loading").style.display = "none";
			}
		}
	};

	new Audio('./assets/the_pulent_rag.mp3').play();	
	
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('./assets/');
	mtlLoader.load('foobar.mtl', function(materials) {
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('./assets/');
		objLoader.load('foobar.obj', function (object) {
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.material = material;
				}
			});
			scene.add(object );
		}, onProgress, null);
	});
	             
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	effect = new THREE.StereoEffect( renderer );
	effect.setSize( window.innerWidth, window.innerHeight );
	
	document.body.appendChild( renderer.domElement );
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	effect.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
	render();
}

function animate() {
	requestAnimationFrame(animate ); 
	controls.update();
	render();
}

function render() {
	camera.lookAt(scene.position );
	uniforms.time.value += 5.0;
	effect.render( scene, camera );
}