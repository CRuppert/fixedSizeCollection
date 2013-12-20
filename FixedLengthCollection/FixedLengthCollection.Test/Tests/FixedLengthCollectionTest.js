///<reference path="/../FixedLengthCollection/FixedLengthCollection.js"/>
///<reference path="/lib/jasmine.js"/>


describe("FixedLengthCollection push Tests", function() {

    var coll = undefined;

    beforeEach(function() {
        coll = new fixedLengthCollection();
        
    });

    it("should allow construction with an existing array", function() {

        coll = new fixedLengthCollection(null, [1, 2, 3]);


        expect(coll.length).toBe(3);
        expect(coll[0]).toBe(1);
        expect(coll[2]).toBe(3);
    });

    it("should not exceed length when pushing an item when duplicationcheck is not defined", function() {

        coll = new fixedLengthCollection({ maxLength: 2 });

        coll.push(1);
        coll.push(2);
        coll.push(3);

        expect(coll.length).toBe(2);

    });
    
    it("should not add duplicate item when pushing an item when dupecheck is on", function () {

        coll = new fixedLengthCollection({
            maxLength: 2,
            enableDupeCheck: true
        });

        coll.push(1);
        coll.push(1);
        

        expect(coll.length).toBe(1);

    });
    
    it("should add duplicate item when pushing an item when dupecheck is off", function () {

        coll = new fixedLengthCollection({
            maxLength: 2,
            enableDupeCheck: false
        });

        coll.push(1);
        coll.push(1);


        expect(coll.length).toBe(2);

    });

    it("should use equality test when pushing and test is supplied and dupeCheck is on", function() {
        var opts = {
            maxLength: 3,
            enableDupeCheck: true,
            equalityTest: function (collItem, item) {
                return collItem.randomProperty == item.randomProperty;
            }
        };
        coll = new fixedLengthCollection(opts, [{ randomProperty: 1 }, { randomProperty: 2 }]);

        spyOn(opts, 'equalityTest').andCallThrough();

        coll.push({ randomProperty: 2 });

        expect(opts.equalityTest).toHaveBeenCalled();
        expect(coll.length).toBe(2);
    });
    
    it("should not use equality test when pushing and test is supplied and dupeCheck is off", function () {
        var opts = {
            maxLength: 3,
            enableDupeCheck: false,
            equalityTest: function (collItem, item) {
                return collItem.randomProperty == item.randomProperty;
            }
        };
        coll = new fixedLengthCollection(opts, [{ randomProperty: 1 }, { randomProperty: 2 }]);

        spyOn(opts, 'equalityTest').andCallThrough();

        coll.push({ randomProperty: 2 });

        expect(opts.equalityTest).not.toHaveBeenCalled();
        expect(coll.length).toBe(3);
    });

    it("should not add duplicate items from a splice(idx, countRemove, items...itemsX) call", function() {
        coll = new fixedLengthCollection({
            maxLength: 10,
            enableDupeCheck: true
        },[1,2,3,4,5]);

        coll.splice(0, 0, 4, 5, 6);

        expect(coll.length).toBe(6);
    });
    it("should  add duplicate items from a splice(idx, countRemove, items...itemsX) call", function () {
        coll = new fixedLengthCollection({
            maxLength: 10,
            enableDupeCheck: false
        }, [1, 2, 3, 4, 5]);

        coll.splice(0, 0, 4, 5, 6);

        expect(coll.length).toBe(8);
    });
});