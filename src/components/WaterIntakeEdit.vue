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
          <label>{{ 'SelectWaterIntake' | localize }}</label>
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

        <!-- Start Coordinates -->
        <ul class="collapsible">
          <li>
            <div class="collapsible-header"><i class="material-icons">add_location_alt</i> {{'Coordinates' | localize }} </div>
            <div class="collapsible-body">

              <!-- <h6>Координаты</h6> -->
              <table class="responsive-table">
                <tr>
                  <th>{{'Title' | localize }}</th>
                  <th>{{'Latitude' | localize }}</th>
                  <th>{{'Longitude' | localize }}</th>
                </tr>
                <tr v-for="item of waterIntakes" :key="item.id" :value="item.id">
                  <td>
                    {{item.title}}</td>
                  <td>
                    <input v-model.number="item.position.lat" type="number" step="any">
                  </td>
                  <td>
                    <input v-model.number="item.position.lng" type="number" step="any">
                  </td>
                </tr>
              </table>
              <hr>
              <l-map :zoom.sync="zoom" :options="mapOptions" :center="center" :bounds="bounds" :min-zoom="minZoom"
                :max-zoom="maxZoom" style="height: 500px; width: 100%">
                <l-control-layers :position="layersPosition" />
                <l-tile-layer v-for="tileProvider in tileProviders" :key="tileProvider.name" :name="tileProvider.name"
                  :visible="tileProvider.visible" :url="tileProvider.url" :attribution="tileProvider.attribution"
                  :token="token" layer-type="base" />
                <l-control-zoom :position="zoomPosition" />
                <l-control-attribution :position="attributionPosition" :prefix="attributionPrefix" />
                <l-control-scale :imperial="imperial" />

                <l-marker v-for="marker in waterIntakes" :key="marker.id" :visible="true"
                  :draggable="true" :lat-lng.sync="marker.position" :icon="marker.icon"  >
                  <l-popup :content="marker.title" />
                  <l-tooltip :content="marker.title" />
                </l-marker>

              </l-map>
              <!-- END Coordinates -->
            </div>
          </li>
        </ul>
        <button class="btn waves-effect waves-light" type="submit">
          {{'Update'|localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {
  required,
  minValue
} from 'vuelidate/lib/validators';

import localizeFilter from '@/filters/localize.filter';
import 'vue-select/dist/vue-select.css';

// If you need to reference 'L', such as in 'L.icon', then be sure to
// explicitly import 'leaflet' into your component
import L from 'leaflet';

import {
  latLngBounds,
  Icon
} from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

import {
  LMap,
  LTileLayer,
  LMarker,
  LLayerGroup,
  LTooltip,
  LPopup,
  LControlZoom,
  LControlAttribution,
  LControlScale,
  LControlLayers
} from 'vue2-leaflet';

const tileProviders = [{
    name: 'OpenStreetMap',
    visible: true,
    attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'OpenTopoMap',
    visible: false,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
];

export default {
  props: {
    waterIntakes: {
      type: Array,
      required: true
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LLayerGroup,
    LTooltip,
    LPopup,
    LControlZoom,
    LControlAttribution,
    LControlScale,
    LControlLayers
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
    current: null,
    position: null,
    // related to map
    center: [51.1605, 71.4704],
    opacity: 0.6,
    token: 'your token if using mapbox',
    mapOptions: {
      zoomControl: false,
      attributionControl: false,
      zoomSnap: true,
    },
    zoom: 6,
    minZoom: 1,
    maxZoom: 20,
    zoomPosition: 'topleft',
    attributionPosition: 'bottomright',
    layersPosition: 'topright',
    attributionPrefix: 'Vue2Leaflet',
    imperial: false,
    tileProviders: tileProviders,
    bounds: latLngBounds({
        lat: 47.1166687,
        lng: 51.8833313
      }, // Atyrau coordinates - _southWest
      {
        lat: 49.9714317,
        lng: 82.6058578
      }, // Oskemen coordinates - _northEast
    ),
  }),
  validations: {
    title: {
      required
    },
    waterBodyCodeAndType: {
      required
    }
  },
  watch: {
    current(wiId) {
      const {
        title,
        waterBodyCodeAndType,
        position
      } = this.waterIntakes.find(wi => wi.id === wiId)
      this.title = title
      this.waterBodyCodeAndType = waterBodyCodeAndType
      this.position = position
    },
  },
  created() {
    const {
      id,
      title,
      waterBodyCodeAndType,
      position
    } = this.waterIntakes[0]
    this.current = id
    this.title = title
    this.waterBodyCodeAndType = waterBodyCodeAndType
    this.position = position
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
          waterBodyCodeAndType: this.waterBodyCodeAndType,
          position: { lat: this.getNewLat, lng: this.getNewLng, draggable: true, visible: true },

        }

        await this.$store.dispatch('updateWaterIntake', waterIntakeData)
        this.$message(localizeFilter('WaterIntake_HasBeenUpdated'))
        this.$emit('updated', waterIntakeData)
      } catch (e) {}
    },
  },
  // TO-DO update for dynamic waterIntakes id
  computed: {
    getNewLat() {
      return this.waterIntakes[0].position.lat
    },
    getNewLng() {
      return this.waterIntakes[0].position.lng
    }
  },
  mounted() {
    this.waterBodyCodeAndType = M.FormSelect.init(this.$refs.waterBodyCodeAndType)
    this.select = M.FormSelect.init(this.$refs.select)
    this.selectContol = M.FormSelect.init(this.$refs.selectContol)

    // materializecss Collapsible init
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
      accordion: true,
    });

    M.updateTextFields()
  },
  destroyed() {
    if (this.waterBodyCodeAndType && this.waterBodyCodeAndType.destroy) {
      this.waterBodyCodeAndType.destroy()
    }
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
     if (this.position && this.position.destroy) {
      this.position.destroy()
    }
  }
}
</script>
