<template>
  <div class="col s12 m4 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{'BillInSystem'|localize}}</span>

        <p v-for="cur of currencies" :key="cur" class="currency-line">
          <span>{{ getCurrency(cur)  }}  м³</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates'],
  data: () => ({
    currencies: ['RUB']
    // currencies: ['RUB', 'USD', 'EUR']

  }),
  computed: {
    base() {
      return (
        this.$store.getters.info.bill / (this.rates['RUB'] )
        // this.$store.getters.info.bill / (this.rates['RUB'] / this.rates['EUR'])

      )
    }
  },
  methods: {
    getCurrency(currency) {
      return Math.floor(this.base * this.rates[currency])
    }
  }
}
</script>
