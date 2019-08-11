var simple3dloader = (function () {
    var camera, scene, renderer, mesh;
    var loader = new THREE.STLLoader();
    var material = new THREE.MeshPhongMaterial( { color: 0x027be3, specular: 0x000000, shininess: 10 } );

    function init(canvas) {
        scene = new THREE.Scene();
        scene.add( new THREE.AmbientLight( 0x999999 ) );

        camera = new THREE.PerspectiveCamera( 35, 1, 1, 500 );

        // Z is up for objects intended to be 3D printed.

        camera.up.set( 0, 0, 1 );
        camera.position.set( 0, -9, 6 );

        camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );

        scene.add( camera );

        var grid = new THREE.GridHelper( 25, 50, 0xff0000, 0x555555 );
        grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI/180 ) );
        scene.add( grid );

        renderer = new THREE.WebGLRenderer( { antialias: true, canvas:canvas } );
        renderer.setClearColor( 0xffffff );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( 500, 500 );
        document.body.appendChild( renderer.domElement );



        

        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );
        controls.target.set( 0, 1.2, 2 );
        controls.update();
    }

    function setMesh(stl) {
        if(mesh) scene.remove( mesh );

        var geometry = loader.parse(stl);
        
        mesh = new THREE.Mesh( geometry, material );

        mesh.position.set( 0, 0, 0 );
        mesh.rotation.set( 0, 0, 0 );
        mesh.scale.set( .02, .02, .02 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add( mesh );
        render();
    }

    function render() {
        renderer.render( scene, camera );
    }

    return {
        init,
        setMesh
    }
})();