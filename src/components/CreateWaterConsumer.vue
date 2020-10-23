<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Create'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <p>
          <label>
            <input name="group1" type="radio" value="internalWaterUser" v-model="waterConsumerType" />
            <span>{{ 'Internal_Water_Consumer' | localize }}</span>
          </label>
        </p>
        <p>
          <label>
            <input name="group1" type="radio" value="secondaryWaterUser" v-model="waterConsumerType" />
            <span>{{ 'Secondary_Water_Consumer' | localize }}</span>
          </label>
        </p>
        <!-- Internal -->
        <template v-if="waterConsumerType==='internalWaterUser'">
          <div class="input-field">
            <input id="name" type="text" v-model="waterConsumerName"
              :class="{invalid: $v.waterConsumerName.$dirty && !$v.waterConsumerName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.waterConsumerName.$dirty && !$v.waterConsumerName.required"
              class="helper-text invalid">{{'Message_WaterConsumerTitle'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="water-consumer-detail">{{'WaterConsumer_Detail' | localize}}</label>
            <textarea id="water-consumer-detail" type="textarea" v-model="waterConsumerDetail"
              class="materialize-textarea">
          </textarea>
          </div>
        </template>
        <!-- END internal -->

        <!-- Secondary -->
        <template v-else>
          <div class="input-field">
            <input id="name" type="text" v-model="waterConsumerName"
              :class="{invalid: $v.waterConsumerName.$dirty && !$v.waterConsumerName.required}">
            <label for="name">{{'Title'|localize}}</label>
            <span v-if="$v.waterConsumerName.$dirty && !$v.waterConsumerName.required"
              class="helper-text invalid">{{'Message_WaterConsumerTitle'|localize}}</span>
          </div>

          <div class="input-field">
            <label for="water-consumer-detail">{{'WaterConsumer_Detail' | localize}}</label>
            <textarea id="water-consumer-detail" type="textarea" v-model="waterConsumerDetail"
              class="materialize-textarea">
          </textarea>
            
          </div>
          <br>secondary<br>
        </template>
        <!-- END secondary -->

<!-- 
        <div class="input-field">
          <select ref="waterBodyCodeAndType" v-model="waterBodyCodeAndType" class="form-control" id="water-body-code">
            <option v-for="(option, index) in waterBodyCodeAndTypeOptions" v-bind:value="option" v-bind:key="index">
              {{ option.waterBodyName }}
            </option>
          </select>
          <label for="water-body-code">{{'Water_Body_Code_And_Type'|localize}}</label>
          <span v-if="$v.waterBodyCodeAndType.$dirty && !$v.waterBodyCodeAndType.required"
            class="helper-text invalid">{{'Message_WaterConsumerTitle'|localize}}</span>
        </div> -->

        <button class="btn waves-effect waves-light" type="submit">
          {{'Create'|localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'
import 'vue-select/dist/vue-select.css';

export default {
  data: () => ({
    waterConsumerName: '',
    waterConsumerType: 'internalWaterUser',
    waterConsumerDetail: ''
  }),
  validations: {
    waterConsumerName: { required },
    waterConsumerType: { required }
  },
  mounted() {
    // M.updateTextFields(),
    // setTimeout(() => {
    //   this.waterConsumerType = M.FormSelect.init(this.$refs.waterConsumerType)
    //   M.updateTextFields()
    // }, 0)
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const waterConsumer = await this.$store.dispatch('createWaterConsumer', {
          waterConsumerName: this.waterConsumerName,
          waterConsumerType: this.waterConsumerType,
          waterConsumerDetail: this.waterConsumerDetail
        })
        this.waterConsumerName = ''
        this.waterConsumerType = ''
        this.waterConsumerDetail = ''
        this.$v.$reset()
        this.$message(localizeFilter('WaterConsumer_HasBeenCreated'))
        this.$emit('created', waterConsumer)
      } catch (e) {}
    }
  },
  destroyed() {
    if (this.waterConsumerType && this.waterConsumerType.destroy) {
      this.waterConsumerType.destroy()
    }
  }
}
</script>
