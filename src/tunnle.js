var tunnlejs = (function () {

    var createTunnleBySurface = function (config) {
        //Outer and inner wall of the tunnle

        var surfaceWallFunction = function (surface, radius, height, horizontalSteps) {
            return function (i, h) {
                var x = surface[h] * radius*Math.sin(2 * Math.PI / (horizontalSteps-1) * i);
                var y = height*h/surface.length;
                var z = surface[h] * radius*Math.cos(2 * Math.PI / (horizontalSteps-1) * i);
                return {x,y,z};
            }
        };


        var outer = createWallByFunction(surfaceWallFunction(config.outerSurface,config.radius,config.height,config.resolution),config.resolution, config.outerSurface.length, -1)
        var inner = createWallByFunction(surfaceWallFunction(config.innerSurface,config.radius*(1-config.thickness),config.height,config.resolution), config.resolution, config.innerSurface.length, 1)
        return createTunnle(outer, inner);
    }

    var createTunnleByWallFunctions = function (outerWallFunction, innerWallFunction, horizontalResolution, verticalResolution) {
        //Outer and inner wall of the tunnle
        var outer = createWallByFunction(outerWallFunction,horizontalResolution, verticalResolution, -1)
        var inner = createWallByFunction(innerWallFunction,horizontalResolution, verticalResolution, 1)
        return createTunnle(outer, inner);
    }



    var createTunnle = function (outerSurface, innerSurface) {
            //Top and bottom closure (Will be extended in a future release)
            var closure = createClosure(outerSurface.closureVertices, innerSurface.closureVertices);
    
            //Concat the triangles of the tunnle
            var obj = simplelinearalgebra.createObject(outerSurface.triangles.concat(innerSurface.triangles).concat(closure));
    
            //Generate the STL from the triangles
            return simplestl.getFullTextSTL(obj);
    }

    var createClosure = function (outerVertices, innerVertices) {
        var triangles = [];        
        for(var i = 0;i<outerVertices.length;i++) {
            //Bottom closure
            var v1 = outerVertices[i];
            var v2 = outerVertices[(i+1) % (outerVertices.length)];
            var v3 = innerVertices[i];
            var v4 = innerVertices[(i+1) % (innerVertices.length)];
            triangles.push(simplelinearalgebra.createTriangle(v1,v2,v4));
            triangles.push(simplelinearalgebra.createTriangle(v3,v1,v4));


        }
        return triangles;
    }

    var createWallByFunction = function (wallFunction, resolutionHorizontal, resolutionVertical, direction) {
        var triangles = [];
        var closureVertices = [];

        var closure= {left:[],right:[],top:[],bottom:[]};

        for(var h=0;h<resolutionVertical-1;h++){
            for(var i = 0;i<resolutionHorizontal-1;i++) {
                
                var vertices = [];
                for(var p = 0;p<2;p++){
                    for(var q=0;q<2;q++){
                        var groundVector = wallFunction(i+p,h+q);
                        vertices.push(simplelinearalgebra.createVertex(
                            groundVector.x,
                            groundVector.y,
                            groundVector.z
                        ))
                    }
                }

                if(i==0) closure.left.unshift(vertices[0]);
                if(h==0) closure.bottom.push(vertices[2]);
                if(i==resolutionHorizontal-2) closure.right.push(vertices[3]);
                if(h==resolutionVertical-2) closure.top.unshift(vertices[1]);

                
                
                if(direction < 0) {
                    triangles.push(simplelinearalgebra.createTriangle(vertices[0],vertices[1],vertices[2]));
                    triangles.push(simplelinearalgebra.createTriangle(vertices[1],vertices[3],vertices[2]));
                } else {
                    triangles.push(simplelinearalgebra.createTriangle(vertices[0],vertices[2],vertices[1]));
                    triangles.push(simplelinearalgebra.createTriangle(vertices[1],vertices[2],vertices[3]));
                }
            }
        }
        closureVertices = closure.bottom.concat(closure.right).concat(closure.top).concat(closure.left);
        return {triangles, closureVertices};        
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
            resolution:resolution+1,
            thickness:thickness,
            height:height,
            radius:radius
        };
        return createTunnleBySurface(config);
    }

    var createTunnleByOuterSurface = function (surface, height,radius,thickness,resolution) {
        var outerSurface = [];
        var innerSurface = [];
        for(var i = 0;i<surface.length;i++) {
            outerSurface.push(surface[i])
            innerSurface.push(surface[i])
        }

        var config = {
            outerSurface:outerSurface,
            innerSurface:innerSurface,
            resolution:resolution+1,
            height:height,
            radius:radius,
            thickness:thickness
        };
        return createTunnleBySurface(config);
    }

    var createTunnleByInnerAndOuterSurface = function (outerSurface, innerSurface, height,radius,thickness,resolution) {

        var config = {
            outerSurface:outerSurface,
            innerSurface:innerSurface,
            resolution:resolution+1,
            height:height,
            radius:radius,
            thickness:thickness
        };
        return createTunnleBySurface(config);
    }

    return {
        createFlatTunnle,
        createTunnleByOuterSurface,
        createTunnleByInnerAndOuterSurface,
        createTunnleByWallFunctions
    };
})();