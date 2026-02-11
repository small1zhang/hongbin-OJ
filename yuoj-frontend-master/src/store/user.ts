// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      // 同时包含userName和userAccount字段，都默认为"未登录"
      userName: "未登录",
      userAccount: "未登录",
    },
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      try {
        // 从远程请求获取登录信息
        const res = await UserControllerService.getLoginUserUsingGet();
        if (res.code === 0 && res.data) {
          // 确保即使后端返回的数据不完整，也能保持前端状态的完整性
          const userInfo = {
            ...state.loginUser, // 保留原有的所有字段
            ...res.data, // 用新数据覆盖同名字段
          };
          commit("updateUser", userInfo);
        } else {
          commit("updateUser", {
            ...state.loginUser,
            userRole: ACCESS_ENUM.NOT_LOGIN,
            userName: "未登录",
            userAccount: "未登录",
          });
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
          userName: "未登录",
          userAccount: "未登录",
        });
      }
    },
    // 添加一个新的action，用于登录成功后立即更新用户信息
    async updateUserInfo({ commit }, userInfo) {
      commit("updateUser", userInfo);
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = { ...state.loginUser, ...payload };
    },
  },
} as StoreOptions<any>;
