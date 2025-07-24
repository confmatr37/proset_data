//copied from my branch of proset_vis, originally written by Darrionat, who sourced much of the code from Slickytail
class Qap {
    constructor(DIM) {
        this.points = new Set();
        this.exclude = {}
        this.dim = DIM;
    }

    add(point) {
        if (point == 0)
            return;
        if (point >= Math.pow(2, this.dim))
            throw new RangeError(`Point too large for dimension ${this.dim}`);
        if (this.excludesCount(point))
            throw new RangeError("Point excluded");
        // If we already have the point, just silently return
        // If we try to create excludes with a point we already have, we'll mess up our cap
        if (this.points.has(point))
            return;
        // Update the exclude
        for (let p1 of this.points) {
            let exc = point ^ p1;
            if (!this.exclude[exc])
                this.exclude[exc] = [];
            // None of these points can be in this.exclude[exc] yet.
            // Multiple excludes requires disjoint triples.
            // We put the smallest point first for simpler locating
            if (point < p1)
                this.exclude[exc].push(point, p1);
            else
                this.exclude[exc].push(p1, point);
        }
        // Add the point
        this.points.add(point);
    }

    remove(point) {
        if (!this.points.has(point))
            return;
        this.points.delete(point);
        // Trim the excludes.
        for (let p1 of this.points) {
            let exc = point ^ p1;
            let del_index = this.exclude[exc].indexOf(Math.min(point, p1));
            if (del_index == -1)
                throw "Trying to remove point that wasn't included"
            this.exclude[exc].splice(del_index, 2);
        }
    }
    contains(point) {
        return this.points.has(point);
    }
    excludesCount(point) {
        if (!this.exclude[point])
            return 0;
        return this.exclude[point].length / 2;
    }
    excludesTriples(point) {
        return this.exclude[point];
    }
    clear() {
        this.points = new Set();
        this.exclude = {};
    }
    isComplete() {
        // This should be cached
        for (let i = 1; i < Math.pow(2, this.dim); i++) {
            if (!this.points.has(i) && !this.excludesCount(i))
                return false
        }
        return true;
    }
    complete() {
        for (let i = 1; i < Math.pow(2, this.dim); i++) {
            if (!this.points.has(i) && !this.excludesCount(i))
                this.add(i);
        }
    }
    random(next, done) {
        // I am defining "a random qap" in the naive way:
        //   a qap constructed by randomly following the contruction tree, from the current qap.
        // This function adds a random point, then calls the callback.
        // Normally, clear() is called before this.

        // Empty square = not cap point or exclude
        const emptySquares = Math.pow(2, this.dim) -
            (
                this.points.size + // Number of cap points
                Object.values(this.exclude).filter(x => x.length).length // Count the number of excludes
                + 1 // Count for the zero point
            )
        if (emptySquares == 0) {
            setTimeout(done);
            return;
        }
        let found = 0;
        let indexToAdd = Math.floor(Math.random() * emptySquares);

        for (let i = 1; i < Math.pow(2, this.dim); i++) {
            // Point is either a cap point or an exclude
            if (this.points.has(i) || this.excludesCount(i))
                continue;
            if (found == indexToAdd) {
                this.add(i);
                setTimeout(next);
                return;
            }
            found++;
        }
        throw "ops"
    }
    size() {
        return this.points.size;
    }
    changeDim(newDim) {
        for (let p of this.points) {
            if (p > Math.pow(2, newDim))
                this.remove(p);
        }
        this.dim = newDim;
    }
}
