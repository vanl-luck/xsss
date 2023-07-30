import subjectApi from "@/api/subject";

const state = {
  subjects: [],
  levels: [],
};

const getters = {
  subjectEnumFormat: (state) => (key) => {
    for (let item of state.subjects) {
      if (item.id === key) {
        return item.name + " ( " + item.levelName + " )";
      }
    }
    return null;
  },
};

// actions
const actions = {
  initSubject({ commit }, action) {
    subjectApi.list().then((re) => {
      commit("setSubjects", re.response);
      commit("setLevels", re.response);
      if (action !== undefined) {
        action();
      }
    });
  },
};
function formatArr(arr) {
  let map = new Map();
  for (let item of arr) {
    if (!map.has(item.level)) {
      map.set(item.level, item);
    }
  }
  return [...map.values()];
}

// mutations
const mutations = {
  setSubjects: (state, subjects) => {
    state.subjects = subjects;
  },
  setLevels: (state, subject) => {
    const levels = subject.map((item) => {
      return { key: item.level, value: item.levelName };
    });
    const uniqueArray = [];
    const seenLevels = new Set();

    for (const item of levels) {
      if (!item.__ob__) {
        // 如果不是Vue的响应式对象，则根据level字段进行去重
        const level = item.key;
        if (!seenLevels.has(level)) {
          uniqueArray.push(item);
          seenLevels.add(level);
        }
      }
    }
    state.levels = uniqueArray;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
