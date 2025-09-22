<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Rick & Morty – Characters</h1>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        v-model.trim="query"
        type="text"
        placeholder="Buscar por nombre…"
        class="flex-1 rounded border px-4 py-2
               bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400
               focus:outline-none focus:ring focus:border-blue-400"
        @keyup.enter="search(1)"
      />
      <button
        class="rounded px-5 py-2 bg-blue-600 text-white font-medium
               hover:bg-blue-500 transition-colors"
        @click="search(1)"
      >
        Buscar
      </button>
    </div>

    <div v-if="loading" class="text-gray-300">Cargando personajes…</div>
    <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>

    <div v-else>
      <div v-if="characters.length === 0" class="text-gray-300">Sin resultados.</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" v-else>
        <article
          v-for="(ch, i) in characters"
          :key="ch.id"
          :style="{ animationDelay: (i * 60) + 'ms' }"
          class="card relative rounded-xl overflow-hidden
                 bg-gray-800 border border-gray-700
                 shadow-lg transform transition
                 hover:-translate-y-1 hover:scale-105 hover:shadow-xl
                 hover:ring-2 hover:ring-blue-500"
        >
          <!-- Navega al detalle -->
          <router-link
            class="block focus:outline-none"
            :to="{ name: 'character-detail', params: { id: ch.id } }"
          >
            <img :src="ch.image" :alt="ch.name" class="w-full h-56 object-cover" />
            <div class="p-4">
              <h2 class="text-xl font-semibold text-white">{{ ch.name }}</h2>
              <p class="text-sm text-gray-300">
                <span class="font-medium text-gray-200">Status:</span> {{ ch.status }} ·
                <span class="font-medium text-gray-200">Species:</span> {{ ch.species }}
              </p>
              <p class="text-sm text-gray-300 mt-1">
                <span class="font-medium text-gray-200">Origin:</span>
                {{ ch.origin && ch.origin.name }}
              </p>
            </div>
          </router-link>
        </article>
      </div>

      <div class="flex items-center justify-center gap-3 mt-8" v-if="info">
        <button
          class="px-4 py-2 rounded border border-gray-700 bg-gray-800 text-gray-200
                 hover:bg-gray-700 transition-colors disabled:opacity-50"
          :disabled="page <= 1"
          @click="search(page - 1)"
        >
          ← Anterior
        </button>
        <span class="text-sm text-gray-300">
          Página <strong>{{ page }}</strong> de <strong>{{ info.pages }}</strong>
        </span>
        <button
          class="px-4 py-2 rounded border border-gray-700 bg-gray-800 text-gray-200
                 hover:bg-gray-700 transition-colors disabled:opacity-50"
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
import { CharactersApi } from '../api/characters'

export default {
  name: 'CharacterList',
  data() {
    return { query:'', page:1, characters:[], info:null, loading:false, error:null }
  },
  created() { this.search(1) },
  methods: {
    async search(nextPage) {
      this.loading = true; this.error = null
      try {
        this.page = (nextPage !== undefined && nextPage !== null) ? nextPage : this.page
        const data = await CharactersApi.list({ page: this.page, name: this.query })
        this.characters = (data && data.results) ? data.results : []
        this.info = (data && data.info) ? data.info : { pages: 1 }
      } catch (e) {
        const resp = e && e.response; const d = resp && resp.data
        this.error = (d && d.error) || (e && e.message) || 'Fallo cargando personajes'
        this.characters = []; this.info = null
      } finally { this.loading = false }
    },
  },
}
</script>

<style scoped>
@keyframes cardIn { 0%{opacity:0;transform:translateY(10px) scale(.98)} 100%{opacity:1;transform:none} }
.card { animation: cardIn .45s cubic-bezier(.22,.61,.36,1) both; }
</style>
