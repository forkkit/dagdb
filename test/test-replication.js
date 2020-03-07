const { it } = require('mocha')
const inmem = require('../src/store/inmemory')
const { kv } = require('../')
const bare = require('../bare')
const test = it
const same = require('assert').deepStrictEqual
const Block = require('@ipld/block')

const create = async (_kv = kv) => {
  const store = inmem()
  const kvs = await _kv.create(store)
  return { store, kvs }
}

const basics = async kv => {
  const { kvs } = await create(kv)
  kvs.set('test', { hello: 'world' })
  let obj = await kvs.get('test')
  same(obj, { hello: 'world' })
  await kvs.commit()
  obj = await kvs.get('test')
  same(obj, { hello: 'world' })
  return kvs
}

test('basic replication', async () => {
  const base = await basics()
  const { kvs } = await create()
  const cid = await kvs.pull(base)
})

/*
test('basic overwrite', async () => {
  let { store, kvs } = await create()
  kvs.set('test', { foo: 0 })
  const head = await kvs.commit()
  kvs = kv.transaction(head, store)
  same(await kvs.get('test'), { foo: 0 })
  await kvs.set('test', { foo: 1 })
  same(await kvs.get('test'), { foo: 1 })
  await kvs.commit()
  same(await kvs.get('test'), { foo: 1 })
})

test('not found', async () => {
  const { store, kvs } = await create()
  try {
    await kvs.get('test')
  } catch (e) {
    if (e.kvs !== 'notfound') {
      throw e
    }
  }
})

const notfound = async (kvs, key) => {
  try {
    await kvs.get(key)
  } catch (e) {
    if (e.status !== 404) {
      throw e
    }
    return null
  }
  throw new Error(`Found ${key}`)
}

test('basic removal', async () => {
  let { store, kvs } = await create()
  kvs.set('test', { foo: 0 })
  const head = await kvs.commit()
  kvs = kv.transaction(head, store)
  same(await kvs.get('test'), { foo: 0 })
  kvs.del('test')
  await notfound(kvs, 'test')
  const next = await kvs.commit()
  await notfound(kvs, 'test')
  kvs = kv.transaction(next, store)
  await notfound(kvs, 'test')
})

test('custom codec', async () => {
  const { kv } = bare(Block, 'dag-json')
  await basics(kv)
})
*/
