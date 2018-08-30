var Immutable = require('immutable');
var Serialize = require('../immutable');
var serialize = Serialize(Immutable);
var stringify = serialize.stringify;
var parse = serialize.parse;

var data = {
  map: Immutable.Map({ a: 1, b: 2, c: 3, d: 4 }),
  'numeric keys map': Immutable.Map([ [ 1, 'one'], [ 2, 'two' ], [ 3, 'three' ] ]),
  orderedMap: Immutable.OrderedMap({ b: 2, a: 1, c: 3, d: 4 }),
  'numeric keys OrderedMap': Immutable.OrderedMap([ [ 1, 'one'], [ 2, 'two' ], [ 3, 'three' ] ]),
  list: Immutable.List([1,2,3,4,5,6,7,8,9,10]),
  range: Immutable.Range(0,7),
  repeat: Immutable.Repeat('hi', 100),
  set: Immutable.Set([10,9,8,7,6,5,4,3,2,1]),
  orderedSet: Immutable.OrderedSet([10,9,8,7,6,5,4,3,2,1]),
  seq: Immutable.Seq.of(1,2,3,4,5,6,7,8),
  stack: Immutable.Stack.of('a', 'b', 'c')
};

describe('Immutable', function () {
  var stringified = {};
  describe('Stringify', function () {
    Object.keys(data).forEach(function (key) {
      it(key, function () {
        stringified[key] = stringify(data[key]);
        expect(stringified[key]).toMatchSnapshot();
      });
    });
  });
  
  describe('Parse', function () {
    Object.keys(data).forEach(function(key) {
      it(key, function() {
        expect(parse(stringified[key])).toEqual(data[key]);
      });
    });
  });
  
  describe('Record', function () {
    var ABRecord = Immutable.Record({ a:1, b:2 });
    var myRecord = new ABRecord({ b:3 });
    
    var serialize = Serialize(Immutable, [ABRecord]);
    var stringify = serialize.stringify;
    var parse = serialize.parse;
    var stringifiedRecord;
  
    it('stringify', function() {
      stringifiedRecord = stringify(myRecord);
      expect(stringifiedRecord).toMatchSnapshot();
    });
  
    it('parse', function() {
      expect(parse(stringifiedRecord)).toEqual(myRecord);
    });
  });

  describe('Nested', function () {
    var ABRecord = Immutable.Record({
      map: Immutable.OrderedMap({ seq: data.seq, stack: data.stack }),
      numeric_map: Immutable.Map([ [ 1, data.seq ], [ 2, data.stack ] ]),
      repeat: data.repeat
    });
    var nestedData = Immutable.Set(ABRecord(), data.orderedSet, data.range);

    var serialize = Serialize(Immutable, [ABRecord]);
    var stringify = serialize.stringify;
    var parse = serialize.parse;
    var stringifiedNested;

    it('stringify', function() {
      stringifiedNested = stringify(nestedData);
      expect(stringifiedNested).toMatchSnapshot();
    });

    it('parse', function() {
      expect(parse(stringifiedNested)).toEqual(nestedData);
    });
  });
});
