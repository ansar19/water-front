<template>
  <div>
    <div class="page-title">
      <h3>{{'WaterConsumers'|localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading"/>
      <div class="row" v-else>
        <CreateWaterConsumer @created="addNewWaterConsumer"/>

        <WaterConsumerEdit
          v-if="waterConsumers.length"
          :waterConsumers="waterConsumers"
          :key="waterConsumers.length + updateCount"
          @updated="updateWaterConsumer"
        /> 
        <p v-else class="center">{{'NoWaterConsumers'|localize}}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CreateWaterConsumer from '@/components/CreateWaterConsumer'
import WaterConsumerEdit from '@/components/WaterConsumerEdit'

export default {
  name: 'waterconsumers',
  metaInfo() {
    return {
      title: this.$title('Menu_WaterConsumers')
    }
  },
  data: () => ({
    waterConsumers: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.waterConsumers = await this.$store.dispatch('fetchWaterConsumers')
    this.loading = false
  },
  components: {
    CreateWaterConsumer,
    WaterConsumerEdit
  },
  methods: {
    addNewWaterConsumer(waterConsumer) {
      this.waterConsumers.push(waterConsumer)
    },
    updateWaterConsumer(waterConsumer) {
      const idx = this.waterConsumers.findIndex(wc => wc.id === waterConsumer.id)
      this.waterConsumers[idx].waterConsumerName = waterConsumer.waterConsumerName
      this.waterConsumers[idx].waterConsumerType = waterConsumer.waterConsumerType
      this.waterConsumers[idx].waterConsumerDetail = waterConsumer.waterConsumerDetail
      this.updateCount++
    }
  }
}
</script>
