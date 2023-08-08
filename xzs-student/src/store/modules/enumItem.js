// initial state
import filesApi from "@/api/file";

const state = {
  user: {
    sexEnum: [
      { key: 1, value: "男" },
      { key: 2, value: "女" },
    ],
    statusEnum: [
      { key: 1, value: "启用" },
      { key: 2, value: "禁用" },
    ],
    levelEnum: [],
    roleEnum: [
      { key: 1, value: "学生" },
      { key: 2, value: "教师" },
      { key: 3, value: "管理员" },
    ],
    statusTag: [
      { key: 1, value: "success" },
      { key: 2, value: "danger" },
    ],
    statusBtn: [
      { key: 1, value: "禁用" },
      { key: 2, value: "启用" },
    ],
  },
  exam: {
    examPaper: {
      paperTypeEnum: [
        { key: 1, value: "固定试卷" },
        { key: 6, value: "练习试卷" },
      ],
    },
    // , { key: 4, value: '时段试卷' }, { key: 6, value: '任务试卷' }
    question: {
      typeEnum: [
        { key: 1, value: "单选题" },
        { key: 2, value: "多选题" },
        { key: 3, value: "判断题" },
        { key: 4, value: "填空题" },
        { key: 5, value: "简答题" },
      ],
      editUrlEnum: [
        { key: 1, value: "/exam/question/edit/singleChoice", name: "单选题" },
        { key: 2, value: "/exam/question/edit/multipleChoice", name: "多选题" },
        { key: 3, value: "/exam/question/edit/trueFalse", name: "判断题" },
        { key: 4, value: "/exam/question/edit/gapFilling", name: "填空题" },
        { key: 5, value: "/exam/question/edit/shortAnswer", name: "简答题" },
      ],
    },
  },
};

// getters
const getters = {
  enumFormat: (state) => (arrary, key) => {
    return format(arrary, key);
  },
};

// actions
const actions = {
  initLevels: ({ commit }, action) => {
    filesApi.getLevelList().then((re) => {
      commit("setLevels", re.data);
      if (action !== undefined) {
        action();
      }
    });
  },
};

// mutations
const mutations = {
  setLevels: (state, subject) => {
    const levels = subject.map((item) => {
      return { key: item.level, value: item.level_name };
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
    state.user.levelEnum = uniqueArray;
  },
};

const format = function (array, key) {
  for (let item of array) {
    if (item.key === key) {
      return item.value;
    }
  }
  return null;
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
