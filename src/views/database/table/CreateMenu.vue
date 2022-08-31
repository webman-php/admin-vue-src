<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="一键生成菜单"
    @ok="handleSubmit"
  >
    <div class="mt-3">
      <BasicForm
        :schemas="schemas"
        ref="formElRef"
        :labelWidth="75"
        :showActionButtonGroup="false"
      />
    </div>

  </BasicModal>
</template>
<script lang="ts">
import {defineComponent, ref} from 'vue';
import {BasicForm, FormActionType, FormSchema} from '/@/components/Form/index';
import {BasicModal, useModalInner} from "/@/components/Modal";
import {useMessage} from '/@/hooks/web/useMessage';
import {createMenu, getMenuTree} from "/@/api/common/menu";

const formElRef = ref<Nullable<FormActionType>>(null);

export default defineComponent({
  components: {BasicForm, BasicModal},
  emits: ['reload', 'register'],
  setup(_, {emit}) {
    const tableName = ref('');
    const schemas: FormSchema[] = [
      {
        field: 'name',
        component: 'Input',
        label: '名字',
        colProps: {
          span: 24,
        },
        required: true,
      },
      {
        field: 'pid',
        component: 'ApiTreeSelect',
        label: '上级菜单',
        componentProps: {
          api: getMenuTree,
          resultField: 'list',
        },
        colProps: {
          span: 24,
        },
      },
      {
        field: 'icon',
        component: 'IconPicker',
        label: '图标',
        colProps: {
          span: 24,
        },
      },
      {
        field: 'overwrite',
        component: 'Checkbox',
        label: '强制覆盖',
        colProps: {
          span: 24,
        },
      }
    ];
    const [register, {closeModal}] = useModalInner(async (data: any) => {
      tableName.value = data.table;
      formElRef.value?.appendSchemaByField({
        field: 'table',
        component: 'Input',
        label: '',
        colProps: {
          span: 0,
        },
        componentProps: {
          hidden: true
        },
        defaultValue: tableName
      }, '');
    });
    const {
      createMessage
    } = useMessage();
    const {success} = createMessage;


    const handleSubmit = async () => {
      try {
        const formEl = formElRef.value;
        if (!formEl) return;
        const data = await formEl.validate();
        await createMenu(data);
        closeModal();
        success('操作成功');
        emit('reload');
      } catch (e) {
        console.log(e);
      }
    }

    return {
      formElRef,
      handleSubmit,
      schemas,
      register,
    };
  },
});

</script>
