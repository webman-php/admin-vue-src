<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-row :gutter="24">
      <a-col :span="14">
        <BasicForm @register="register" ref="formElRef"/>
      </a-col>
    </a-row>
    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
  </CollapseContainer>
</template>
<script lang="ts">
  import { Button, Row, Col } from 'ant-design-vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import {BasicForm, FormActionType, useForm} from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {accountInfoApi, accountUpdateApi} from '/@/api/common/account';
  import { baseSetschemas } from './data';
  import {useUserStore} from "/@/store/modules/user";

  const formElRef = ref<Nullable<FormActionType>>(null);

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      Button,
      ARow: Row,
      ACol: Col,
      CropperAvatar,
    },
    setup() {
      const { createMessage } = useMessage();
      const userStore = useUserStore();
      const {success} = createMessage;

      const [register, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
      });

      onMounted(async () => {
        const data = await accountInfoApi();
        setFieldsValue(data);
      });

      return {
        register,
        formElRef,
        handleSubmit: async () => {
          let data = await formElRef.value?.validate();
          await accountUpdateApi(data);
          const userinfo = userStore.getUserInfo;
          userStore.setUserInfo(userinfo);
          success('操作成功');
        },
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
