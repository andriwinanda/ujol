
const state = {
    title: "",
    description: "",
    startDate: null,
    idQuestionBank: "",
    duration: ""
}

const mutations = {
    updateTitle(state, value) {
        state.title = value
    },

    updateDesc(state, value) {
        state.description = value
    },

    updateStart(state, value) {
        state.startDate = value
    },

    updateQuestionBank(state, value) {
        state.idQuestionBank = value
    },

    updateDuration(state, value) {
        state.duration = value
    },
    resetState(state) {
        state.title = ""
        state.description = ""
        state.startDate = null
        state.idQuestionBank = ""
        state.duration = ""
    }
}
const actions = {


}

export default {
    namespaced: true,
    strict: true,
    state,
    mutations,
    actions
}
