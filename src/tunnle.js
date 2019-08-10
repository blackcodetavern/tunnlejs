var tunnlejs = (function () {

    var createTunnle = function (config) {
        //var flatConfig = {outerSurface:[-1,-1], thickness:1, length: 15,resolution:10};
        var resolution = config.resolution;
        var triangles = [];
        for(var h=0;h<config.outerSurface.length-1;h++){
            for(var i = 1;i<=resolution;i++) {
                
                var v1 = simplelinearalgebra.createVertex(
                    config.outerSurface[h] * config.radius*Math.sin(getCircleArgument(resolution, i)),
                    config.height*h/config.outerSurface.length,
                    config.outerSurface[h] * config.radius*Math.cos(getCircleArgument(resolution, i))
                );

                var v2 = simplelinearalgebra.createVertex(
                    config.outerSurface[h] * config.radius*Math.sin(getCircleArgument(resolution, i+1)),
                    config.height*h/config.outerSurface.length,
                    config.outerSurface[h] * config.radius*Math.cos(getCircleArgument(resolution, i+1))
                ); 

                var v3 = simplelinearalgebra.createVertex(
                    config.outerSurface[h+1] * config.radius*Math.sin(getCircleArgument(resolution, i+1)),
                    config.height*(h+1)/config.outerSurface.length,
                    config.outerSurface[h+1] * config.radius*Math.cos(getCircleArgument(resolution, i+1))
                ); 
                
                var v4 = simplelinearalgebra.createVertex(
                    config.outerSurface[h+1] * config.radius*Math.sin(getCircleArgument(resolution, i)),
                    config.height*(h+1)/config.outerSurface.length,
                    config.outerSurface[h+1] * config.radius*Math.cos(getCircleArgument(resolution, i))
                ); 

                triangles.push(simplelinearalgebra.createTriangle(v1,v2,v3));
                triangles.push(simplelinearalgebra.createTriangle(v3,v4,v1));
            }
        }
        var obj = simplelinearalgebra.createObject(triangles);

        return simplestl.getFullTextSTL(obj);
    }

    var getCircleArgument = function(resolution, step) {
        return 2 * Math.PI / resolution * step;
    }

    //config: {wall1: [ Number[-1,1], .... ], thickness: Number>0, length:Number>1, }
    var createFlatTunnle = function (height,radius,resolution) {
        // 1.Step flat tunnle: wall1 = undefined
        var outerSurface = [];
        for(var i = 0;i<30;i++) {
            outerSurface.push(Math.round(85+Math.random()*15)/100)
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