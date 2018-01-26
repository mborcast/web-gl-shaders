# Examen parcial 1
## Manuel Francisco Borges Castañeda
### Universidad Panamericana
#### Realidad Virtual
__________________


# Actividad 1 (vertex shaders)

Para esta actividad se elaboró el modelo de un cubo conformado por 1000 esferas de radio unitario. Dicho modelo fue exportado con Maya en formato ```.obj``` para importarlo en nuestra escena. Como requerimiento, se utilizó un fragment shader para transformar el modelo y crear un efecto de movimiento en espiral en dirección del eje Y. Como punto adicional, se modificó el fragment shader con una implementación del modelo de iluminación de Phong para añadir sombras y reflejos en cada una de las esferas del modelo.

![Resultado de la actividad 1. Un cubo formado con esferas unitarias, y procesado con vertex y fragment shaders](/assets/01a.PNG)
> Resultado de la actividad 1. Un cubo formado con esferas unitarias, y procesado con vertex y fragment shaders

# Actividad 2 (fragment shaders)

A continuación se describe cada uno de los pasos para la elaboración del efecto de cubemapping, refracción, y reflexión con fragments shaders con ```THREE.js```

### THREE.Scene
Clase utilizada para inicializar los componentes de una escena, es decir, definir qué objetos graficar y establecer su ubicación en el mundo.

```scene``` es un objeto que encapsula la escena completa.

```sceneCube``` es un objeto que encapsula únicamente el componente de cubemap.

```javascript
scene = new THREE.Scene();
sceneCube = new THREE.Scene();
```

### THREE.PerspectiveCamera
Clase utilizada para simular un modelo de cámara con una proyección de perspectiva. El campo de visión de esta cámara está definido por el rango definido entre los *near y far clipping-planes*, el cual tiene forma de una pirámide truncada.
 
 Para instanciar una cámara eses necesario definir el *FOV, aspect-ratio, near-clipping plane y far-clipping plane*.

```camera``` es el objeto que renderiza los elementos en nuestra escena. Dicho objeto implementa siempre el *aspect-ratio* definido por la ventana del cliente. Asimismo, su posición es definida como fija en el mundo.

```javascript
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 1000 );

camera.position.z = 8;

cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

```

### THREE.ImageUtils

Un conjunto de funciones expuestas al cliente para realizar operaciones relacionadas al uso de imágenes, entre otras. En nuestro caso, hacemos uso de la funcion ```THREE.ImageUtils.loadTextureCube(url)``` para cargar un conjunto de texturas y crear un cubemap. El parámetro formal de ```url``` puede ser sobrecargado con un array de urls. Por tanto, en nuestro programa creamos una estructura de dicho tipo para definir las rutas de aquellas texturas que envolverán el cubemap de la escena.

```javascript
var path = "./assets/";
    var format = '.jpg';
    var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls );
```

### THREE.TrackballControls

Clase que permite establecer control de input sobre un elemento de cámara. Entre sus atributos expone un conjunto de propiedades para definir variables de entrada que regulan el movimiento del componente. En nuestro caso habilitamos la funcionalidad de zoom y posición fija; así como diferentes valores de rapidez para transformar la cámara en el mundo.

```javascript

controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
```

### THREE.AmbientLight

Clase que encapsula un modelo de iluminación ambiental para una escena. Es decir, un tipo de iluminación global y uniforme para todos los objetos en escena. Instanciamos un objeto y lo añadimos a nuestra escena.

```javascript
var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
```
	

### THREE.DirectionalLight

Clase que encapsula un modelo de iluminación direccional para una escena. Este tipo de luz simula aquella producida por el brillo del Sol. Para lograr esto se da por hecho que está situada "en el infinito" y que su influencia está determinada exclusivamente por su valor de rotación. De igual forma, instanciamos dos luces direccionales en dos posiciones: ```v0 = (0,1,1)``` y ```v1 = (0,1,-1)```. Ambos objetos son añadidos a nuestra escena.

```javascript
var directionalLight0 = new THREE.DirectionalLight( 0xaaaaaa );
directionalLight0.position.set( 0, 1, 1 );

// Definimos una luz direccional 1
var directionalLight1 = new THREE.DirectionalLight( 0xaaaaaa );
directionalLight1.position.set( 0, 1, -1 );

scene.add( directionalLight0 );
scene.add( directionalLight1 );
```


### Uniforms

