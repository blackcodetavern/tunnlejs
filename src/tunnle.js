var tunnlejs = (function () {

    var createTunnle = function (config) {
        //var flatConfig = {outerSurface:[-1,-1], thickness:1, length: 15,resolution:10};
        var outer = createWall(config.outerSurface, config.height, config.radius, config.resolution, -1)
        var inner = createWall(config.innerSurface, config.height, config.radius*0.75, config.resolution, 1)

        var closure = createClosure(outer.closureVertices, inner.closureVertices);
        
        var obj = simplelinearalgebra.createObject(outer.triangles.concat(inner.triangles).concat(closure));

        return simplestl.getFullTextSTL(obj);
    }

    var createClosure = function (outerVertices, innerVertices) {
        var triangles = [];        
        for(var i = 0;i<outerVertices.length/2;i++) {
            var v1 = outerVertices[i];
            var v2 = outerVertices[(i+1) % (outerVertices.length/2)];
            var v3 = innerVertices[i];
            var v4 = innerVertices[(i+1) % (outerVertices.length/2)];
            triangles.push(simplelinearalgebra.createTriangle(v1,v2,v4));
            triangles.push(simplelinearalgebra.createTriangle(v3,v1,v4));

            var v1 = outerVertices[outerVertices.length/2+i];
            var v2 = outerVertices[outerVertices.length/2 + ((i+1) % (outerVertices.length/2))];
            var v3 = innerVertices[outerVertices.length/2+i];
            var v4 = innerVertices[outerVertices.length/2 + ((i+1) % (outerVertices.length/2))];
            triangles.push(simplelinearalgebra.createTriangle(v1,v4,v2));
            triangles.push(simplelinearalgebra.createTriangle(v3,v4,v1));

        }
        return triangles;
    }

    var createWall = function (surface, height, radius, resolution, direction) {
        var triangles = [];
        var closureVertices = [];
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


                if(h==0) closureVertices.push(v1);
                else if(h==surface.length-2) closureVertices.push(v4);
                
                
                if(direction < 0) {
                    triangles.push(simplelinearalgebra.createTriangle(v1,v3,v2));
                    triangles.push(simplelinearalgebra.createTriangle(v3,v1,v4));
                } else {
                    triangles.push(simplelinearalgebra.createTriangle(v1,v2,v3));
                    triangles.push(simplelinearalgebra.createTriangle(v3,v4,v1));
                }
            }
        }
        return {triangles, closureVertices};
    }

    var getCircleArgument = function(resolution, step) {
        return 2 * Math.PI / resolution * step;
    }


    var createFlatTunnle = function (height,radius,thickness,resolution,steps) {
        var outerSurface = [];
        var innerSurface = [];
        for(var i = 0;i<steps;i++) {
            outerSurface.push(1)
            innerSurface.push(1-thickness)
        }

        var config = {
            outerSurface:outerSurface,
            innerSurface:innerSurface,
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