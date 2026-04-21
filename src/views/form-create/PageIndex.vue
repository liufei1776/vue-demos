<template>
  <FormCreate :option="formOptions" :rule="schemaRules" />
</template>

<script setup lang="ts">
  import FormCreate from '@form-create/element-ui';

  const formOptions = {
    form: {
      labelPosition: 'top',
    },
  };

  const schemaRules = [
    {
      type: 'input',
      title: '1. 单位名称',
      field: 'supplierName',
      value: '',
      props: {
        placeholder: '请填写',
      },
    },
  ];
</script>
