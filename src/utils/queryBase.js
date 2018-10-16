/**
 * Created by luyanan on 18/9/12.
 * userBase
 */
/* eslint-disable one-var */
import request from '@/utils/request'

var objCache = {
  userBase: {}
}
var objHcache = {
  userBase: {}
}
var objCacheHandler = {
  userBase: function(id) {
    var hc = objHcache.userBase[id]
    request.get('/ajax/sys/qo?id=' + id, null, function(data) {
      delete objHcache.userBase[id]
      if (data.success) {
        objCache.userBase[id] = data.data
        for (let i = 0; i < hc.length; ++i) {
          hc[i](true, data.data)
        }
      } else {
        for (let i = 0; i < hc.length; ++i) {
          hc[i](false)
        }
      }
    })
  }
}
var cacheModel = {
  getUserBase: function(id, handler) {
    var data = objCache.userBase[id]
    if (data) {
      handler(true, data)
    } else {
      if (objHcache.userBase[id]) {
        objHcache.userBase[id].push(handler)
      } else {
        objHcache.userBase[id] = []
        objHcache.userBase[id].push(handler)
        objCacheHandler.userBase(id)
      }
    }
  }
}

export default cacheModel
