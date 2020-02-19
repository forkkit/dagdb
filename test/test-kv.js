
const { it } = require('mocha')
const inmem = require('../src/store/inmemory')
const { kv } = require('../')
const test = it
const same = require('assert').deepStrictEqual

test('basic set/get', async () => {
  const store = inmem()
  const kvs = await kv.create(store)
  await kvs.set('test', { hello: 'world' })
  const obj = await kvs.get('test')
  same(obj, { hello: 'world' })
})