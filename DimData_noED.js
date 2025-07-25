//commented out all the exclude distribution stuff, figured I'd tackle one thing at a time
class DimData {
    constructor(DIM) {
        this.sizes = []; //array of cap sizes
        //this.excludeDistr = []; //array of exclude arrays
        this.dim = DIM; //caps generated will be this dimension
        this.cap = new Qap(dim); //working cap
    }
   
  //generates (reps) number of caps of size (dim), collecting data in size and excludeDistr
    genData(reps) {
      for(let i = 0, i < reps, i++) {
        genCap()
      }
    }

    //generates a random cap
    genCap() {
      this.cap.clear;
      function _done() {
        add(this.cap);
        
      }
      function _f() {
            this.cap.random(_f, _done);
        }
      this.cap.random(_f, _done);
    }

  //adds cap data to sizes, IF it isn't already there
  add(cap) {
    //var present = false;
    //var exclude = excludeCount(cap);
    if(this.sizes.indexOf(cap.size()) != -1) {
      //var indexes = getAllIndexes(this.sizes, cap.size());
      //for(i = 0; i < indexes.length; i++) {
        //if(excludeDistr[indexes[i] == exclude) {
          //present = true;
        //}
      return;
      }
    }
    else {
      this.sizes.push(cap.size());
  }
    //if(!present) {
    //  this.sizes.push(cap.size());
    //  this.excludeDistr.push(exclude);
    //}
  }
 
  excludeCount(cap) {
     var excludes = [Math.pow(2, cap.dim) - cap.size()]
     for (let i of Object.values(cap.exclude)) {
        let c = i.length / 2;
        while (excludes.length <= c) {
            excludes.push(0)
            excludes[c] += 1;
            excludes[0]--;
        }
     }
    return excludes;
  }
  getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            indexes.push(i);
        }
      return indexes;
    }
  }
  
}
