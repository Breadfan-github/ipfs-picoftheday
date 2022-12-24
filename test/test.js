const Pic = artifacts.require("Pic")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Pic', (accounts) => {
  let pic
	before(async() => {
	pic = await Pic.deployed()
	})
	
	describe('deployment', async() => {
		it('deploys successfully', async() => {			
			const address = await pic.address
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
			assert.notEqual(address, 0x0)	
		})
	})

	describe('storage', async() => {
		it('updates the PicHash', async() => {
			let picHash = 'abc'
			await pic.set(picHash)
			const result = await pic.get()
			assert.equal(result, picHash)	
		})
	})

})