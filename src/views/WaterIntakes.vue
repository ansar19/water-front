<template>
  <div>
    <div class="page-title">
      <h3>{{'WaterIntakes'|localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading"/>
      <div class="row" v-else>
        <CreateWaterIntake @created="addNewWaterIntake"/>

        <WaterIntakeEdit
          v-if="waterIntakes.length"
          :waterIntakes="waterIntakes"
          :key="waterIntakes.length + updateCount"
          @updated="updateWaterIntake"
        /> 
        <p v-else class="center">{{'NoCategories'|localize}}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CreateWaterIntake from '@/components/CreateWaterIntake'
import WaterIntakeEdit from '@/components/WaterIntakeEdit'

export default {
  name: 'waterintakes',
  metaInfo() {
    return {
      title: this.$title('Menu_WaterIntakes')
    }
  },
  data: () => ({
    waterIntakes: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.waterIntakes = await this.$store.dispatch('fetchWaterIntakes')
    this.loading = false
  },
  components: {
    CreateWaterIntake,
    WaterIntakeEdit
  },
  methods: {
    addNewWaterIntake(waterIntake) {
      this.waterIntakes.push(waterIntake)
    },
    updateWaterIntake(waterIntake) {
      const idx = this.waterIntakes.findIndex(wi => wi.id === waterIntake.id)
      this.waterIntakes[idx].title = waterIntake.title
      this.waterIntakes[idx].limit = waterIntake.limit
      this.updateCount++
    }
  }
}
</script>

