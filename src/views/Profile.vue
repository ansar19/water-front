<template>
  <div>
    <div class="page-title">
      <h3>{{'ProfileTitle' | localize}}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="name"
          :class="{invalid: $v.name.$dirty && !$v.name.required}"
        >
        <label for="description">{{'Name'|localize}}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >{{'Message_EnterName'|localize}}</small>
      </div>

       <div class="input-field">
        <label for="company-name">{{'Company_Name'|localize}}</label>
        <input
          id="company-name"
          type="text"
          v-model="companyName"
          :class="{invalid: $v.companyName.$dirty && !$v.companyName.required}" class="form-control"
        >
        <small
          class="helper-text invalid"
          v-if="$v.companyName.$dirty && !$v.companyName.required"
        >{{'Message_Enter_Company_Name'|localize}}</small>
      </div>

      <!-- Тип юр лица -->

      <div class="from-group">
        <label for="company-type">{{ 'Company_Type' | localize }}</label>
        <v-select id="company-type" v-model="companyType" label="nameLongRu" :options="companyTypeOptions"></v-select>

         <small
          class="helper-text invalid"
          v-if="$v.companyType.$dirty && !$v.companyType.required"
        >{{'Message_Enter_Company_Type'|localize}}</small>
      </div>

      <!-- END Тип юр лица  -->

      <div class="input-field">
        <label for="company-bin">{{'Company_BIN'|localize}}</label>
        <input
          id="company-bin"
          type="text"
          v-model="companyBin"
          :class="{invalid: $v.companyBin.$dirty && !$v.companyBin.required}" class="form-control"
        >
        <small
          class="helper-text invalid"
          v-if="$v.companyBin.$dirty && !$v.companyBin.required"
        >{{'Message_Enter_Company_Bin'|localize}}</small>

        <small class="helper-text invalid" v-if="!$v.companyBin.minLength">
          {{'Message_Enter_Company_Bin_Min'|localize}} {{$v.companyBin.$params.minLength.min}}.
          </small>

        <small class="helper-text invalid" v-if="!$v.companyBin.maxLength">
          {{'Message_Enter_Company_Bin_Max'|localize}}  {{$v.companyBin.$params.maxLength.max}}.
          </small>
      </div>

      <div class="input-field">
        <label for="company-head">{{'Company_Head'|localize}}</label>
        <input
          id="company-head"
          type="text"
          v-model="companyHead"
          :class="{invalid: $v.companyHead.$dirty && !$v.companyHead.required}" class="form-control"
        >
        <small class="helper-text invalid" v-if="!$v.companyHead.minLength">
          {{'Message_Enter_Company_Head'|localize}} {{$v.companyHead.$params.minLength.min}}.
          </small>
      </div>

      <div class="input-field">
        <label for="company-phone">{{'Company_Phone'|localize}}</label>
        <input
          id="company-phone"
          type="tel" 
          v-model="companyPhone"
          pattern="^\+?77(\d{9,10})$"
          class="form-control"
          required
        >
      </div>

      <div class="input-field">
        <label for="company-email">{{'Company_Email'|localize}}</label>
        <input
          id="company-email"
          type="email"
          v-model="companyEmail"
          :class="{invalid: !$v.companyEmail.email}" class="form-control"
        >
        <small class="helper-text invalid" v-if="!$v.companyEmail.email">
          {{'Message_Enter_Company_Email'|localize}}.
          </small>
      </div>

      <div class="input-field">
        <label for="company-fax">{{'Company_Fax'|localize}}</label>
        <input
          id="company-fax"
          type="text" 
          v-model="companyFax"
          class="form-control"
        >
      </div>

      <div class="input-field">
        <label for="company-bank-account">{{'Company_Bank_Account'|localize}}</label>
        <input
          id="company-bank-account"
          type="text" 
          v-model="companyBankAccount"
          class="form-control"
        >
      </div>

      <div class="input-field">
        <label for="company-bank">{{'Company_Bank'|localize}}</label>
        <textarea 
          id="company-bank"
          type="textarea" 
          v-model="companyBank"
          class="materialize-textarea"
        ></textarea>
      </div>

      <div class="input-field">
        <label for="company-address">{{'Company_Address'|localize}}</label>
        <textarea 
          id="company-address"
          type="textarea" 
          v-model="companyAddress"
          class="materialize-textarea"
        ></textarea>
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Update'|localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import localeFilter from '@/filters/localize.filter'
import 'vue-select/dist/vue-select.css';

export default {
  metaInfo() {
    return {
      title: this.$title('ProfileTitle')
    }
  },
  data: () => ({
    name: '',
    isRuLocale: true,
    companyName: '',
    companyType: {
      value: undefined,
      nameRu: undefined,
      nameKz: undefined,
      nameEn: undefined,
      nameLongRu: undefined,
      nameLongKz: undefined,
      nameLongEn: undefined
    },
    companyBin: '',
    companyHead: '',
    companyPhone: '',
    companyFax: '',
    companyEmail: '',
    companyBankAccount: '',
    companyBank: '',
    companyAddress: '',
    companyTypeOptions: [
      {
        value: 'llp',
        nameRu: 'ТОО',
        nameKz: 'ЖШС',
        nameEn: 'LLP',
        nameLongRu: 'Товарищество с ограниченной ответственностью',
        nameLongKz: 'Жауапкершілігі шектеулі серіктестік',
        nameLongEn: 'Limited liability partnership'
      },
      {
        value: 'jsc',
        nameRu: 'АО',
        nameKz: 'ЖШС',
        nameEn: 'JSC',
        nameLongRu: 'Акционерное общество',
        nameLongKz: 'Жауапкершілігі шектеулі серіктестік',
        nameLongEn: 'Joint Stock Company'
      }
    ]
  }),
  validations: {
    name: { required },
    companyName: { required },
    companyType: { required },
    companyBin: { required, minLength: minLength(12), maxLength: maxLength(12) },
    companyHead: { minLength: minLength(2) },
    companyEmail: { email }
  },
  mounted() {
    this.name = this.info.name
    this.companyName = this.info.companyName
    this.companyType = this.info.companyType
    this.companyBin = this.info.companyBin
    this.companyHead = this.info.companyHead
    this.companyPhone = this.info.companyPhone
    this.companyFax = this.info.companyFax
    this.companyEmail = this.info.companyEmail
    this.companyBankAccount = this.info.companyBankAccount
    this.companyBank = this.info.companyBank
    this.companyAddress = this.info.companyAddress
    this.isRuLocale = this.info.locale === 'ru-RU'
    setTimeout(() => {
      M.updateTextFields()
    })
  },
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          companyName: this.companyName,
          companyType: this.companyType,
          companyBin: this.companyBin,
          companyHead: this.companyHead,
          companyPhone: this.companyPhone,
          companyFax: this.companyFax,
          companyEmail: this.companyEmail,
          companyBankAccount: this.companyBankAccount,
          companyBank: this.companyBank,
          companyAddress: this.companyAddress,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
      } catch (e) {}
    }
  }
}
</script>


<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
