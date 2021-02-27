import firebase from 'firebase/app'

export default {
  actions: {
    async fetchWaterConsumers({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid')
        const waterConsumers = (await firebase.database().ref(`/users/${uid}/waterconsumers`).once('value')).val() || {}
        return Object.keys(waterConsumers).map(key => ({...waterConsumers[key], id: key}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchWaterConsumerById({commit, dispatch}, id) {
      try {
        const uid = await dispatch('getUid')
        const waterConsumer = (await firebase.database().ref(`/users/${uid}/waterconsumers`).child(id).once('value')).val() || {}
        return {...waterConsumer, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateWaterConsumer({commit, dispatch}, {waterConsumerName, waterConsumerType, waterConsumerDetail, id}) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/waterconsumers`).child(id).update({waterConsumerName, waterConsumerType, waterConsumerDetail})
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createWaterConsumer({commit, dispatch}, {waterConsumerName, waterConsumerType, waterConsumerDetail}) {
      try {
        const uid = await dispatch('getUid')
        const waterConsumer = await firebase.database().ref(`/users/${uid}/waterconsumers`).push({waterConsumerName, waterConsumerType, waterConsumerDetail})
        return {waterConsumerName, waterConsumerType, waterConsumerDetail, id: waterConsumer.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}