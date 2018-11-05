<template>
  <div class="search">
    <img src="../assets/modus-text.svg">
    <div class="searchbar"></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  img
    position: absolute
    top: 20px
    left: calc(50vw - 100px)
    height: 200px
    width: 200px

  .searchbar
    position: absolute
    top: 240px
    left: calc(50vw - 250px)
    height: 56px
    width: 500px
    max-width: calc(100vw - 32px)
    background: #FFFFFF
    border-radius: 8px
    box-shadow: 0 1px 3px #888
</style>
