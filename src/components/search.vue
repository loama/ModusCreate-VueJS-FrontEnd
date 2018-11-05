<template>
  <div class="search">
    <img src="../assets/modus-text.svg">
    <div class="searchbar">
      <div class="year"> {{years.selected}}</div>
      <div class="years"></div>

      <div class="manufacturer">{{manufacturers.selected}}</div>

      <div class="model">
        <input type="text">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      manufacturers: {
        selected: 'Audi'
      },
      years: {
        selected: 2018
      },
      msg: ''
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
    height: 48px
    width: 500px
    max-width: calc(100vw - 32px)
    background: #FFFFFF
    border-radius: 8px
    box-shadow: 0 1px 3px #888
    font-weight: 600
    font-size: 16px
    line-height: 48px

    .year
      position: absolute
      top: 0
      left: 0
      height: 100%
      width: 100px
      border-right: 1px solid #E0E0E0
      cursor: pointer
      border-radius: 8px 0 0 8px

      &:hover
        background: #328AFD
        color: #FFF

    .manufacturer
      position: absolute
      top: 0
      left: 100px
      height: 100%
      width: 100px
      border-right: 1px solid #E0E0E0
      cursor: pointer

      &:hover
        background: #328AFD
        color: #FFF
</style>
