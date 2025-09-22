import Vue from 'vue'
import Router from 'vue-router'
import CharacterList from '../components/CharacterList.vue'
import CharacterDetail from '../views/CharacterDetail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history', // tendrás /character/2 real
  routes: [
    { path: '/', name: 'home', component: CharacterList },
    { path: '/character/:id', name: 'character-detail', component: CharacterDetail, props: true },
  ],
  scrollBehavior () { return { x: 0, y: 0 } }
})
