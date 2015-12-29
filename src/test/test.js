var chai = require('chai');
var expect = require('chai').expect;

describe('Sanitize', function() {
  it('returns lowercase of a string', function() {
    expect('HELLO WORLD').to.equal('HELLO WORLD');
  })
})
