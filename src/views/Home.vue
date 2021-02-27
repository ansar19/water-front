<template>
  <div>
    <div class="page-title">
      <h3>{{ 'General_Info' | localize }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <div class="row">
      <div class="col s12 m8 l8">
        <div class="history-chart" style="text-align: center">
          <canvas ref="canvas"></canvas>
        </div>
      </div>

      <Loader v-if="loading" />

      <div v-else>
        <!-- <HomeBill :rates="currency.rates" style="text-align: center" /> -->

        <!-- <HomeCurrency :rates="currency.rates" :date="currency.date"/> -->
      </div>
    </div>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'

import HomeBill from '@/components/HomeBill'
// import HomeCurrency from '@/components/HomeCurrency'
import { Pie } from 'vue-chartjs'
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'home',
  metaInfo() {
    return {
      title: this.$title('Menu_Balance'),
    }
  },
  extends: Pie,
  data: () => ({
    loading: true,
    currency: null,
    records: [],
  }),
  async mounted() {
    // this.currency = await this.$store.dispatch('fetchCurrency')

    this.records = await this.$store.dispatch('fetchRecords')
    const categoires = await this.$store.dispatch('fetchCategories')
    const waterIntakes = await this.$store.dispatch('fetchWaterIntakes')
    const waterConsumers = await this.$store.dispatch('fetchWaterConsumers')

    this.setup(categoires, waterIntakes, waterConsumers)

    this.loading = false
  },
  methods: {
    async refresh() {
      this.loading = true
      this.records = await this.$store.dispatch('fetchRecords')
      const categoires = await this.$store.dispatch('fetchCategories')
      const waterIntakes = await this.$store.dispatch('fetchWaterIntakes')
      const waterConsumers = await this.$store.dispatch('fetchWaterConsumers')

      this.setup(categoires, waterIntakes, waterConsumers)
      // this.currency = await this.$store.dispatch('fetchCurrency')
      this.loading = false
    },
    setup(categoires, waterIntakes, waterConsumers) {
      this.records.map((record) => {
        return {
          ...record,
          categoryName: categoires.find((c) => c.id === record.categoryId)
            .title,
          categoryCode: categoires.find((c) => c.id === record.categoryId).code,
          typeClass: record.type === 'income' ? 'green' : 'red',
          waterBody: waterIntakes.find((wi) => wi.id === record.waterIntakeId),
          waterConsumer: waterConsumers.find(
            (wc) => wc.id === record.waterConsumerId
          ),
          typeText:
            record.type === 'income'
              ? localizeFilter('Income')
              : localizeFilter('Outcome'),
        }
      })

      this.renderChart({
        labels: categoires.map((c) => c.title),
        datasets: [
          {
            label: localizeFilter('CostsForCategories'),
            data: categoires.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === 'outcome') {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: [
              '#f44336',
              '#9e9e9e',
              '#e91e63',
              '#9c27b0',
              '#673ab7',
              '#3f51b5',
              '#2196f3',
              '#03a9f4',
              '#00bcd4',
              '#009688',
              '#4caf50',
              '#ffeb3b',
              '#ffc107',
              '#ff9800',
              '#ff5722',
              '#795548',
              '#607d8b'
            ],
            borderColor: [
              '#f44336',
              '#9e9e9e',
              '#e91e63',
              '#9c27b0',
              '#673ab7',
              '#3f51b5',
              '#2196f3',
              '#03a9f4',
              '#00bcd4',
              '#009688',
              '#4caf50',
              '#ffeb3b',
              '#ffc107',
              '#ff9800',
              '#ff5722',
              '#795548',
              '#607d8b'
            ],
            borderWidth: 1,
          },
        ],
      })
    },
  },
  components: {
    HomeBill,
    // HomeCurrency
  },
}
</script>
