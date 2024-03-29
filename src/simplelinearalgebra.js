var simplelinearalgebra = (function () {
    //{x:Number[0,1], y:Number[0,1], z:Number[0,1]}
    var createVertex = function (x, y, z) {
        return {x:x,y:y,z:z};
    }

    //{vertices:{v1,v2,v3}, norm: vn}
    var createTriangle = function (v1, v2, v3, direction) {
        var norm = createNormalVector(v1,v2,v3);
        return {vertices:{v1:v1,v2:v2,v3:v3}, norm:norm};
    }

    //create the normal vector. the order of the vertices is important to define in which
    //direction the normalvector will point
    var createNormalVector = function(v1, v2, v3) {
        //create plane vectors
        var a = {x:v2.x-v1.x,y:v2.y-v1.y,z:v2.z-v1.z};
        var b = {x:v3.x-v1.x,y:v3.y-v1.y,z:v3.z-v1.z}
        //cross product
        var cv = {
            x:a.y*b.z - a.z*b.y,
            y:a.z*b.x - a.x*b.z,
            z:a.x*b.y - a.y*b.x
        }
        //normalize
        var length = Math.sqrt(cv.x*cv.x + cv.y*cv.y + cv.z*cv.z);

        return {x:-cv.x/length,y:-cv.y/length,z:-cv.z/length};
    }

    //{arrayOfTriangles: [v1,...,vn]}
    var createObject = function (arrayOfTriangles) {
        return {arrayOfTriangles:arrayOfTriangles};
    }
 

    return {
       createVertex,
       createTriangle,
       createObject
    };
})();