Un uniform es una variable que actúa como constante en un shader. Una aplicación debe proporcionar estas variables al pipeline de graficación para que, de ser requeridas, se encuentren disponibles en cada una de sus etapas. En nuestra escena definimos uniforms para medir el tiempo transcurrido desde la ejecución y valores de refracción y fresnel para el fragment shader; así como el objeto de cubemap en nuestra escena.
```javascript

uniforms = {
    time: { type: "f", value: 1.0 },
    mRefractionRatio: { type: "f", value: 1.02 },
    mFresnelBias: { type: "f", value: 0.1 },
    mFresnelPower: { type: "f", value: 2.0 },
    mFresnelScale: { type: "f", value: 1.0 },
    tCube: { type: "t", value: null }
};
	
uniforms[ "tCube" ].value = textureCube;
```

### THREE.ShaderMaterial
Clase que encapsula el comportamiento de un material en graficación. Este objeto es utilizado para definir los uniforms y los shaders a implementar en nuestros objetos.

```javascript
var material = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: document.getElementById( 'vertexShader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentShader' ).textContent

            } );
```

### THREE.SphereGeometry / THREE.BoxGeometry
Clases para generar geometría de primitivos.

```javascript
var geometry = new THREE.SphereGeometry( 2, 100, 100 );
mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

meshCube = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000 ), materialCube );
sceneCube.add( meshCube );
```

### THREE.Mesh
Clase para generar una malla a partir de la definición de una geometría, y un material.

En nuestra escena creamos mallas tanto para el cubemap, como para una esfera.

```javascript
meshCube = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000 ), materialCube );
sceneCube.add( meshCube );
```

### THREE.WebGLRenderer
Clase que instancia un objeto que renderizará todos los componentes a partir de nuestros objetos de cámara y escena. Como parametros formales requiere un pixel ratio y el tamaño de la ventana del cliente.

```javascript
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.autoClear = false;
```

### Otros
Ajeno a la implementación de THREE.js para graficar una escena, también se definen propiedades para controlar el reajuste de tamaño de pantalla y otros eventos.

## Shaders

### Vertex Shader

En nuestra escena realiza transformaciones sobre cada uno de los vertices que conforman un objeto. En particular las transformaciones simulan la pulsación de un cuerpo y crean deformaciones en la geometría en función de ondas sinoidales. Asimismo, se calculan los vectores de reflexión y refracción para producir el factor de reflexión que simule la superficie de una burbuja.

```glsl
uniform float time;
uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

void main() {

    vec4 v = vec4( position, 1.0 );
    float amplitude = 0.1;
    
    vec3 normalP = 0.1*normalize(normal);
    vec3 newPos = position - sin(time)*normalP;
    v = vec4( newPos, 1.0 );

    v.x += sin(5.0*v.y + time*0.1)*0.1;
    v.y += sin(5.0*v.z + time*0.1)*0.1;
    v.z += sin(5.0*v.x + time*0.1)*0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4( v );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

    vec3 I = worldPosition.xyz - cameraPosition;

    vReflect = reflect( I, worldNormal );
    vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
    vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
    vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
    vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

    gl_Position = projectionMatrix * mvPosition;

}
```
### Fragment Shader

En nuestra escena realiza transformaciones sobre los fragmentos de un objeto en pantalla. Esto quiere decir que regula cómo es la salida de color del mismo, separando cada canal del color que refracta un fragmento y aplicando a su vez la textura del cubemap.

```glsl
uniform samplerCube tCube;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;

void main() {

    vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
    vec4 refractedColor = vec4( 1.0 );

    refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
    refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
    refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

    gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );

}
```

![Resultado de la actividad 2](/assets/02a.PNG)
>Resultado de la actividad 2


# Actividad 3 (estereovisión)


### THREE.StereoEffect

Implementación de una cámara estereoscópica, consistente de dos cámaras independientes, cada una renderizando a viewports independientes para cada lado: Left y Right. Tal como se muestra a continuación:

```javascript
renderer.setScissor( 0, 0, size.width / 2, size.height );
renderer.setViewport( 0, 0, size.width / 2, size.height );
renderer.render( scene, _stereo.cameraL );

renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
renderer.render( scene, _stereo.cameraR );
```

![Resultado de la actividad 3. Un cubo formado con esferas unitarias, y procesado con vertex y fragment shaders visualizado con un efecto de estereoscopía](/assets/03a.PNG)
> Resultado de la actividad 3. Un cubo formado con esferas unitarias, y procesado con vertex y fragment shaders visualizado con un efecto de estereoscopía