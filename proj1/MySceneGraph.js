var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1);
        this.material.setDiffuse(0.1, 0.1, 0.1, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
        this.material.loadTexture('scenes/images/leaves.jpg');
        this.material.setTextureWrap('REPEAT','REPEAT');

        this.lights = [];
        this.lightsIDs = [];
        this.views = [];
        this.viewsIDs = [];
        this.defaultViewID = null;
        this.lights = [];
        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.components = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];
        
        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <gloabls> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        console.log("AWODINAWODNWD:", this.scene.lights.length);
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

        console.log("VIEWS ARRAY:", this.viewsIDs);
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        var dflt = this.reader.getString(viewsNode, 'default')
        if (dflt == null)
            return "no default defined for views";

        this.defaultViewID = dflt
        //console.log("dflt:", dflt)

        //checking cameras (child nodes)
        var children = viewsNode.children;
        if (children.length===0)
            return "no view given"; 

        /* guarda childNames e childIDs e verifica se se tags são válidas*/
        var childNames = []
        var childIDs = []
        for (var i = 0; i < children.length; i++) {
            if(children[i].nodeName != "perspective" && children[i].nodeName != "ortho")
                return "invalid view tag"

            childNames.push(children[i].nodeName);
            childIDs.push(children[i].getAttribute("id"))   
        }
        /*ver se um node coincide com o nome do dado como default*/
        if(!childIDs.includes(dflt))
            return "no view corresponds to given default view"

        for (var i = 0; i < children.length; i++) {
            if(children[i].nodeName=="perspective") {
                this.createPerspCamera(children[i])
            }
            else {
                this.createOrthoCamera(children[i])
            }
        }

        this.log("Parsed views");
    }

    //cria camera de perspetiva
    createPerspCamera(viewNode) {
        var id = viewNode.getAttribute("id")
        var near = parseFloat(viewNode.getAttribute("near"))
        var far = parseFloat(viewNode.getAttribute("far"))
        var angle = parseFloat(viewNode.getAttribute("angle"))

        var children = viewNode.children;
        var from_x = parseFloat(children[0].getAttribute("x"))
        var from_y = parseFloat(children[0].getAttribute("y"))
        var from_z = parseFloat(children[0].getAttribute("z"))

        var to_x = parseFloat(children[1].getAttribute("x"))
        var to_y = parseFloat(children[1].getAttribute("y"))
        var to_z = parseFloat(children[1].getAttribute("z"))
        
        /*
        console.log("ID:", id);
        console.log("NEAR:", near);
        console.log("FAR:", far);
        console.log("ANGLE:", angle);
        console.log("FROM_X:", from_x);
        console.log("FROM_Y:", from_y);
        console.log("FROM_Z:", from_z);
        console.log("TO_X:", to_x);
        console.log("TO_Y:", to_y);
        console.log("TO_Z:", to_z);
        console.log("\n");
        */
        this.viewsIDs.push(id);
        this.views[id] = new CGFcamera(angle*DEGREE_TO_RAD, near, far, vec3.fromValues(from_x, from_y, from_z), vec3.fromValues(to_x, to_y, to_z));
        console.log("THIS.VIEWS[ID]:", near*2);
    }

    //cria camera ortogonal
    createOrthoCamera(viewNode) {
        const id = viewNode.getAttribute("id")
        const near = parseFloat(viewNode.getAttribute("near"))
        const far = parseFloat(viewNode.getAttribute("far"))
        const left = parseFloat(viewNode.getAttribute("left"))
        const right = parseFloat(viewNode.getAttribute("right"))
        const top = parseFloat(viewNode.getAttribute("top"))
        const bottom = parseFloat(viewNode.getAttribute("bottom"))
    
        var children = viewNode.children;
        const from_x = parseFloat(children[0].getAttribute("x"))
        const from_y = parseFloat(children[0].getAttribute("y"))
        const from_z = parseFloat(children[0].getAttribute("z"))

        const to_x = parseFloat(children[1].getAttribute("x"))
        const to_y = parseFloat(children[1].getAttribute("y"))
        const to_z = parseFloat(children[1].getAttribute("z"))
        /*
        console.log("ID:", id);
        console.log("NEAR:", near);
        console.log("FAR:", far);
        console.log("LEFT:", left);
        console.log("RIGHT:", right);
        console.log("TOP:", top);
        console.log("BOTTOM:", bottom);
        */
        this.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, [from_x, from_y, from_z], [to_x, to_y, to_z]);
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {
        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";
            else
                this.lightsIDs.push(lightId);

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;
        for (var i = 0; i < children.length; i++) {
            if(children[i].nodeName != "texture")
                return "invalid texture tag"
            
            const id = children[i].getAttribute("id")
            if(id==null)
                return "no id given for texture"
            //verificar se já existe um id igual ou não

            const file = children[i].getAttribute("file")
            if(file==null)
                return "no file path given for texture"
            /*
            console.log("ID:", id)
            console.log("FILE:", file)
            */
            this.textures[id] = new CGFtexture(this.scene, file);
        }
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            const shininess = this.reader.getString(children[i], 'shininess');
            grandChildren = children[i].children;
            const emission = this.parseColor(grandChildren[0],"material's emission");
            const ambient = this.parseColor(grandChildren[1], "material's ambient");
            const diffuse = this.parseColor(grandChildren[2], "material's diffuse");
            const specular = this.parseColor(grandChildren[3], "material's specular");
            /*
            console.log("ID:", materialID);
            console.log("ID:", shininess);
            console.log("EMISSION:", emission);
            console.log("AMBIENT:", ambient);
            console.log("DIFFUSE:", diffuse);
            console.log("SPECULAR:", specular);
            */
            var currMaterial = new CGFappearance(this.scene);
            currMaterial.setTextureWrap('REPEAT','REPEAT');

            currMaterial.setShininess(shininess);
            currMaterial.setEmission(...emission);
            currMaterial.setAmbient(...ambient);
            currMaterial.setDiffuse(...diffuse);
            currMaterial.setSpecular(...specular);
            //console.log("CURR:", currMaterial);
            this.materials[materialID] = currMaterial;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        //this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        //this.onXMLMinorError("To do: Parse scale transformations.");
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], "axis");
                        var angle = this.reader.getString(grandChildren[j], "angle");
                        //console.log("AXIS:", axis);
                        //console.log("ANGLE:", angle);
                        if(axis=='x') {
                            mat4.rotate(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD, [1, 0, 0]);
                        }
                        else if (axis=='y') {
                            mat4.rotate(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD, [0, 1, 0]);
                        }
                        else if (axis=='z') {
                            mat4.rotate(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD, [0, 0, 1]);
                        }
                        else {
                            return "Axis must be valid (x, y or z)"
                        }
                        break;
                }
            }
            //console.log("TRANSF MATRIX:", transfMatrix);
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if(primitiveType == 'cylinder') {
                var base_r = this.reader.getFloat(grandChildren[0], 'base');
                // falta verficiar input
                var top_r = this.reader.getFloat(grandChildren[0], 'top');
                // falta verficiar input
                var height = this.reader.getFloat(grandChildren[0], 'height');
                // falta verficiar input
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                // falta verficiar input
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                // falta verficiar input
                var cyl = new MyCylinder(this.scene, base_r, top_r, height, slices, stacks);
                
                this.primitives[primitiveId] = cyl;
            }
            else if(primitiveType == 'torus') {
                var inner_r = this.reader.getFloat(grandChildren[0], 'inner');
                // falta verficiar input
                var outer_r = this.reader.getFloat(grandChildren[0], 'outer');
                // falta verficiar input
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                // falta verficiar input
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                // falta verficiar input
                var torus = new MyTorus(this.scene, inner_r, outer_r, slices, loops);

                this.primitives[primitiveId] = torus;
            }
            else if(primitiveType == 'triangle') {
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                // falta verficiar input
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                // falta verficiar input
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                // falta verficiar input
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                // falta verficiar input
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                // falta verficiar input
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                // falta verficiar input
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                // falta verficiar input
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                // falta verficiar input
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                // falta verficiar input
                var triangle = new MyTriangle(this.scene, [x1,y1,z1], [x2, y2, z2], [x3, y3, z3]);

                this.primitives[primitiveId] = triangle;
            }
            else if(primitiveType == 'sphere') {
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                // falta verificar input
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                // falta verificar input
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                //falta verificar input
                var sphere = new MySphere(this.scene, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        //this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            this.nodes[componentID] = new MyNode(componentID);

            // Transformations
            var transfChildren=[]
            transfChildren = grandChildren[transformationIndex].children;
            for(var j=0; j<transfChildren.length; j++) {
                switch(transfChildren[j].nodeName) {
                    case "transformationref":
                        var transfID = this.reader.getString(transfChildren[j], 'id')
                        // checks if ID was given for transformation reference
                        if(transfID!=null) 
                            this.nodes[componentID].transfMatrix = this.transformations[transfID];
                        else
                            return "no ID for transformationref given"
                        break;
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(transfChildren[j], "translate transformation for ID ");
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        this.nodes[componentID].transfMatrix = mat4.translate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        //this.onXMLMinorError("To do: Parse scale transformations.");
                        var coordinates = this.parseCoordinates3D(transfChildren[j], "scale transformation for ID ");
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        this.nodes[componentID].transfMatrix = mat4.scale(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(transfChildren[j], "axis");
                        var angle = this.reader.getString(transfChildren[j], "angle");
                        //console.log("AXIS:", axis);
                        //console.log("ANGLE:", angle);
                        if(axis=='x') {
                            mat4.rotate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, angle*DEGREE_TO_RAD, [1, 0, 0]);
                        }
                        else if (axis=='y') {
                            mat4.rotate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, angle*DEGREE_TO_RAD, [0, 1, 0]);
                        }
                        else if (axis=='z') {
                            mat4.rotate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, angle*DEGREE_TO_RAD, [0, 0, 1]);
                        }
                        else {
                            return "Axis must be valid (x, y or z)"
                        }
                        break;

                }
            }
            // Materials
            /*var matChildren=[]
            matChildren = grandChildren[materialsIndex].children
            var matID = this.reader.getString(matChildren[0], 'id')
            //this.nodes[componentID].materialID = matID;
            this.nodes[componentID].materialID.push(matID);*/
            var matChildren=[];
            var matID = null;
            matChildren = grandChildren[materialsIndex].children
            for(var j=0; j<matChildren.length; j++) {
                matID = this.reader.getString(matChildren[j], 'id')
                this.nodes[componentID].materialID.push(matID);
                console.log("\nPARSED MAT:", this.nodes[componentID].materialID[j]);
                console.log("J:", j);
                console.log("\n\n\n");
            }

            // Texture
            var texID = this.reader.getString(grandChildren[textureIndex], 'id');
            if(texID!="inherit" && texID!="none") {
                var sLength = this.reader.getString(grandChildren[textureIndex], 'length_s');
                var tLength = this.reader.getString(grandChildren[textureIndex], 'length_t');
                this.nodes[componentID].sLength = sLength;
                this.nodes[componentID].tLength = tLength;
            }
            var sLength = this.reader.getString(grandChildren[textureIndex], 'length_s');
            var tLength = this.reader.getString(grandChildren[textureIndex], 'length_t');
            this.nodes[componentID].textureID = texID;
            this.nodes[componentID].sLength = sLength;
            this.nodes[componentID].tLength = tLength;
            // Children
            var childrenChildren=[]
            childrenChildren = grandChildren[childrenIndex].children;
            
            for(var j=0; j<childrenChildren.length; j++) {
                if(childrenChildren[j].nodeName=="primitiveref") {
                    var primitiverefID = this.reader.getString(childrenChildren[j], 'id');
                    this.nodes[componentID].childLeafsIDs.push(primitiverefID);
                }
                else if(childrenChildren[j].nodeName=="componentref") {
                    var componentrefID = this.reader.getString(childrenChildren[j], 'id');
                    //console.log("CRID:", componentrefID);
                    this.nodes[componentID].childNodesIDs.push(componentrefID);
                }
            }
        }
        //console.log("NODE:", this.nodes["demoRoot"]);
        //console.log("NODE:", this.nodes["demoComp"]);
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }
    
    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.transverseTree();
        /*
        this.scene.pushMatrix();
        
  
        this.material.apply();
        this.testCylinder.display();
        this.testRect.display();

        this.scene.popMatrix();
        */
       
    }

    transverseTree() {
        this.processNode(this.idRoot, null, null);
    }

    updateMaterials(nodeID) {
        var currNode = this.nodes[nodeID];
        currNode.changeMaterial();
        for(var i=0; i<currNode.childNodesIDs.length; i++) {
            this.updateMaterials(currNode.childNodesIDs[i]);
        }
    }

    processNode(nodeID, inheritMatID, inheritTexID/*, sLength?, tLength?*/) {
        var currNode = this.nodes[nodeID];

        var currMat = null;
        var currMatID = inheritMatID;
        var currTextID = inheritTexID;

        if(currNode.materialID[currNode.currMaterial]!="inherit") {
            currMatID = currNode.materialID[currNode.currMaterial];
        }

        currMat=this.materials[currMatID];

        if(currNode.textureID!="inherit" && currNode.textureID!="none") {
            currTextID = currNode.textureID;
            currMat.setTexture(this.textures[currTextID]);
        }
        else if(currNode.textureID=="inherit") {
            currMat.setTexture(this.textures[currTextID]);
        }
        /*
        if(currNode.materialID=="inherit") {
            currMatID = inheritMatID;
        }
        else {
            currMatID = currNode.materialID[currNode.currMaterial];
        }

        inheritMatID = currMatID;
        currMat = this.materials[currMatID];

        if(currNode.textureID=="inherit") {
            currTextID = inheritTexID;
            currMat.setTexture(this.textures[currTextID]);
        }
        else if(currNode.textureID!="none") {
            currTextID = currNode.textureID;
            currMat.setTexture(this.textures[currTextID]);
        }

        inheritTexID = currTextID;*/
        currMat.apply();
        currMat.setTexture(null);

        this.scene.pushMatrix();
        this.scene.multMatrix(currNode.transfMatrix);

        for(var i=0; i<currNode.childLeafsIDs.length; i++) {
            if(currNode.sLength != null && currNode.tLength != null)
                this.primitives[currNode.childLeafsIDs[i]].updateTexCoords(currNode.sLength, currNode.tLength);
            this.primitives[currNode.childLeafsIDs[i]].display();
        }

        for(var i=0; i<currNode.childNodesIDs.length; i++) {
            this.processNode(currNode.childNodesIDs[i], currMatID, currTextID);
        }

        this.scene.popMatrix();
    }
}