/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @construcr
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
        if(event.code=="KeyM") {
            this.scene.graph.updateMaterials(this.scene.graph.idRoot);
        }
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Interface functions
     */
    createViewsInterface() {
        this.selectedView = this.scene.graph.defaultViewID;
        this.selectedSecurityView = this.scene.graph.defaultViewID;
        var folder = this.gui.addFolder("views");
        folder.open();
        folder.add(this, 'selectedView', this.scene.graph.viewsIDs).name('Camera').onChange(id => this.scene.setCamera(id));
        folder.add(this, 'selectedSecurityView', this.scene.graph.viewsIDs).name('SecurityCamera').onChange(cancro => this.scene.setSecurityCamera(cancro));
    }

    createLightsInterface() {
        var i=0;
        var lightDictKeys = Object.keys(this.scene.lights);
        var folder = this.gui.addFolder("lights");
        for(var key of lightDictKeys) {
            folder.add(this.scene.lights[key], 'enabled').name(this.scene.graph.lightsIDs[key]);
            i++;
            if(i>=this.scene.graph.lightsIDs.length) 
                break;
        }
    }
}