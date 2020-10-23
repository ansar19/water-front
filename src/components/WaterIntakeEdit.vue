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
          <label>{{'SelectWaterIntake'|localize}}</label>
        </div>

        <div class="input-field">
          <input id="name-edit" type="text" v-model="title" :class="{invalid: $v.title.$dirty && !$v.title.required}">
          <label for="name-edit">{{'Title'|localize}}</label>
          <span v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid">{{'Message_WaterIntakeTitle'|localize}}</span>
        </div>

        <div class="input-field">
          <select ref="waterBodyCodeAndType" v-model="waterBodyCodeAndType" class="form-control" id="water-body-code">
            <option v-for="option in waterBodyCodeAndTypeOptions" :value="option" :key="option.id">
              {{ option.waterBodyName }}
            </option>
          </select>
          <label for="water-body-code">{{'Water_Body_Code_And_Type'|localize}}</label>
          <span v-if="$v.waterBodyCodeAndType.$dirty && !$v.waterBodyCodeAndType.required"
            class="helper-text invalid">{{'Message_WaterIntakeTitle'|localize}}</span>
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
import 'vue-select/dist/vue-select.css';
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
      waterBodyCodeAndType: null,
      waterBodyCodeAndTypeOptions: [{
          waterBodyCode: "10",
          waterBodyName: "Море"
        },
        {
          waterBodyCode: "20",
          waterBodyName: "Река"
        },
        {
          waterBodyCode: "21",
          waterBodyName: "Пересыхающая река"
        },
        {
          waterBodyCode: "30",
          waterBodyName: "Озеро"
        },
        {
          waterBodyCode: "40",
          waterBodyName: "Водохранилище, пруд"
        },
        {
          waterBodyCode: "41",
          waterBodyName: "Водохранилище наливное"
        },
        {
          waterBodyCode: "50",
          waterBodyName: "Магистральный канал"
        },
        {
          waterBodyCode: "55",
          waterBodyName: "Магистральный трубопровод"
        },
        {
          waterBodyCode: "60",
          waterBodyName: "Подземный водоносный горизонт"
        },
        {
          waterBodyCode: "61",
          waterBodyName: "Шахта, рудник, карьер"
        },
        {
          waterBodyCode: "62",
          waterBodyName: "Скважины вертикального дренажа"
        },
        {
          waterBodyCode: "70",
          waterBodyName: "Коллекторно-дренажная сеть"
        },
        {
          waterBodyCode: "71",
          waterBodyName: "Коллекторы, не связанные с речной сетью"
        },
        {
          waterBodyCode: "72",
          waterBodyName: "Коллекторы, достигающие поверхностные водные объекты"
        },
        {
          waterBodyCode: "80",
          waterBodyName: "Земледельческие поля орошения"
        },
        {
          waterBodyCode: "81",
          waterBodyName: "Накопители"
        },
        {
          waterBodyCode: "82",
          waterBodyName: "Рельеф местности"
        },
        {
          waterBodyCode: "83",
          waterBodyName: "Поля фильтрации"
        },
        {
          waterBodyCode: "84",
          waterBodyName: "Септик"
        },
        {
          waterBodyCode: "90",
          waterBodyName: "Сеть водопровода"
        },
        {
          waterBodyCode: "91",
          waterBodyName: "Сеть водоотведения"
        }
      ],
      current: null
  }),
  validations: {
    title: { required },
    waterBodyCodeAndType: { required }
  },
  watch: {
    current(wiId) {
      const { title, waterBodyCodeAndType } = this.waterIntakes.find(wi => wi.id === wiId)
      this.title = title
      this.waterBodyCodeAndType = waterBodyCodeAndType
    },
  },
  created() {
    const { id, title, waterBodyCodeAndType } = this.waterIntakes[0]
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
        this.$message(localizeFilter('WaterIntake_HasBeenUpdated'))
        this.$emit('updated', waterIntakeData)
      } catch (e) {}
    }
  },
  mounted() {
    this.waterBodyCodeAndType = M.FormSelect.init(this.$refs.waterBodyCodeAndType)
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  destroyed() {
    if (this.waterBodyCodeAndType && this.waterBodyCodeAndType.destroy) {
      this.waterBodyCodeAndType.destroy()
    }
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
