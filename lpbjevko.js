export const MODE_LEN = 0
export const MODE_PREFIX = 128
export const MODE_SUFFIX = 129
export const MODE_END = 130
export const MODE_DONE = 131

export const streamy = (next) => {
  let mode = MODE_LEN
  let len = 0
  let buf = []
  let depth = 0

  return (bytes) => {
    let i = 0
    while (i < bytes.length) {
      const b = bytes[i]
      if (mode === MODE_LEN) {
        if (b < 128) {
          if (buf.length < 9) {
            buf.push(b)
          } else throw Error("1")
        } else {
          // console.log('buf', buf)
          for (const d of buf) {
            len = (len << 7) | d
          }
          // console.log('len', len)
          buf = []
          mode = b
        }
      } else if (mode <= MODE_END) {
        if (buf.length < len) {
          buf.push(b)
          // console.log(buf)
        } else {
          i -= 1
          next(mode, len, buf)
          buf = []
          len = 0
          if (mode === MODE_PREFIX) {
            depth += 1
            mode = MODE_LEN
          } else if (mode === MODE_SUFFIX) {
            if (depth === 0) throw Error("4")
            depth -= 1
            mode = MODE_LEN
          } else if (mode === MODE_END) {
            if (depth !== 0) throw Error("3")
            mode = MODE_DONE
          }
        }
      } else {
        throw Error("2")
      }
      i += 1
    }
    if (mode === MODE_END) {
      const ret = next(mode, len, buf)
      buf = []
      return ret
    }
  }
}


export const PREFIX = 0
export const JEVKO = 1

export const SUBS = 0
export const SUFFIX = 1

export const toTree = () => {
  let parent = [[], []]
  let parents = []
  return (mode, len, buf) => {
    if (mode === MODE_PREFIX) {
      const jevko = [[], []]
      parent[SUBS].push([buf, jevko])
      parents.push(parent)
      parent = jevko
    } else if (mode === MODE_SUFFIX) {
      parent[SUFFIX] = buf
      parent = parents.pop()
    } else {
      parent[SUFFIX] = buf
      return parent
    }
  }
}
