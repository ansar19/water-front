<template>
  <div>
    <div class="page-title">
      <h3>{{'History_Title'|localize}}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!records.length">
      {{'NoRecords'|localize}}.
      <router-link to="/record">{{'AddFirst'|localize}}</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items"/>

      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back' | localize"
        :next-text="'Forward' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/HistoryTable'
import { Pie } from 'vue-chartjs'
import localizeFilter from '@/filters/localize.filter'

export default {
  name: 'history',
  metaInfo() {
    return {
      title: this.$title('Menu_History')
    }
  },
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categoires = await this.$store.dispatch('fetchCategories')
    const waterIntakes = await this.$store.dispatch('fetchWaterIntakes')
    const waterConsumers = await this.$store.dispatch('fetchWaterConsumers')

    this.setup(categoires, waterIntakes, waterConsumers)
    
    this.loading = false
  },
  methods: {
    setup(categoires, waterIntakes, waterConsumers) {
      this.setupPagination(
        this.records.map(record => {
          return {
            ...record,
            categoryName: categoires.find(c => c.id === record.categoryId)
              .title,
            categoryCode: categoires.find(c => c.id === record.categoryId)
              .code,
            typeClass: record.type === 'income' ? 'green' : 'red',
            waterBody: waterIntakes.find(wi => wi.id === record.waterIntakeId),
            waterConsumer: waterConsumers.find(wc => wc.id === record.waterConsumerId),
            typeText:
              record.type === 'income'
                ? localizeFilter('Income')
                : localizeFilter('Outcome')
          }
        })
      )

      this.renderChart({
        labels: categoires.map(c => c.title),
        datasets: [
          {
            label: localizeFilter('CostsForCategories'),
            data: categoires.map(c => {
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
            borderWidth: 1
          }
        ]
      })
    }
  },
  components: {
    HistoryTable
  }
}
</script>

