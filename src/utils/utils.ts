import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import dayjs from 'dayjs';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function saveAuthToken(token: string): string {
  sessionStorage.setItem('auth-token', token);

  return token;
}

export function logout(): void {
  sessionStorage.removeItem('auth-token');
  localStorage.removeItem('roles');
}

export function isContainsArabic(s: string): boolean {
  const regex = /[\u0600-\u06FF]/;
  return regex.test(s);
}

export function calculateMessageParts(s: string): number {
  const maxLength = isContainsArabic(s) ? 70 : 160;
  return s.length <= maxLength ? 1 : Math.ceil(s.length / maxLength);
}

export function paginate(array: any[], page_size: number, page_number: number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export function getValidationErrors(errors: any): any[] {
  const array: any[] = [];

  errors.map((error: any) => {
    if (error.hasOwnProperty('field')) {
      const searchForObject: any = array.find((obj) => obj.name === error.field);
      const object: any = searchForObject || {};
      const objectErrors: string[] = object.errors ? object.errors : [];
      object.name = error.field;
      if (error.hasOwnProperty('message')) {
        objectErrors.push(error.message);
        object.errors = objectErrors;
      }

      if (object.errors && object.errors.length > 0) {
        array.push(object);
      }
    }

    return error;
  });

  return array;
}

export function parseArabic(str: any): any {
  return dayjs(str).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A');
}
