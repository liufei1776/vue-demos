import type { RouteRecordRaw } from 'vue-router';

function hasChildren(route: RouteRecordRaw) {
  return route.children && route.children.length > 0;
}

export function flattenRoutes(routes: RouteRecordRaw[]) {
  let result: RouteRecordRaw[] = [];
  
  for (const route of routes) {
    if (hasChildren(route)) {
      result = result.concat(flattenRoutes(route.children!))
    } else {
      result.push(route);
    }
  }

  return result;
}

function hasPermission(permissions: string[], permission: string) {
  return permissions.includes(permission);
}

export function filterRoutesByPermissions(routes: RouteRecordRaw[], permissions: string[]) {
  const result: RouteRecordRaw[] = [];

  for (const route of routes) {
    const routeCopy = { ...route };

    if (hasPermission(permissions, routeCopy.name as string)) {
      result.push(routeCopy);
      continue;
    }

    if (hasChildren(routeCopy)) {
      routeCopy.children = filterRoutesByPermissions(routeCopy.children!, permissions);
      result.push(routeCopy);
    }
  }

  return result;
}