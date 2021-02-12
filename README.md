# CS425 - Computer Graphics I (Spring 2021)

## Assignment 0: Introduction to JavaScript and WebGL
The goal of this first assignment is to get you familiar with JavaScript, WebGL calls, development environment, and the assignment submission process. You will develop a web application to render triangles with vertex position and colors defined in an external JSON file, specified by the user through a configuration panel.

### Elements of HTML pages

#### Four sliders that each corresponds to R,G,B,A of color values

#### One slider that corresponds to the number of triangles rendered, in which the maximum is updated with the file input

#### A file input element that lets user to upload JSON file with specified input format:
 ```
{"positions": [x_1,y_1,z_1,x_2,y_2,z_2,...,x_n,y_n,z_n], "colors": [r_1,g_1,b_1,a_1,r_2,g_2,b_2,a_2,...,r_n,g_n,b_n,a_n]}}
```
#### A toggle box element, when toggled, canvas will render triangle color based on inputfile. When it is not toggled, it will use color based on four RGBA color forementioned.

### How to use the program

1) Upload JSON file using the fileinput elemment
2) use sliders and toggle box to configure the triangles image to be rendered
3) behold!

### Coding of the assignment

#### openfile method

![openFile](https://raw.githubusercontent.com/spark299/spring-2021-assignment-0/main/openfile.png)


openfile method is called when the file input element load the JSON file user specified.
it largely does four things:
1) update the global variable posArray and use it to create webGL position buffer 
2) update the global variable colorArray and use it to create webG color buffer
3) create VAO for the two buffers created
4) update the global variable maxTriangles and make slider of number of triangles to reflect the maximum.

#### updateColor and updateTriangles

![updates](https://raw.githubusercontent.com/spark299/spring-2021-assignment-0/main/updates.png)

those two methods are to support the functionality of five sliders, called when user input changes on the sliders

#### initialize

![init](https://raw.githubusercontent.com/spark299/spring-2021-assignment-0/main/initialize.png)

this method will be called for window.onload, and initializes necessary elements for the appliaction before the user input on file input element.
The REAL initialization step of the appliaction is completed by openFile method.

note that this element only initializes shader, program and uniforms. Buffers and VAO are updated on openfile method.

Also, two uniforms are defined: "uColor" and "toggled"

"ucolor" represents the color value that are created from 4 RGBA sliders.
"toggled" reperents whether the toggle element is toggled. when toggled, it will have value of 1 and passed on to the shader. Otherwise with value of 0.


#### vertexshader

![vertex](https://raw.githubusercontent.com/spark299/spring-2021-assignment-0/main/vertex.png)

vertex shader contains conditional that based on the value of toggled, it uses uColor or vColor.
