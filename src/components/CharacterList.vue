<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Rick & Morty – Characters</h1>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        v-model.trim="query"
        type="text"
        placeholder="Buscar por nombre…"
        class="flex-1 rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
        @keyup.enter="search(1)"
      />
      <button
        class="rounded px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        @click="search(1)"
      >
        Buscar
      </button>
    </div>

    <div v-if="loading" class="text-gray-600">Cargando personajes…</div>
    <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>

    <div v-else>
      <div v-if="characters.length === 0" class="text-gray-600">Sin resultados.</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" v-else>
        <article
          v-for="ch in characters"
          :key="ch.id"
          class="rounded-lg shadow border border-gray-100 overflow-hidden bg-white"
        >
          <img :src="ch.image" :alt="ch.name" class="w-full h-56 object-cover" />
          <div class="p-4">
            <h2 class="text-xl font-semibold">{{ ch.name }}</h2>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Status:</span> {{ ch.status }} ·
              <span class="font-medium">Species:</span> {{ ch.species }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              <span class="font-medium">Origin:</span>
              {{ ch.origin && ch.origin.name }}
            </p>
          </div>
        </article>
      </div>

      <div class="flex items-center justify-center gap-3 mt-8" v-if="info">
        <button
          class="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
          :disabled="page <= 1"
          @click="search(page - 1)"
        >
          ← Anterior
        </button>
        <span class="text-sm text-gray-700">
          Página <strong>{{ page }}</strong> de <strong>{{ info.pages }}</strong>
        </span>
        <button
          class="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
          :disabled="page >= info.pages"
          @click="search(page + 1)"
        >
          Siguiente →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// 🔧 RUTA CORRECTA: desde components/ a api/ es ../api/characters
import { CharactersApi } from '../api/characters'

export default {
  name: 'CharacterList',
  data() {
    return {
      query: '',
      page: 1,
      characters: [],
      info: null,
      loading: false,
      error: null,
    }
  },
  created() {
    this.search(1)
  },
  methods: {
    async search(nextPage) {
      this.loading = true
      this.error = null
      try {
        this.page = (nextPage !== undefined && nextPage !== null) ? nextPage : this.page
        const data = await CharactersApi.list({ page: this.page, name: this.query })
        this.characters = (data && data.results) ? data.results : []
        this.info = (data && data.info) ? data.info : { pages: 1 }
      } catch (e) {
        const resp = e && e.response
        const d = resp && resp.data
        this.error = (d && d.error) || (e && e.message) || 'Fallo cargando personajes'
        this.characters = []
        this.info = null
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* Todo con Tailwind */
</style>
