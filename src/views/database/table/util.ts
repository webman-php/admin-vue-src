import { uploadApi } from '/@/api/common/upload';
import { treeApi } from '/@/api/common/tree';

export function convert(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (String(Number(value)) === value) {
    return Number(value);
  }
  return value;
}

export function typeToComponent(schema, defaultValue, scene) {
  defaultValue = convert(defaultValue);
  let control = schema.control;
  const props = {
    disabled: scene == 'edit' ? schema.readonly : false,
  };
  let control_args = schema.control_args;
  if (control == 'Switch') {
    if (scene == 'search') {
      control = 'Select';
      control_args = 'options:1:是,0:否';
    } else {
      defaultValue = !!defaultValue;
    }
  }
  if (control == 'DatePicker') {
    props['showTime'] = true;
  }

  if (control == 'ApiTreeSelect' || control == 'ApiTree') {
    props['resultField'] = 'list';
    if (defaultValue) {
      if (props['multiple']) {
        if (typeof defaultValue != 'number') defaultValue = defaultValue.split(',');
      }
      //props['selectedKeys'] = defaultValue; // 设置selectedKeys后无法选中
    }
  }
  // 设置控件相关属性
  if (control_args) {
    for (const item of control_args.split(';')) {
      let pos = item.indexOf(':');
      if (pos == -1) continue;
      const name = item.substring(0, pos).trim();
      let values = item.substring(pos + 1).trim();
      if (control == 'Upload' && name === 'url') {
        props['api'] = uploadApi(values);
        continue;
      }
      if ((control == 'ApiTreeSelect' || control == 'ApiTree') && name === 'url') {
        props['api'] = treeApi(values);
        continue;
      }
      // value = a:v,c:d
      pos = values.indexOf(':');
      if (pos !== -1) {
        const options = values.split(',');
        values = [];
        for (const option of options) {
          const [value, label] = option.split(':');
          values.push({ value, label });
        }
      }
      props[name] = convert(values);
    }
  }

  if (control == 'Upload') {
    if (scene == 'search') {
      control = 'Input';
    } else {
      if (defaultValue) {
        defaultValue = defaultValue.split(',');
        props['value'] = defaultValue;
      } else {
        props['value'] = [];
      }
      if (!props['api']) {
        props['api'] = uploadApi();
      }
    }
  }

  return [control, props, defaultValue];
}
