<template>
  <div class="dark min-h-screen bg-gray-900 text-gray-100">
    <CharacterList />
  </div>
</template>

<script>
import CharacterList from './components/CharacterList.vue'

export default {
  name: 'App',
  components: {
    CharacterList
  }
}
</script>

<style>

</style>
