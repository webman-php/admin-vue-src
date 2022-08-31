import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetMenuList = '/app/admin/common/menu/get',
  GetMenuTree = '/app/admin/common/menu/tree',
  CreateMenu = '/app/admin/auth/adminrule/create',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get({ url: Api.GetMenuList });
};


export const getMenuTree = () => {
  return defHttp.get({ url: Api.GetMenuTree });
};

export const createMenu = (params) => {
  return defHttp.post({ url: Api.CreateMenu, params });
};
