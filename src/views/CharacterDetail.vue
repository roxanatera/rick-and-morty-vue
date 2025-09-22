<template>
  <div class="max-w-5xl mx-auto p-6">
    <button class="mb-6 px-4 py-2 rounded border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
            @click="$router.push({ name: 'home' })">
      ← Back
    </button>

    <div v-if="loading" class="text-gray-300">Loading character…</div>
    <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>

    <div v-else-if="character" class="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
      <div class="flex flex-col md:flex-row">
        <img :src="character.image" :alt="character.name" class="w-full md:w-64 h-64 object-cover" />
        <div class="p-6 flex-1">
          <h1 class="text-3xl font-bold text-white">{{ character.name }}</h1>

          <div class="mt-3 text-gray-200">
            <p><span class="font-semibold">ID:</span> {{ character.id }}</p>
            <p><span class="font-semibold">Status:</span> {{ character.status }}</p>
            <p><span class="font-semibold">Species:</span> {{ character.species }}</p>
            <p><span class="font-semibold">Type:</span> {{ character.type && character.type.length ? character.type : '—' }}</p>
            <p><span class="font-semibold">Gender:</span> {{ character.gender }}</p>
            <p class="mt-2">
              <span class="font-semibold">Origin:</span>
              {{ character.origin && character.origin.name }}
              <a v-if="character.origin && character.origin.url"
                 :href="character.origin.url" target="_blank" rel="noopener"
                 class="text-blue-400 hover:underline ml-1">({{ character.origin.url }})</a>
            </p>
            <p>
              <span class="font-semibold">Location:</span>
              {{ character.location && character.location.name }}
              <a v-if="character.location && character.location.url"
                 :href="character.location.url" target="_blank" rel="noopener"
                 class="text-blue-400 hover:underline ml-1">({{ character.location.url }})</a>
            </p>
            <p class="mt-2">
              <span class="font-semibold">API URL:</span>
              <a :href="character.url" target="_blank" rel="noopener" class="text-blue-400 hover:underline">
                {{ character.url }}
              </a>
            </p>
            <p class="mt-2"><span class="font-semibold">Created:</span> {{ createdAt }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-gray-700">
        <h2 class="text-2xl font-semibold mb-3">Episodes ({{ episodesNumbers.length }})</h2>
        <div class="flex flex-wrap gap-2">
          <a v-for="ep in episodesNumbers" :key="ep.id"
             :href="ep.url" target="_blank" rel="noopener"
             class="px-3 py-1 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-600 text-sm">
            Episode {{ ep.id }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CharactersApi } from '../api/characters'

export default {
  name: 'CharacterDetail',
  props: { id: { type: [String, Number], required: false } },
  data: function () {
    return { character: null, loading: false, error: null }
  },
  computed: {
    characterId: function () {
      var pid = this.id != null ? this.id : (this.$route && this.$route.params && this.$route.params.id)
      return Number(pid)
    },
    createdAt: function () {
      var c = this.character
      if (!c || !c.created) return '—'
      try { return new Date(c.created).toLocaleString() } catch (e) { return c.created }
    },
    episodesNumbers: function () {
      var c = this.character
      var urls = (c && c.episode) ? c.episode : []
      var out = []
      for (var i = 0; i < urls.length; i++) {
        var parts = urls[i].split('/').filter(function (p) { return p && p.length })
        var last = parts[parts.length - 1]
        var num = Number(last)
        if (!isNaN(num)) out.push({ id: num, url: urls[i] })
      }
      return out
    }
  },
  created: function () { this.fetchCharacter() },
  watch: { '$route.params.id': function () { this.fetchCharacter() } },
  methods: {
    fetchCharacter: async function () {
      this.loading = true; this.error = null; this.character = null
      try {
        var data = await CharactersApi.byId(this.characterId)
        this.character = data
      } catch (e) {
        var resp = e && e.response; var d = resp && resp.data
        this.error = (d && d.error) || (e && e.message) || 'Error loading character'
      } finally { this.loading = false }
    }
  }
}
</script>

<style scoped>
/* todo con Tailwind */
</style>
