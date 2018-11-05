import Vue from 'vue'
import Search from '@/components/search'

describe('search.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Search)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.searchbar'))
      .toBeDefined()
  })
})
