<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="登录workerman"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div class="px-4 py-2">
      <div role="alert" class="mb-4 ant-alert ant-alert-info ant-alert-no-icon" data-show="true">
        <div class="ant-alert-content">
          <div class="ant-alert-message"
            ><b
              >注意：此处登录
              <a href="https://www.workerman.net" target="_blank">workerman.net官网</a> 账号</b
            ></div
          >
        </div>
      </div>
    </div>
    <div class="p-4">
      <Form
        class="p-4 enter-x"
        :model="formData"
        :rules="getFormRules"
        ref="formRef"
        @keypress.enter="handleLogin"
      >
        <FormItem name="username" class="enter-x">
          <Input
            size="large"
            v-model:value="formData.username"
            :placeholder="t('sys.login.userName')"
            class="fix-auto-fill"
          />
        </FormItem>

        <FormItem name="password" class="enter-x">
          <InputPassword
            size="large"
            visibilityToggle
            v-model:value="formData.password"
            :placeholder="t('sys.login.password')"
          />
        </FormItem>

        <FormItem name="captcha" class="enter-x">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col>
              <Input
                size="large"
                v-model:value="formData.captcha"
                :placeholder="t('sys.login.captcha')"
                class="fix-auto-fill captcha-input"
                :maxlength="5"
              />
            </a-col>
            <a-col>
              <img :src="captchaUrl" @click="switchCatpcha" />
            </a-col>
          </a-row>
        </FormItem>

        <FormItem class="enter-x">
          <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
            {{ t('sys.login.loginButton') }}
          </Button>
        </FormItem>
      </Form>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();

  import { defineComponent, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { apiPost } from '/@/api/common';
  import { useFormRules, useFormValid } from '/@/views/sys/login/useLogin';
  import { Col, Form, Input, Row, Button } from 'ant-design-vue';

  const formData = reactive({
    username: '',
    password: '',
    captcha: '',
  });

  const formRef = ref();
  const captchaUrl = ref('');
  const loading = ref(false);
  const { validForm } = useFormValid(formRef);
  const { getFormRules } = useFormRules();

  function switchCatpcha() {
    captchaUrl.value = '/app/admin/plugin/app/captcha?r=' + new Date().getTime();
  }

  switchCatpcha();

  export default defineComponent({
    components: { BasicModal, FormItem, ACol, ARow, Input, Form, Button, InputPassword },
    emits: ['reload', 'register'],
    setup() {
      const [register, { closeModal }] = useModalInner();
      const { createMessage } = useMessage();
      const { success } = createMessage;

      async function handleLogin() {
        const data = await validForm();
        if (!data) return;
        const timer = setTimeout(() => {
          switchCatpcha();
          loading.value = false;
        }, 2000);
        loading.value = true;
        await apiPost('/app/admin/plugin/app/login', data);
        loading.value = false;
        clearTimeout(timer);
        closeModal();
        success('登录成功');
      }

      return {
        formRef,
        formData,
        loading,
        handleLogin,
        register,
        getFormRules,
        captchaUrl,
        t,
      };
    },
  });
</script>
