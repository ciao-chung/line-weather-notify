import assert from 'assert'
describe('Global', () => {
  describe('Test now', () => {
    it('Test now format', () => {
      const current = now()
      const datetimePatten = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/g
      assert.equal(new RegExp(datetimePatten).test(current), true)
    })
  })
})