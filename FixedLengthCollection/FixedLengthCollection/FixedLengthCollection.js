// concept and structure from here : http://www.bennadel.com/blog/2308-Creating-A-Fixed-Length-Queue-In-JavaScript-Using-Arrays.htm
function fixedLengthCollection(opts, array) {
    opts = opts ||  {maxLength:10, enableDupeCheck:false};

    array = array || [];
    var arr = Array.apply(null, array);
    arr.opts = opts;
    arr.push = fixedLengthCollection.push;
    arr.unshift = fixedLengthCollection.unshift;
    arr.splice = fixedLengthCollection.splice;
    
    return arr;
};

fixedLengthCollection.trimHead = function() {
    if (this.length <= this.opts.maxLength) {
        return;
    }
    Array.prototype.splice.call(this, 0, this.length - this.opts.maxLength);
};
fixedLengthCollection.trimTail = function() {
    if (this.length <= this.opts.maxLength) {
        return;
    }
    Array.prototype.splice.call(this, thix.opts.maxLength, this.length - this.opts.maxLength);
};

fixedLengthCollection.wrapMethod = function(methodName, trimAction) {
    
    
    var wrapper = function () {

        var isSplice = arguments.length > 2;
        
        if (this.opts.enableDupeCheck) {
            if (!isSplice) {
                if (this.opts.equalityTest !== undefined) {
                    for (var i = 0; i < this.length; i++) {
                        if (this.opts.equalityTest(this[i], arguments[0])) {
                            return false;
                        }
                    }
                } else {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == arguments[0]) {
                            return false;
                        }
                    }
                }
            }
            else {
                var itemsBeingAdded = Array.prototype.slice.call(arguments, 2);
                var originalItemsLength = itemsBeingAdded.length;
                var workingSet = itemsBeingAdded.slice(0);
                if (this.opts.equalityTest !== undefined) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == arguments[0]) {
                            return false;
                        }
                    }
                } else {
                    for (var i = 0; i < itemsBeingAdded.length; i++) {
                        var idx = workingSet.indexOf(itemsBeingAdded[i]) > 0;
                        if (idx > 0) {
                            workingSet.splice(idx, 1);
                        }
                    }
                }
                arguments = Array.prototype.splice.call(arguments,2, originalItemsLength, workingSet);
            }
        } 
        var method = Array.prototype[methodName];
        var res = method.apply(this, arguments);
        trimAction.call(this);
        console.log(this.length);
        return res;
    };
    return wrapper;
};

fixedLengthCollection.push = fixedLengthCollection.wrapMethod("push", fixedLengthCollection.trimHead);
fixedLengthCollection.splice = fixedLengthCollection.wrapMethod("splice", fixedLengthCollection.trimTail);
fixedLengthCollection.unshift = fixedLengthCollection.wrapMethod("unshift", fixedLengthCollection.trimTail);