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
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="手机：">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="资料授权目录" required>
        <el-select
          style="width: 100%"
          class="directoriesSelect"
          v-model="form.directoriesIds"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in directoriesList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
import Cookies from "js-cookie";

import fileApi from "@/api/file.js";

export default {
  data() {
    return {
      userName: "",
      form: {
        id: null,
        userName: "",
        password: "",
        realName: "",
        role: 3,
        status: 1,
        age: "",
        sex: "",
        birthDay: null,
        directoriesIds: [],
        phone: null,
      },
      cascaderShow: false,
      directoriesList: [],
      formLoading: false,
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    let id = this.$route.query.id;
    this.userName = Cookies.get("adminUserName");
    this.school_id = Cookies.get("school_id") ?? 1;
    this.userName == "admin" && (await this.getDirectoriesList());
    if (id && parseInt(id) !== 0) {
      this.getSelectUserInfo(id);
    } else {
      this.cascaderShow = this.userName == "admin";
    }
  },
  methods: {
    async getDirectoriesList() {
      const res = await fileApi.getDirectoriesBySchoolId({
        user_name: this.userName,
        school_id: this.school_id,
      });
      this.directoriesList = res.data.map((item) => {
        return {
          label: item.dir_name,
          value: item.id,
        };
      });
      console.log(" this.directoriesList", this.directoriesList);
    },
    getSelectUserInfo(id) {
      this.formLoading = true;
      userApi.selectUser(id).then((res) => {
        if (res.response) {
          this.form = res.response;
          const user_name = this.form.userName;
          const school_id = this.schoolId ?? 1;
          fileApi
            .getDirectoriesBySchoolId({ user_name, school_id })
            .then((res) => {
              if (res.data.length) {
                this.$set(
                  this.form,
                  "directoriesIds",
                  res.data.map((item) => item.id)
                );
                // this.form.directoriesIds = res.data.map((item) => item.id);
                this.formLoading = false;

                console.log("selecethis.formRes", this.form);
              }
            });
        }
      });
    },

    submitForm() {
      let _this = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true;
          userApi
            .createUser(this.form)
            .then((data) => {
              if (data.code === 1) {
                const school_id = 1;
                const directories_ids = this.form.directoriesIds;
                fileApi
                  .setDirectoriesBySchoolId({ school_id, directories_ids })
                  .then((res) => {
                    // console.log("res", res);
                    _this.$message.success(data.message);
                    _this.delCurrentView(_this).then(() => {
                      _this.$router.push("/user/student/list");
                    });
                  });
                _this.$message.success(data.message);
                _this.delCurrentView(_this).then(() => {
                  _this.$router.push("/user/admin/list");
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
    resetForm() {
      let lastId = this.form.id;
      this.$refs["form"].resetFields();
      this.form = {
        id: null,
        userName: "",
        password: "",
        realName: "",
        role: 3,
        status: 1,
        age: "",
        sex: "",
        birthDay: null,
        phone: null,
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
    }),
    // ...mapState("user", ["userName"]),
  },
};
</script>
