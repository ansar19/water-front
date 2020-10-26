<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit'|localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">{{c.title}}</option>
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
            id="name"
            type="text"
            v-model="code"
            :class="{invalid: $v.code.$dirty && !$v.code.required}"
          >
          <label for="name">{{'Water_Quality_Type_Code'|localize}}</label>
          <span
            v-if="$v.code.$dirty && !$v.code.required"
            class="helper-text invalid"
          >{{'Water_Quality_Type_Code'|localize}}</span>
        </div>


        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="limit">{{'Limit'|localize}}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
          >{{'Message_MinLength'|localize}} {{$v.limit.$params.minValue.min}}</span>
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
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    code: '',
    waterQualityTypeOptions: [
        {
          waterTypeCode: "БЛ",
          waterTypeName: "Вода балластная, льяльная"
        },
        {
          waterTypeCode: "ВП",
          waterTypeName: "Вода питьевая"
        },
        {
          waterTypeCode: "ВТ",
          waterTypeName: "Вода техническая"
        },
        {
          waterTypeCode: "ВС",
          waterTypeName: "Вода сточная"
        },
        {
          waterTypeCode: "ГП",
          waterTypeName: "Вода подземная питьевая"
        },
        {
          waterTypeCode: "ГТ",
          waterTypeName: "Вода подземная техническая"
        },
        {
          waterTypeCode: "КД",
          waterTypeName: "Вода коллекторно-дренажная"
        },
        {
          waterTypeCode: "МР",
          waterTypeName: "Вода морская"
        },
        {
          waterTypeCode: "РС",
          waterTypeName: "Вода с рисовых систем"
        },
        {
          waterTypeCode: "ШР",
          waterTypeName: "Вода шахтно-рудничная"
        },
        {
          waterTypeCode: "ТР",
          waterTypeName: "Вода транзитная"
        }
    ],
    limit: 100,
    current: null
  }),
  validations: {
    title: { required },
    code: { required },
    limit: { minValue: minValue(50) }
  },
  watch: {
    current(catId) {
      const { title, code, limit } = this.categories.find(c => c.id === catId)
      this.title = title
      this.code = code
      this.limit = limit
    }
  },
  created() {
    const { id, title, code, limit } = this.categories[0]
    this.current = id
    this.title = title
    this.code = code
    this.limit = limit
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          code: this.code,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message(localizeFilter('Category_HasBeenUpdated'))
        this.$emit('updated', categoryData)
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
