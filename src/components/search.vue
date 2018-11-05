<template>
  <div class="search">
    <img src="../assets/modus-text.svg">
    <div class="searchbar">

      <div class="year" v-on:click="toggleInput('years')">
        {{years.selected}}
        <img class="black" src="../assets/arrow_up.svg">
        <img class="white" src="../assets/arrow_up-white.svg">
      </div>

      <div class="years" v-bind:class="{visible: years.open}">
        <div v-for="year in years.all"
             v-bind:key="year"
             v-bind:class="{selected: years.selected === year}"
             v-on:click="changeYear(year)">{{year}}</div>
      </div>

      <div class="manufacturer" v-on:click="toggleInput('manufacturers')" v-bind:class="{open: manufacturers.open}">
        {{manufacturers.selected}}
        <img class="black" src="../assets/arrow_up.svg">
        <img class="white" src="../assets/arrow_up-white.svg">
      </div>

      <div class="manufacturers" v-bind:class="{visible: manufacturers.open}">
        <div v-for="manufacturer in manufacturers.all"
             v-on:click="changeManufacturer(manufacturer)"
             v-bind:class="{selected: manufacturers.selected === manufacturer}"
             v-bind:key="manufacturer">
          {{manufacturer}}
        </div>
      </div>

      <div class="model">
        <img class="car" src="../assets/car.svg">
        <input type="text" placeholder="model ..." v-model="models.selected">
        <img class="search" src="../assets/search.svg">
      </div>

      <div class="bar"></div>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
const api = 'https://one.nhtsa.gov/webapi/api/SafetyRatings'

export default {
  name: 'Search',
  data () {
    return {
      manufacturers: {
        selected: 'Audi',
        open: false,
        all: ['Audi', 'Ford', 'Mazda', 'Mercedes Benz']
      },
      years: {
        selected: 2018,
        all: [2018],
        open: false
      },
      models: {
        selected: 'A3',
        all: ''
      },
      msg: ''
    }
  },
  methods: {
    closeAllSelects () {
      this.years.open = false
      this.manufacturers.open = false
      this.models.open = false
    },
    changeYear (year) {
      this.closeAllSelects()
      this.years.selected = year
      this.manufacturers.selected = ''
      this.manufacturers.all = []
      this.models.selected = ''
      this.models.all = []
      this.loadManufacturers()
    },
    changeManufacturer (manufacturer) {
      this.closeAllSelects()
      this.manufacturers.selected = manufacturer
      this.loadModels()
    },
    toggleInput (input) {
      var newValue = !this[input]['open']
      this.closeAllSelects()
      this[input]['open'] = newValue
    },
    loadYears () {
      var self = this
      axios.get(api + '?format=json')
        .then(function (response) {
          // handle success
          let years = []
          for (let i = 0; i < response.data.Results.length; i++) {
            years.push(response.data.Results[i].ModelYear)
          }
          self.years.all = years
          self.years.selected = years[0]
          self.loadManufacturers()
        })
    },
    loadManufacturers () {
      var self = this
      self.manufacturers.all = []
      self.manufacturers.selected = ''
      axios.get(api + '/modelyear/' + self.years.selected.toString() + '?format=json')
        .then(function (response) {
          // handle success
          let manufacturers = []
          for (let i = 0; i < response.data.Results.length; i++) {
            manufacturers.push(response.data.Results[i].Make.toLowerCase())
          }
          self.manufacturers.all = manufacturers
          self.manufacturers.selected = manufacturers[0]
          self.loadModels()
        })
    },
    loadModels () {
      var self = this
      self.models.all = []
      self.models.selected = ''
      axios.get(api + '/modelyear/' + this.years.selected + '/make/' + this.manufacturers.selected + '?format=json')
        .then(function (response) {
          // handle success
          let models = []
          for (let i = 0; i < response.data.Results.length; i++) {
            models.push(response.data.Results[i].Model.toLowerCase())
          }
          self.models.all = models
          self.models.selected = models[0]
        })
    }
  },
  mounted () {
    this.loadYears()
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
    transition: all 0.3s

  .searchbar
    position: absolute
    top: 240px
    left: calc(50vw - 250px)
    height: 48px
    width: 500px
    max-width: calc(100vw - 32px)
    line-height: 48px

    .bar
      position: absolute
      z-index: 101
      top: 0
      left: 0
      background: #FFFFFF
      border-radius: 8px
      box-shadow: 0 1px 3px #888
      font-weight: 600
      height: 48px
      width: 500px
      font-size: 16px

    .year
      position: absolute
      z-index: 102
      top: 0
      left: 0
      height: 100%
      width: 84px
      border-right: 1px solid #E0E0E0
      cursor: pointer
      border-radius: 8px 0 0 8px
      padding-right: 16px

      &:hover
        background: #328AFD
        color: #FFF

      img.white
        opacity: 0

      img.black
        opacity: 1

      &:hover
        img.white
          opacity: 1
        img.black
          opacity: 0

      &.open
        img
          transform: rotate(180deg)

      img
        position: absolute
        top: 12px
        right: 8px
        height: 24px
        width: 24px
        left: unset

    .years
      position: absolute
      z-index: 100
      top: 44px
      left: 0
      border-radius: 0 0 8px 8px
      border: 1px solid #E0E0E0
      background: #FFFFFF
      max-height: 220px
      overflow-y: scroll
      display: none

      &.visible
        display: block

      > div
        height: 48px
        width: 100px
        border-top: 1px solid #E0E0E0
        cursor: pointer

        &:hover, &.selected
          background: #328AFD
          color: #FFF

    .manufacturer
      position: absolute
      z-index: 102
      top: 0
      left: 100px
      height: 100%
      width: 156px
      border-right: 1px solid #E0E0E0
      cursor: pointer
      padding-right: 16px
      text-transform: capitalize

      &:hover
        background: #328AFD
        color: #FFF

      img.white
        opacity: 0

      img.black
        opacity: 1

      &:hover
        img.white
          opacity: 1
        img.black
          opacity: 0

      &.open
        img
          transform: rotate(180deg)

      img
        position: absolute
        top: 12px
        right: 8px
        height: 24px
        width: 24px
        left: unset

    .manufacturers
      position: absolute
      z-index: 101
      top: 44px
      left: 100px
      width: 172px
      max-height: 220px
      overflow-y: scroll
      border: 1px solid #E0E0E0
      border-radius: 0 0 8px 8px
      background: #FFFFFF
      display: none
      cursor: pointer
      text-transform: capitalize

      &.visible
        display: block

      >div
        border-top: 1px solid #E0E0E0
        cursor: pointer

        &:hover, &.selected
          background: #328AFD
          color: #FFFFFF

    .model
      position: absolute
      z-index: 102
      top: 0
      left: 273px
      height: 48px
      width: 220px
      background: red

      input
        position: absolute
        top: 0
        left: 0
        height: 48px
        width: 148px
        border: none
        padding: 0 32px 0 48px
        font-size: 16px
        border-radius: 0 8px 8px 0
        cursor: pointer

      img.car
        position: absolute
        z-index: 102
        top: 11px
        left: 12px
        height: 24px
        width: 24px

      img.search
        position: absolute
        top: 12px
        right: 12px
        z-index: 102
        height: 24px
        width: 24px
        left: unset
</style>
