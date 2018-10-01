
/*

  https://codeburst.io/how-to-test-javascript-with-mocha-the-basics-80132324752e
  http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/

  https://github.com/mochajs/mocha/wiki
  https://sinonjs.org/

  https://mherman.org/blog/2017/11/06/stubbing-http-requests-with-sinon/

*/

process.env['NODE_ENV'] = 'test'; //this will be used around in the modules to expose internal functions in test context

// test framework
var assert = require('assert');

var chai = require('chai');  
//var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

var sinon = require('sinon'); 

// faking browser enviroment
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest(); // fake XMLHttpRequest since we're running this in node env

const jsdom = require("jsdom"); // https://www.npmjs.com/package/jsdom
const { JSDOM } = jsdom;
const { window }  = new JSDOM('<body></body>', {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000
});
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
// END faking



// modules to test
const xhr = require('../modules/xhr.js');

// https://www.airpair.com/javascript/posts/unit-testing-ajax-requests-with-mocha
describe('xhr.js', function() {

  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();

    this.requests = [];
    this.xhr.onCreate = function(xhr) {
        this.requests.push(xhr);
    }.bind(this);
  });
  afterEach(function() {
    this.xhr.restore();
  });


  // start testing !
  describe('should parse fetched data as JSON', function(done) {
    var data = { foo: 'bar' };
    var dataJson = JSON.stringify(data);

    xhr.get('url').done(function(result) {
      result.should.deep.equal(data);
      done();
    });

    it('xhr.get() :: should parse fetched data as JSON', function(done) {
      var data = { foo: 'bar' };
      var dataJson = JSON.stringify(data);
  
      xhr.get('url').done(function(result) {
        //console.error('result ', result);
        result.should.deep.equal(data);
        done();
      });
      // fake server response
      setTimeout(()=>{
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
      },1000);     
    });
  });
  it('xhr.post() :: should post data', function(done) {
    var data = { foo: 'bar' };
    var dataJson = JSON.stringify(data);

    xhr.post('url', data).done(function(result) {
      //console.error('result ', result);
      result.should.deep.equal(data);
      done();
    });
    setTimeout(()=>{
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
    },1000);     
  });

});

  describe('_logData()', function() {
    it('should return function', function(){
      assert.equal('function',typeof xhr._logData);
    });
  });


});



describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});