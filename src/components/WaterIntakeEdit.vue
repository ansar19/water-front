<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="wi of waterIntakes" :key="wi.id" :value="wi.id">{{wi.title}}</option>
          </select>
          <label>{{'SelectCategory'|localize}}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{'Title'|localize}}</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
          >{{'Message_CategoryTitle'|localize}}</span>
        </div>

        <div class="input-field">
          <input
            id="water-body-code-and-type"
            type="text"
            v-model="waterBodyCodeAndType"
            :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="water-body-code-and-type">{{'Limit'|localize}}</label>
          <span
            v-if="$v.waterBodyCodeAndType.$dirty && !$v.waterBodyCodeAndType.required"
            class="helper-text invalid"
          >{{'Message_CategoryTitle'|localize}}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Update'|localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'
export default {
  props: {
    waterIntakes: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    waterBodyCodeAndType: '',
    current: null
  }),
  validations: {
    title: { required },
    waterBodyCodeAndType: { required }
  },
  watch: {
    current(catId) {
      const { title, waterBodyCodeAndType } = this.waterIntakes.find(c => c.id === catId)
      this.title = title
      this.waterBodyCodeAndType = waterBodyCodeAndType
    }
  },
  created() {
    const { id, title, limit } = this.waterIntakes[0]
    this.current = id
    this.title = title
    this.waterBodyCodeAndType = waterBodyCodeAndType
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const waterIntakeData = {
          id: this.current,
          title: this.title,
          waterBodyCodeAndType: this.waterBodyCodeAndType
        }
        await this.$store.dispatch('updateWaterIntake', waterIntakeData)
        this.$message(localizeFilter('Category_HasBeenUpdated'))
        this.$emit('updated', waterIntakeData)
      } catch (e) {}
    }
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
