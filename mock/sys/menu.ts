import { resultSuccess } from '../_util';
import { MockMethod } from 'vite-plugin-mock';


export default [
  {
    url: '/basic-api/getMenuList',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess([]);
    },
  },
] as MockMethod[];
