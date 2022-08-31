import { defHttp } from '/@/utils/http/axios';
import {GetUserInfoModel, LoginParams, LoginResultModel} from "/@/api/common/model/accountModel";
import {ErrorMessageMode} from "/#/axios";

enum Api {
  ACCOUNT_INFO = '/app/admin/common/account/info',
  ACCOUNT_UPDATE = '/app/admin/common/account/update',
  ACCOUNT_UPDATE_PASSWORD = '/app/admin/common/account/password',
  LOGIN = '/app/admin/common/account/login',
  LOGOUT = '/app/admin/common/account/logout',
  GET_USER_INFO = '/app/admin/common/account/info',
  GET_PERM_CODE = '/app/admin/common/account/getPermCode',
}

export const accountInfoApi = () => defHttp.get({ url: Api.ACCOUNT_INFO });

export const accountUpdateApi = async (params) =>
  defHttp.post({
    url: Api.ACCOUNT_UPDATE,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const accountUpdatePasswordApi = async (params) =>
  defHttp.post({
    url: Api.ACCOUNT_UPDATE_PASSWORD,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.LOGIN,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GET_USER_INFO }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GET_PERM_CODE });
}

export function doLogout() {
  return defHttp.get({ url: Api.LOGOUT });
}

