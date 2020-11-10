<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Edit' | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label>{{ 'SelectCategory' | localize }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="name">{{ 'Title' | localize }}</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
            >{{ 'Message_CategoryTitle' | localize }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="code"
            :class="{ invalid: $v.code.$dirty && !$v.code.required }"
          />
          <label for="name">{{ 'Water_Quality_Type_Code' | localize }}</label>
          <span
            v-if="$v.code.$dirty && !$v.code.required"
            class="helper-text invalid"
            >{{ 'Water_Quality_Type_Code' | localize }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          />
          <label for="limit">{{ 'Limit' | localize }}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
            >{{ 'Message_MinLength' | localize }}
            {{ $v.limit.$params.minValue.min }}</span
          >
        </div>

        <!-- yearly limits -->

        <div class="input-field">
          <label for="water-permit-name">{{
            'Document_Details' | localize
          }}</label>
          <input
            id="water-permit-name"
            v-model="waterPermitName"
            type="text"
            class="form-control"
          />
          <small id="water-permit-name" class="form-text text-muted">{{
            'Document_Details_Comments' | localize
          }}</small>
          <span></span>
        </div>

        <div class="from-group">
          <label for="limit-type">{{ 'Limit_Type' | localize }}</label>
          <v-select
            id="limit-type"
            v-model="limitType"
            label="text"
            :options="limitTypeOptions"
          ></v-select>
        </div>

        <div class="input-field">
          <label for="main-water-intake-limit"
            >{{ 'Water_Established_Volume' | localize }}
          </label>
          <input
            id="main-water-intake-limit"
            v-model.number="totalMainWaterIntakeLimit"
            type="number"
            class="form-control"
            disabled
          />
          <small id="main-water-intake-limit" class="form-text text-muted">{{
            'Water_Established_Volume_Comment' | localize
          }}</small>
        </div>

        <div class="">
          <h5>{{ 'Limits_Yearly_Break' | localize }}</h5>
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'Limit_Year' | localize }}</th>
                <th>{{ 'Yearly_Water_Limit_Volume' | localize }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="item"
                v-for="(yearlyLimit, index) in yearlyWaterLimits"
                :key="index"
              >
                <td>
                  <datepicker
                    v-model="yearlyLimit.limitYear"
                    :value="defaultDate"
                    :format="DatePickerFormat"
                    :language="language"
                    minimum-view="year"
                    name="datepicker"
                    id="input-id"
                    :clear-button="true"
                    :bootstrap-styling="true"
                  ></datepicker>
                  <!--       to-do: record year of limit               -->
                </td>
                <td>
                  <input
                    id="main-water-intake-limit"
                    v-model.number="yearlyLimit.waterLimitForYear"
                    type="number"
                    class="form-control"
                  />
                </td>
                <td class="text-right">
                  <button
                    class="btn btn-outline-danger red darken-1"
                    @click.prevent="deleteYearlyLimit(index)"
                  >
                    <i class="material-icons">delete</i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <button
                    class="btn btn-primary"
                    @click.prevent="addYearlyLimit"
                  >
                    {{ 'Add' | localize }}
                  </button>
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- end yearly limits -->

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import localizeFilter from '@/filters/localize.filter'
import Datepicker from 'vuejs-datepicker'
import 'vue-select/dist/vue-select.css'

export default {
  components: {
    Datepicker,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    select: null,
    title: '',
    code: '',
    waterQualityTypeOptions: [
      {
        waterTypeCode: 'БЛ',
        waterTypeName: 'Вода балластная, льяльная',
      },
      {
        waterTypeCode: 'ВП',
        waterTypeName: 'Вода питьевая',
      },
      {
        waterTypeCode: 'ВТ',
        waterTypeName: 'Вода техническая',
      },
      {
        waterTypeCode: 'ВС',
        waterTypeName: 'Вода сточная',
      },
      {
        waterTypeCode: 'ГП',
        waterTypeName: 'Вода подземная питьевая',
      },
      {
        waterTypeCode: 'ГТ',
        waterTypeName: 'Вода подземная техническая',
      },
      {
        waterTypeCode: 'КД',
        waterTypeName: 'Вода коллекторно-дренажная',
      },
      {
        waterTypeCode: 'МР',
        waterTypeName: 'Вода морская',
      },
      {
        waterTypeCode: 'РС',
        waterTypeName: 'Вода с рисовых систем',
      },
      {
        waterTypeCode: 'ШР',
        waterTypeName: 'Вода шахтно-рудничная',
      },
      {
        waterTypeCode: 'ТР',
        waterTypeName: 'Вода транзитная',
      },
    ],
    waterPermitName: '',
    limitType: null,
    limitTypeOptions: [
      { text: 'Забор воды', value: 'intake' },
      { text: 'Сброс воды', value: 'discharge' },
    ],
    yearlyWaterLimits: [
      {
        limitYear: '2020-10-14',
        waterLimitForYear: '',
      },
      {
        limitYear: '2021-10-14',
        waterLimitForYear: '',
      },
    ],
    totalWaterPermitLimit: '',
    limit: 100,
    current: null,
    // related to vuejs-datepicker
    defaultDate: new Date(),
    DatePickerFormat: 'yyyy',
    language: {
      language: 'Russian',
      months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      monthsAbbr: [
        'янв',
        'февр',
        'мар',
        'апр',
        'май',
        'июн',
        'июл',
        'авг',
        'сент',
        'окт',
        'ноя',
        'дек',
      ],
      days: [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
      ],
      rtl: false,
      ymd: false,
      yearSuffix: ' г.',
    },
  }),
  validations: {
    title: { required },
    code: { required },
    limit: { minValue: minValue(50) },
  },
  watch: {
    current(catId) {
      const {
        title,
        code,
        limit,
        waterPermitName,
        limitType,
        yearlyWaterLimits,
        totalWaterPermitLimit,
      } = this.categories.find((c) => c.id === catId)
      this.title = title
      this.code = code
      this.limit = limit
      this.waterPermitName = waterPermitName
      this.limitType = limitType
      this.yearlyWaterLimits = yearlyWaterLimits
      this.totalWaterPermitLimit = totalWaterPermitLimit
    },
  },
  created() {
    const {
      id,
      title,
      code,
      limit,
      waterPermitName,
      limitType,
      yearlyWaterLimits,
      totalWaterPermitLimit,
    } = this.categories[0]
    this.current = id
    this.title = title
    this.code = code
    this.limit = limit
    this.waterPermitName = waterPermitName
    this.limitType = limitType
    this.yearlyWaterLimits = yearlyWaterLimits
    this.totalWaterPermitLimit = totalWaterPermitLimit
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
          limit: this.limit,
          waterPermitName: this.waterPermitName,
          limitType: this.limitType,
          yearlyWaterLimits: this.yearlyWaterLimits,
          totalWaterPermitLimit: this.totalMainWaterIntakeLimit,
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message(localizeFilter('Category_HasBeenUpdated'))
        this.$emit('updated', categoryData)
      } catch (e) {}
    },
    addYearlyLimit() {
      this.yearlyWaterLimits.push({
        limitYear: '',
        waterLimitForYear: '',
      })
    },
    deleteYearlyLimit(index) {
      this.yearlyWaterLimits.splice(index, 1)
    },
  },
  computed: {
    totalMainWaterIntakeLimit() {
      let waterLimitForYear = 0
      this.yearlyWaterLimits.map(function (yearlyWaterLimit) {
        waterLimitForYear += +yearlyWaterLimit.waterLimitForYear
      })
      return waterLimitForYear
    },
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
}
</script>
