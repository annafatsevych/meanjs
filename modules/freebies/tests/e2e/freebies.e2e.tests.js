'use strict';

describe('Freebies E2E Tests:', function () {
  describe('Test freebies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/freebies');
      expect(element.all(by.repeater('freebie in freebies')).count()).toEqual(0);
    });
  });
});
