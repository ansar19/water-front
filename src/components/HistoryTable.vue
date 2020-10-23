<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{'Amount'|localize}}</th>
        <th>{{'Date'|localize}}</th>
        <th>{{'Category'|localize}}</th>
        <th>{{'WaterIntake'|localize}}</th>
        <th> {{'Water_Body_Code_And_Type'|localize}}
        <th> {{'WaterConsumer'|localize}}
        <th> {{'WaterConsumerType'|localize}}

        <th>{{'Type'|localize}}</th>
        <th>{{'Open'|localize}}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, idx) of records" :key="record.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ record.amount  }}</td>
        <td>{{ record.date | date('datetime') }}</td>
        <td>{{ record.categoryName }}</td>
        <td>{{ record.waterBody.title }}</td>
        <td>{{ record.waterBody.waterBodyCodeAndType.waterBodyCode }} - {{ record.waterBody.waterBodyCodeAndType.waterBodyName }}</td>
        <td>{{ record.waterConsumer.waterConsumerName }}</td>
         <td>{{ record.waterConsumer.waterConsumerType }}</td>
        <td>
          <span :class="[record.typeClass]" class="white-text badge">{{ record.typeText }}</span>
        </td>
        <td>
          <button
            v-tooltip="'OpenRecord'"
            class="btn-small btn"
            @click="$router.push('/detail/' + record.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    records: {
      required: true,
      type: Array
    }
  }
}
</script>
