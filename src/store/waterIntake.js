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
    async updateWaterIntake({commit, dispatch}, {title, waterBodyCodeAndType, id}) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/waterintakes`).child(id).update({title, waterBodyCodeAndType})
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createWaterIntake({commit, dispatch}, {title, waterBodyCodeAndType}) {
      try {
        const uid = await dispatch('getUid')
        const waterIntake = await firebase.database().ref(`/users/${uid}/waterintakes`).push({title, waterBodyCodeAndType})
        return {title, waterBodyCodeAndType, id: waterIntake.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}