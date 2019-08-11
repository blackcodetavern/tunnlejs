var tunnlejs = (function () {

    var createTunnle = function (config) {
        //var flatConfig = {outerSurface:[-1,-1], thickness:1, length: 15,resolution:10};
        var trianglesOuter = createWall(config.outerSurface, config.height, config.radius, config.resolution, -1)
        var trianglesInner = createWall(config.outerSurface, config.height, config.radius*0.75, config.resolution, 1)

        
        var obj = simplelinearalgebra.createObject(trianglesOuter.concat(trianglesInner));

        return simplestl.getFullTextSTL(obj);
    }

    var createWall = function (surface, height, radius, resolution, direction) {
        var triangles = [];
        for(var h=0;h<surface.length-1;h++){
            for(var i = 1;i<=resolution;i++) {
                
                var v1 = simplelinearalgebra.createVertex(
                    surface[h] * radius*Math.sin(getCircleArgument(resolution, i)),
                    height*h/surface.length,
                    surface[h] * radius*Math.cos(getCircleArgument(resolution, i))
                );

                var v2 = simplelinearalgebra.createVertex(
                    surface[h] * radius*Math.sin(getCircleArgument(resolution, i+1)),
                    height*h/surface.length,
                    surface[h] * radius*Math.cos(getCircleArgument(resolution, i+1))
                ); 

                var v3 = simplelinearalgebra.createVertex(
                    surface[h+1] * radius*Math.sin(getCircleArgument(resolution, i+1)),
                    height*(h+1)/surface.length,
                    surface[h+1] * radius*Math.cos(getCircleArgument(resolution, i+1))
                ); 
                
                var v4 = simplelinearalgebra.createVertex(
                    surface[h+1] * radius*Math.sin(getCircleArgument(resolution, i)),
                    height*(h+1)/surface.length,
                    surface[h+1] * radius*Math.cos(getCircleArgument(resolution, i))
                ); 
                
                if(direction < 0) {
                    triangles.push(simplelinearalgebra.createTriangle(v1,v3,v2));
                    triangles.push(simplelinearalgebra.createTriangle(v3,v1,v4));
                } else {
                    triangles.push(simplelinearalgebra.createTriangle(v1,v2,v3));
                    triangles.push(simplelinearalgebra.createTriangle(v3,v4,v1));
                }
            }
        }
        return triangles;
    }

    var getCircleArgument = function(resolution, step) {
        return 2 * Math.PI / resolution * step;
    }

    //config: {wall1: [ Number[-1,1], .... ], thickness: Number>0, length:Number>1, }
    var createFlatTunnle = function (height,radius,resolution) {
        // 1.Step flat tunnle: wall1 = undefined
        var outerSurface = [];
        for(var i = 0;i<100;i++) {
            outerSurface.push(Math.round(80+Math.random()*20)/100)
        }

        var config = {
            outerSurface:outerSurface,
            resolution:resolution,
            height:height,
            radius:radius
        };
        return createTunnle(config);
    }




    return {
        createFlatTunnle
    };
})();