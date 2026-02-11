<template>
  <div id="userRegisterView" class="register-container">
    <div class="register-wrapper">
      <!-- 注册卡片 -->
      <div class="register-card">
        <div class="register-header">
          <div class="logo-container">
            <div class="logo">
              <span class="logo-text">OJ</span>
            </div>
          </div>
          <h2 class="register-title">创建账号</h2>
          <p class="register-subtitle">加入在线判题系统，提升编程技能</p>
        </div>

        <a-form
          class="register-form"
          label-align="left"
          auto-label-width
          :model="form"
          @submit="handleSubmit"
        >
          <a-form-item
            field="userAccount"
            label="账号"
            :rules="[
              { required: true, message: '请输入账号' },
              { min: 4, message: '账号长度不能少于4位' },
            ]"
          >
            <a-input
              v-model="form.userAccount"
              placeholder="请输入账号"
              class="register-input"
              :bordered="false"
              prefix-icon="user"
            />
          </a-form-item>

          <a-form-item
            field="userPassword"
            label="密码"
            tooltip="密码不少于 8 位"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度不能少于8位' },
            ]"
          >
            <a-input-password
              v-model="form.userPassword"
              placeholder="请输入密码"
              class="register-input"
              :bordered="false"
              prefix-icon="lock"
            />
          </a-form-item>

          <a-form-item
            field="checkPassword"
            label="确认密码"
            :rules="[
              { required: true, message: '请确认密码' },
              // 移除自动验证，改为在提交时手动验证
              // { validator: validatePasswordConfirm },
            ]"
          >
            <a-input-password
              v-model="form.checkPassword"
              placeholder="请再次输入密码"
              class="register-input"
              :bordered="false"
              prefix-icon="lock"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="register-button"
              :loading="isLoading"
            >
              注册
            </a-button>
          </a-form-item>

          <div class="register-footer">
            <span>已有账号？</span>
            <a @click="toLogin" class="login-link">立即登录</a>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();
const isLoading = ref(false);

/**
 * 密码一致性验证器 - 优化版
 */
const validatePasswordConfirm = async (_: any, value: string) => {
  // 只有当用户输入了确认密码和主密码时才进行一致性检查
  if (!value || !form.userPassword) {
    return Promise.resolve();
  }

  // 输出调试信息，查看实际比较的值
  console.log("比较密码:", value, form.userPassword);

  // 为了避免v-model更新时机问题，增加一个微小的延迟
  await new Promise((resolve) => setTimeout(resolve, 0));

  if (value !== form.userPassword) {
    return Promise.reject(new Error("两次输入的密码不一致"));
  }

  return Promise.resolve();
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  try {
    // 手动进行密码一致性检查，避免表单验证的问题
    if (form.userPassword !== form.checkPassword) {
      message.error("两次输入的密码不一致");
      return;
    }

    isLoading.value = true;
    const res = await UserControllerService.userRegisterUsingPost(form);

    // 注册成功，跳转到登录页
    if (res.code === 0) {
      message.success("注册成功，请登录");
      router.push({
        path: "/user/login",
        replace: true,
      });
    } else {
      message.error("注册失败，" + (res.message || "未知错误"));
    }
  } catch (error) {
    message.error("注册过程中发生错误");
    console.error("Register error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 全局样式 */
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.register-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

/* 注册卡片样式 */
.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* 表单样式 */
.register-form {
  margin-top: 30px;
}

.register-input {
  height: 44px;
  border-radius: 8px;
  background-color: #f5f5f5;
  font-size: 14px;
  transition: all 0.3s ease;
}

.register-input:hover {
  background-color: #eeeeee;
}

.register-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

/* 页脚样式 */
.register-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #667eea;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #5a67d8;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-wrapper {
    padding: 10px;
  }

  .register-card {
    padding: 30px 20px;
    border-radius: 12px;
  }
}
</style>
