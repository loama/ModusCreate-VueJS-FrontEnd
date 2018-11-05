<template>
  <div class="search">
    <img src="../assets/modus-text.svg">
    <div class="searchbar">

      <div class="year" v-on:click="toggleInput('years')" v-bind:class="{loading: years.loading}">
        {{years.selected}}
        <div class="loader">Loading...</div>
        <img class="black" src="../assets/arrow_up.svg">
        <img class="white" src="../assets/arrow_up-white.svg">
      </div>

      <div class="years" v-bind:class="{visible: years.open}">
        <div v-for="year in years.all"
             v-bind:key="year"
             v-bind:class="{selected: years.selected === year}"
             v-on:click="changeYear(year)">{{year}}</div>
      </div>

      <div class="manufacturer" v-on:click="toggleInput('manufacturers')" v-bind:class="{loading: manufacturers.loading, open: manufacturers.open}">
        {{manufacturers.selected}}
        <div class="loader">Loading...</div>
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

      <div class="model" v-on:click="toggleInput('models')" v-bind:class="{loading: models.loading}">
        <div class="loader">Loading...</div>
        <img class="car" src="../assets/car.svg">
        <input type="text" v-model="models.selected">
        <img class="search" src="../assets/search.svg">
      </div>

      <div class="models" v-bind:class="{open: models.open}">
        <div v-for="model in models.all" v-bind:key="model" v-on:click="selectModel(model)">
          {{model}}
        </div>
      </div>

      <div class="cards">
        <div class="card" v-for="model in models.options" v-bind:key="model.VehicleId">
          <div v-bind:style="{backgroundImage: 'url(' + modelsComplete.VehiclePicture + ')'}" class="image"></div>
          <div class="text">
            <div class="vehicle-description">{{model.VehicleDescription}}</div>
            <div class="overall-rating"> overall rating: {{modelsComplete.OverallRating}}</div>
          </div>
        </div>
      </div>

      <div class="bar"></div>

      <div class="overlay" v-on:click="closeAllSelects()"></div>
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
        selected: 'Acura',
        open: false,
        all: [],
        loading: true
      },
      years: {
        selected: 2019,
        all: [],
        open: false,
        loading: true
      },
      models: {
        selected: 'ILX',
        all: '',
        loading: true,
        open: false,
        options: []
      },
      modelsComplete: {},
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
      self.years.loading = true
      self.modelsComplete = {}
      self.models.selected = ''
      self.models.all = []
      axios.get(api + '?format=json')
        .then(function (response) {
          // handle success
          let years = []
          for (let i = 0; i < response.data.Results.length; i++) {
            years.push(response.data.Results[i].ModelYear)
          }
          self.years.all = years
          self.years.selected = years[0]
          self.years.loading = false
          self.loadManufacturers()
        })
    },
    loadManufacturers () {
      var self = this
      self.manufacturers.loading = true
      self.models.loading = true
      self.manufacturers.all = []
      self.manufacturers.selected = ''
      self.modelsComplete = {}
      self.models.selected = ''
      self.models.all = []
      axios.get(api + '/modelyear/' + self.years.selected.toString() + '?format=json')
        .then(function (response) {
          // handle success
          let manufacturers = []
          for (let i = 0; i < response.data.Results.length; i++) {
            manufacturers.push(response.data.Results[i].Make.toLowerCase())
          }
          self.manufacturers.all = manufacturers
          self.manufacturers.selected = manufacturers[0]
          self.manufacturers.loading = false
          self.loadModels()
        })
    },
    loadModels () {
      var self = this
      self.models.all = []
      self.models.loading = true
      self.modelsComplete = {}
      self.models.selected = ''
      self.models.all = []
      axios.get(api + '/modelyear/' + this.years.selected + '/make/' + this.manufacturers.selected + '?format=json')
        .then(function (response) {
          // handle success
          let models = []
          for (let i = 0; i < response.data.Results.length; i++) {
            models.push(response.data.Results[i].Model)
          }
          self.models.all = models
          self.models.loading = false
          self.models.selected = models[0]
          self.selectModel(models[0])
        })
    },
    selectModel (model) {
      this.models.open = false
      this.models.selected = model
      this.modelsComplete = {}
      var self = this
      self.models.options = []
      axios.get(api + '/modelyear/' + this.years.selected + '/make/' + this.manufacturers.selected + '/model/' + this.models.selected + '?format=json')
        .then(function (response) {
          self.models.options = response.data.Results
          for (let i = 0; i < response.data.Results.length; i++) {
            axios.get(api + '/VehicleId/' + response.data.Results[i]['VehicleId'].toString() + '?format=json')
              .then(function (response) {
                self.modelsComplete = response.data.Results[0]
                console.log(response.data.Results[0].VehiclePicture)
              })
          }
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
      transition: all 0.3s
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
      left: 101px
      height: 100%
      width: 156px
      border-right: 1px solid #E0E0E0
      cursor: pointer
      padding-right: 16px
      transition: all 0.3s
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
      left: 101px
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
      left: 274px
      height: 48px
      width: 226px
      border-radius: 0 8px 8px 0
      transition: all 0.3s

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
        background: transparent
        text-transform: uppercase

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

    .models
      position: absolute
      top: 42px
      left: 273px
      border: 1px solid #E0E0E0
      z-index: 101
      background: #FFF
      width: 225px
      border-radius: 0 0 8px 8px
      max-height: 220px
      overflow-y: scroll
      display: none

      &.open
        display: block

      > div
        border-top: 1px solid #E0E0E0
        cursor: pointer

        &:hover, &.selected
          background: #328AFD
          color: #FFFFFF

    .loading
      background: #D0D0D0
      color: #A0A0A0
      pointer-events: none
      border-right: 1px solid #BCBCBC

      input
        color: #A0A0A0

      img.white, img.black
        opacity: 0.2

    .loader, .loader:before, .loader:after
      border-radius: 50%
      width: 2.5em
      height: 2.5em
      -webkit-animation-fill-mode: both
      animation-fill-mode: both
      -webkit-animation: load7 1.8s infinite ease-in-out
      animation: load7 1.8s infinite ease-in-out

    .loader
      color: #888
      font-size: 10px
      margin: 8px auto
      position: absolute
      top: 0
      left: 0
      text-indent: -9999em
      -webkit-transform: translateZ(0)
      -ms-transform: translateZ(0)
      transform: translateZ(0)
      -webkit-animation-delay: -0.16s
      animation-delay: -0.16s
      transform: scale(0.5)

    .loader:before,
    .loader:after
      content: ''
      position: absolute
      top: 0

    .loader:before
      left: -3.5em
      -webkit-animation-delay: -0.32s
      animation-delay: -0.32s

    .loader:after
      left: 3.5em

    @-webkit-keyframes load7
      0%, 80%, 100%
        box-shadow: 0 2.5em 0 -1.3em
      40%
        box-shadow: 0 2.5em 0 0

    @keyframes load7
      0%, 80%, 100%
        box-shadow: 0 2.5em 0 -1.3em

      40%
        box-shadow: 0 2.5em 0 0

    .year
      .loader
        top: -8px
        left: 32px
        display: none

      &.loading .loader
        display: block

    .manufacturer
      .loader
        top: -8px
        left: 32px
        display: none

      &.loading .loader
        display: block

    .model
      .loader
        top: -8px
        left: 64px
        display: none

      &.loading .loader
        display: block

    .overlay
      position: fixed
      top: 0
      left: 0
      height: 100vh
      width: 100vw
      z-index: 1

    .card
      position: relative
      z-index: 2
      height: 200px
      width: 498px
      border: 1px solid #E0E0E0
      border-radius: 0
      background: #FFFFFF
      overflow: hidden

      &:first-child
        margin-top: 96px
        border-radius: 8px 8px 0 0

      &:last-child
        border-radius: 0 0 8px 8px

      &:only-child
        border-radius: 8px

      .image
        position: absolute
        top: 0
        left: 0
        height: 100%
        width: 220px
        background: #A0A0A0
        background-size: cover
        background-position: center

      .text
        position: absolute
        top: 0
        left: 220px
        height: 100%
        width: 280px
        padding: 16px
        text-align: left

      .vehicle-description
        font-weight: 600
        font-size: 18px
        line-height: 24px
        text-align: left

      .overall-rating
</style>
