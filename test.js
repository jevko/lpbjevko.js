import * as J from './lpbjevko.js'

const testbytes = [
  5, J.MODE_PREFIX, 0, 0, 0, 0, 0,
  3, J.MODE_SUFFIX, 0, 0, 0,

  J.MODE_PREFIX, 3, J.MODE_SUFFIX, 1,1,1,
  J.MODE_END,
]

const stream = J.streamy((mode, len, buf) => {
  console.log('mlb', mode, len, buf)
})

const stream2 = J.streamy(J.toTree())

stream(testbytes)

const tree = stream2(testbytes)

console.log(JSON.stringify(tree, null, 2))
console.log(tree[J.SUBS][1][J.JEVKO][J.SUFFIX])