import firebase from 'firebase/app'

export default {
  actions: {
    async fetchWaterIntakes({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid')
        const waterIntakes = (await firebase.database().ref(`/users/${uid}/waterintakes`).once('value')).val() || {}
        return Object.keys(waterIntakes).map(key => ({...waterIntakes[key], id: key}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchWaterIntakeById({commit, dispatch}, id) {
      try {
        const uid = await dispatch('getUid')
        const waterIntake = (await firebase.database().ref(`/users/${uid}/waterintakes`).child(id).once('value')).val() || {}
        return {...waterIntake, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateWaterIntake({commit, dispatch}, {title, waterBodyCodeAndType, position, guivCode, distanceFromEstuary, id}) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/waterintakes`).child(id).update({title, waterBodyCodeAndType, position, guivCode, distanceFromEstuary })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createWaterIntake({commit, dispatch}, {title, waterBodyCodeAndType, position, guivCode, distanceFromEstuary }) {
      try {
        const uid = await dispatch('getUid')
        const waterIntake = await firebase.database().ref(`/users/${uid}/waterintakes`).push({title, waterBodyCodeAndType, position, guivCode, distanceFromEstuary })
        return {title, waterBodyCodeAndType, position, guivCode, id: waterIntake.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
