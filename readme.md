# Examen parcial 1 - WebGL

> Manuel Francisco Borges Castañeda

> Universidad Panamericana


## Actividades

### Actividad 1 (vertex shaders)

Para esta actividad se elaboró el modelo de un cubo conformado por 1000 esferas de radio unitario. Dicho modelo fue exportado con Maya en formato ```.obj``` para importarlo en nuestra escena. Como requerimiento, se utilizó un fragment shader para transformar el modelo y crear un efecto de movimiento en espiral en dirección del eje Y. Como punto adicional, se modificó el fragment shader con una implementación del modelo de iluminación de Phong para añadir sombras y reflejos en cada una de las esferas del modelo.

![Resultado de la actividad 1. Un cubo formado con esferas unitarias, y procesado con vertex y fragment shaders](./assets/01a.png)

# Actividad 2 (fragment shaders)

A continuación se describe cada uno de los pasos para la elaboración del efecto de cubemapping, refracción, y reflexión con fragments shaders con ```THREE.js```

### THREE.Scene
Clase utilizada para inicializar los componentes de una escena, es decir, definir qué objetos graficar y establecer su ubicación en el mundo.

```scene``` es un objeto que encapsula la escena completa.

```sceneCube``` es un objeto que encapsula únicamente el componente de cubemap.

### THREE.PerspectiveCamera
Clase utilizada para simular un modelo de cámara con una proyección de perspectiva. El campo de visión de esta cámara está definido por el rango definido entre los *near y far clipping-planes*, el cual tiene forma de una pirámide truncada.
 
 Para instanciar una cámara eses necesario definir el *FOV, aspect-ratio, near-clipping plane y far-clipping plane*.

```camera``` es el objeto que renderiza los elementos en nuestra escena. Dicho objeto implementa siempre el *aspect-ratio* definido por la ventana del cliente. Asimismo, su posición es definida como fija en el mundo.

### THREE.ImageUtils

Un conjunto de funciones expuestas al cliente para realizar operaciones relacionadas al uso de imágenes, entre otras. En nuestro caso, hacemos uso de la funcion ```THREE.ImageUtils.loadTextureCube(url)``` para cargar un conjunto de texturas y crear un cubemap. El parámetro formal de ```url``` puede ser sobrecargado con un array de urls. Por tanto, en nuestro programa creamos una estructura de dicho tipo para definir las rutas de aquellas texturas que envolverán el cubemap de la escena.

### THREE.TrackballControls

Clase que permite establecer control de input sobre un elemento de cámara. Entre sus atributos expone un conjunto de propiedades para definir variables de entrada que regulan el movimiento del componente. En nuestro caso habilitamos la funcionalidad de zoom y posición fija; así como diferentes valores de rapidez para transformar la cámara en el mundo.

### THREE.AmbientLight

Clase que encapsula un modelo de iluminación ambiental para una escena. Es decir, un tipo de iluminación global y uniforme para todos los objetos en escena. Instanciamos un objeto y lo añadimos a nuestra escena.

### THREE.DirectionalLight

Clase que encapsula un modelo de iluminación direccional para una escena. Este tipo de luz simula aquella producida por el brillo del Sol. Para lograr esto se da por hecho que está situada "en el infinito" y que su influencia está determinada exclusivamente por su valor de rotación. De igual forma, instanciamos dos luces direccionales en dos posiciones: ```v0 = (0,1,1)``` y ```v1 = (0,1,-1)```. Ambos objetos son añadidos a nuestra escena.

### Uniforms

Un uniform es una variable que actúa como constante en un shader. Una aplicación debe proporcionar estas variables al pipeline de graficación para que, de ser requeridas, se encuentren disponibles en cada una de sus etapas. En nuestra escena definimos uniforms para medir el tiempo transcurrido desde la ejecución y valores de refracción y fresnel para el fragment shader; así como el objeto de cubemap en nuestra escena.

### THREE.ShaderMaterial
Clase que encapsula el comportamiento de un material en graficación. Este objeto es utilizado para definir los uniforms y los shaders a implementar en nuestros objetos.

### THREE.SphereGeometry / THREE.BoxGeometry
Clases para generar geometría de primitivos.

### THREE.Mesh
Clase para generar una malla a partir de la definición de una geometría, y un material.

En nuestra escena creamos mallas tanto para el cubemap, como para una esfera.

### THREE.WebGLRenderer
Clase que instancia un objeto que renderizará todos los componentes a partir de nuestros objetos de cámara y escena. Como parametros formales requiere un pixel ratio y el tamaño de la ventana del cliente.


### Otros
Ajeno a la implementación de THREE.js para graficar una escena, también se definen propiedades para controlar el reajuste de tamaño de pantalla y otros eventos.

## Shaders

### Vertex Shader

En nuestra escena realiza transformaciones sobre cada uno de los vertices que conforman un objeto. En particular las transformaciones simulan la pulsación de un cuerpo y crean deformaciones en la geometría en función de ondas sinoidales. Asimismo, se calculan los vectores de reflexión y refracción para producir el factor de reflexión que simule la superficie de una burbuja.

### Fragment Shader

En nuestra escena realiza transformaciones sobre los fragmentos de un objeto en pantalla. Esto quiere decir que regula cómo es la salida de color del mismo, separando cada canal del color que refracta un fragmento y aplicando a su vez la textura del cubemap.

![Resultado de la actividad 2](./assets/02a.png)


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

![Resultado de la actividad 3. Un cubo formado con esferas unitarias, y procesado con vertex y fragment shaders visualizado con un efecto de estereoscopía](./assets/03a.png)