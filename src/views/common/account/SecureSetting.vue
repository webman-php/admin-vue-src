<template>
  <div class="mt-3">
    <BasicForm
      :schemas="schemas"
      ref="formElRef"
      :labelWidth="75"
      :showActionButtonGroup="false"
    />
    <Button type="primary" @click="handleSubmit"> 更新密码 </Button>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref} from 'vue';
import {BasicForm, FormActionType, FormSchema} from '/@/components/Form/index';
import {Card, Input} from 'ant-design-vue';
import {Button} from '/@/components/Button';
import {useMessage} from '/@/hooks/web/useMessage';
import {accountUpdatePasswordApi} from "/@/api/common/account";

const formElRef = ref<Nullable<FormActionType>>(null);

export default defineComponent({
  components: {BasicForm, [Input.name]: Input, Button, Card},
  emits: ['reload', 'register'],
  setup() {
    const schemas: FormSchema[] = [
      {
        field: 'old_password',
        component: 'Input',
        label: '原始密码',
        colProps: {
          span: 20,
        },
        required: true,
      },
      {
        field: 'password',
        component: 'Input',
        label: '新密码',
        colProps: {
          span: 20,
        },
        required: true,
      },
      {
        field: 'password_confirm',
        component: 'Input',
        label: '确认密码',
        colProps: {
          span: 20,
        },
        required: true,
      },
    ];
    const {
      createMessage
    } = useMessage();
    const {success, error} = createMessage;


    const handleSubmit = async () => {
      try {
        const formEl = formElRef.value;
        if (!formEl) return;
        const data = await formEl.validate();
        if (data.password != data.password_confirm) {
          error('两次密码输入不一致');
          return;
        }
        await accountUpdatePasswordApi(data);
        success('操作成功');
      } catch (e) {
        console.log(e);
      }
    }

    return {
      formElRef,
      handleSubmit,
      schemas,
    };
  },
});

</script>
