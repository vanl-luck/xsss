<template>
  <div class="app-container">
    <el-form
      :model="form"
      ref="form"
      label-width="150px"
      v-loading="formLoading"
      :rules="rules"
    >
      <el-form-item label="用户名：" prop="userName" required>
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" required>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName" required>
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="年龄：">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-model="form.sex" placeholder="性别" clearable>
          <el-option
            v-for="item in sexEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期：">
        <el-date-picker
          v-model="form.birthDay"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="手机：">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="年级：" prop="userLevel" required>
        <el-select v-model="form.userLevel" placeholder="年级">
          <el-option
            v-for="item in levelEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资料授权目录" prop="file_path" required>
        <el-cascader
          v-if="cascaderShow"
          v-model="form.file_path"
          :props="getfilePathList()"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="状态：" required>
        <el-select v-model="form.status" placeholder="状态">
          <el-option
            v-for="item in statusEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import userApi from "@/api/user";
import fileApi from "@/api/file";
let id = 0;

export default {
  data() {
    return {
      form: {
        id: null,
        userName: "",
        password: "",
        realName: "",
        role: 1,
        status: 1,
        age: "",
        sex: "",
        file_path: [],
        birthDay: null,
        phone: null,
        userLevel: null,
      },
      cascaderShow: false,
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { value, level } = node;
          console.log("node", node);
          let Key = value || "";
          fileApi
            .getDirs({ Key })
            .then((res) => {
              const nodes = res.map((item) => {
                return {
                  value: item,
                  label: item.split("/")[item.split("/").length - 2],
                  leaf: level >= 3,
                };
              });
              console.log(res, "res");
              resolve(nodes);
            })
            .catch((error) => {
              console.log(error);
            });
        },
      },
      formLoading: false,
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        file_path: [
          { required: true, message: "请选择资料授权目录", trigger: "change" },
        ],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        userLevel: [
          { required: true, message: "请选择年级", trigger: "change" },
        ],
      },
    };
  },
  created() {
    let id = this.$route.query.id;

    let _this = this;
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true;
      userApi.selectUser(id).then((re) => {
        _this.form = re.response;
        _this.getfilePathById(id);
        _this.formLoading = false;
      });
    }
  },
  methods: {
    submitForm() {
      let _this = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true;

          userApi
            .createUser(this.form)
            .then((data) => {
              if (data.code === 1) {
                const pathList = this.form.file_path;

                const params = {
                  id: this.$route.query.id,
                  file_path: pathList,
                };
                fileApi.setPathById(params).then((res) => {
                  // console.log("res", res);
                  _this.$message.success(data.message);
                  _this.delCurrentView(_this).then(() => {
                    _this.$router.push("/user/student/list");
                  });
                });
              } else {
                _this.$message.error(data.message);
                _this.formLoading = false;
              }
            })
            .catch((e) => {
              _this.formLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    getfilePathList() {
      return {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { value, level } = node;
          console.log("node", node);
          let Key = value || "";
          fileApi
            .getDirs({ Key })
            .then((res) => {
              const nodes = res.map((item) => {
                return {
                  value: item,
                  label: item.split("/")[item.split("/").length - 2],
                  leaf: level >= 3,
                };
              });
              console.log(res, "res");
              resolve(nodes);
            })
            .catch((error) => {
              console.log(error);
            });
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 }).map((item) => ({
          //     value: ++id,
          //     label: `选项${id}`,
          //     leaf: level >= 2,
          //   }));
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes);
          // }, 1000);
        },
      };
    },
    getfilePathById(id) {
      fileApi.getPathById({ id }).then((res) => {
        this.form.file_path = res.data.file_path;
        this.cascaderShow = true;
        console.log("res11", this.form.file_path);
      });
    },

    loadParentOptions(selectedOptions) {
      if (selectedOptions.length === 0) return;
      // 假设你有一个加载父级选项的方法，它应该将加载的选项添加到 `options` 数组中
      this.loadParentOption(selectedOptions[0]).then((parentOption) => {
        this.options.push(parentOption);
        this.loadParentOptions(selectedOptions.slice(1));
      });
    },

    resetForm() {
      let lastId = this.form.id;
      this.$refs["form"].resetFields();
      this.form = {
        id: null,
        userName: "",
        password: "",
        realName: "",
        role: 1,
        status: 1,
        age: "",
        sex: "",
        birthDay: null,
        phone: null,
        userLevel: null,
      };
      this.form.id = lastId;
    },
    ...mapActions("tagsView", { delCurrentView: "delCurrentView" }),
  },
  computed: {
    ...mapGetters("enumItem", ["enumFormat"]),
    ...mapState("enumItem", {
      sexEnum: (state) => state.user.sexEnum,
      roleEnum: (state) => state.user.roleEnum,
      statusEnum: (state) => state.user.statusEnum,
      levelEnum: (state) => state.user.levelEnum,
    }),
  },
};
</script>
