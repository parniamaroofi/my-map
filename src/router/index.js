import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/drawArea",
      component: () => import("@/views/DrawArea.vue"),
    },
  ],
});
