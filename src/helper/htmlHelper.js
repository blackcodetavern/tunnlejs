function createEditorHTML() {
    var editor = new Vue({
        el: '#editor',
        data: {
            examples: [
                {
                    name: "Ice cube",
                    id:0,
                    innerWallDefinition: {x:"i*2.5", y:"(((i%10)<8&&(i%10)>=2)&& ((h%10)>=2&&(h%10)<8))?2:22",z:"h*2.5" },
                    outerWallDefinition: {x:"i*2.5", y:"(((i%10)<9&&(i%10)>=1)&& ((h%10)>=1&&(h%10)<9))?0:20", z:"h*2.5"},
                    horizontalSteps: 30,
                    verticalSteps:30
                },
                {
                    name: "Wall",
                    id:1,
                    innerWallDefinition: {x:"i*4", y:"h*3",z:"0+(h%3==0?1+random()*2:0) + (i%5==0?1+random()*2:0)" },
                    outerWallDefinition: {x:"i*4", y:"h*3", z:"40 - (h%3==0?1+random()*2:0) - (i%5==0?1+random()*2:0)"},
                    horizontalSteps: 30,
                    verticalSteps:30,
                    otherHoles:[{bottom:1,top:15,left:12,right:17}]
                },
                {
                    name: "Roll",
                    id:2,
                    innerWallDefinition: {x:"sin(2*i*PI/(horizontalSteps-1))*20", y:"h*3",z:"cos(2*i*PI/(horizontalSteps-1))*20" },
                    outerWallDefinition: {x:"sin(2*i*PI/(horizontalSteps-1))*30", y:"h*3", z:"cos(2*i*PI/(horizontalSteps-1))*30"},
                    horizontalSteps: 30,
                    verticalSteps:30
                }
            ],
            innerWallDefinition: {x:"i*2.5", y:"(((i%10)<8&&(i%10)>=2)&& ((h%10)>=2&&(h%10)<8))?2:22",z:"h*2.5" },
            outerWallDefinition: {x:"i*2.5", y:"(((i%10)<9&&(i%10)>=1)&& ((h%10)>=1&&(h%10)<9))?0:20", z:"h*2.5"},
            horizontalSteps: 30,
            verticalSteps:30,
            selected: 0,
            otherHoles: []
        },
        methods: {
            getSurfaceWallFunction: function (wallDefinition, horizontalSteps, verticalSteps) {
                var sin = Math.sin;
                var cos = Math.cos;
                var PI = Math.PI;
                return function (i, h) {
                    function random() {
                        var x = Math.sin(i*horizontalSteps+h) * 10000;
                        return x - Math.floor(x);
                    }
                    var x = eval(wallDefinition.x);
                    var y = eval(wallDefinition.y);
                    var z = eval(wallDefinition.z);
                    return {x,y,z};
                }
            },
            updateExample: function () {
                createExampleHTML(
                    tunnlejs.createTunnleByWallFunctions(this.holes,this.outerWallFunction, this.innerWallFunction,this.horizontalSteps,this.verticalSteps),
                    "Function generated model",
                    "This model is generated with one inner and one outerwall function"
                )
            },
            addHole: function () {
                this.otherHoles.push({top:0,left:0,bottom:0,right:0})
            },
            deleteHole: function (index) {
                this.otherHoles.splice(index,1);
            }
        },
        computed: {
            selectedExample: {
                get() {
                    return this.selected;
                },
                set(selection) {
                    this.innerWallDefinition = this.examples[selection].innerWallDefinition
                    this.outerWallDefinition = this.examples[selection].outerWallDefinition
                    this.horizontalSteps = this.examples[selection].horizontalSteps
                    this.verticalSteps = this.examples[selection].verticalSteps
                    this.otherHoles = this.examples[selection].otherHoles||[]
                    this.selected = selection;
                    this.updateExample()

                }
            },
            innerWallFunction () {
                return this.getSurfaceWallFunction(this.innerWallDefinition, this.horizontalSteps, this.verticalSteps)
            },
            outerWallFunction () {
                return this.getSurfaceWallFunction(this.outerWallDefinition, this.horizontalSteps, this.verticalSteps)
            },
            holes() {
                return [{top:this.verticalSteps-2,left:0,bottom:0,right:this.horizontalSteps-2}].concat(this.otherHoles);
            }
        },
        mounted() {
            this.updateExample()
        }
      })
}




function createExampleHTML(tunnle, title, description) {
    var loader = new simple3dloader();
    loader.init();
    loader.setMesh(tunnle);

    var exampleOuter = document.createElement("div");
    exampleOuter.style.float = "left";
    exampleOuter.style.width="500px";
    exampleOuter.style.height="650px";

    var downloadButton = document.createElement('a');
    downloadButton.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(tunnle));
    downloadButton.setAttribute('download', title+".stl");
    downloadButton.innerHTML = title+" (STL)";


    exampleOuter.appendChild(loader.getCanvas());
    exampleOuter.appendChild(downloadButton);

    document.getElementById("example").innerHTML = "";
    document.getElementById("example").appendChild(exampleOuter);
}


