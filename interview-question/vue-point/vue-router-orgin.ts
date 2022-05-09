 /**
  * POINT 1: 
  * history.replaceState(), history.pushState(), history.popstate(), 
  * beforeunload
  * 
  */
 
 
 
 /**
 * question 1： export type { RouteRecord, RouteRecordNormalized } ？？？
 */


/**
 * question 2: Object.definePropert
 * 
 */
Object.defineProperty(routerHistory, 'locations', {
  enumerable: true,
  get: () => historyNavigation.location.value
})


/**
 * quetion 100: ts 的基本用法学习
 * 
 */
// 1) 函数
export function createWebHistory(base?: string): RouterHistory {}
// 2) 变量
const currentLocation: ValueContainer<HistoryLocation> = {}