import { http } from './http'

export const CharactersApi = {
  list: function ({ page = 1, name = '' } = {}) {
    const params = {}
    params.page = page
    if (name && name.length > 0) params.name = name
    return http.get('/character', { params }).then(r => r.data)
  },
  byId: function (id) {
    return http.get('/character/' + id).then(r => r.data)
  }
}
