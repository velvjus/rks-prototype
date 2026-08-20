import { createRouter, createWebHistory } from 'vue-router'
import DesignSystemView from '../views/DesignSystemView.vue'
import OmnichannelView from '../views/OmnichannelView.vue'
import CompaniesView from '../views/CompaniesView.vue'
import ContactsView from '../views/ContactsView.vue'
import AddonsView from '../views/AddonsView.vue'
import GuidelinesView from '../views/GuidelinesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/design-system',
      name: 'design-system',
      component: DesignSystemView,
      meta: { fullWidth: true }
    },
    {
      path: '/omnichannel',
      name: 'omnichannel',
      component: OmnichannelView,
      meta: { fullWidth: true }
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompaniesView
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView
    },
    {
      path: '/contacts/scan-namecard',
      name: 'scan-namecard',
      component: () => import('../views/ScanNameCardView.vue')
    },
    {
      path: '/addons',
      name: 'addons',
      component: AddonsView
    },
    {
      path: '/deals',
      name: 'deals',
      component: () => import('../views/DealsView.vue'),
      meta: { fullWidth: true }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue'),
      meta: { fullWidth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { fullWidth: true }
    },
    {
      path: '/guidelines',
      name: 'guidelines',
      component: GuidelinesView,
      meta: { fullWidth: true }
    },
    {
      path: '/appointments/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue')
    },
    {
      path: '/appointments/booking-pages',
      name: 'booking-pages',
      component: () => import('../views/BookingPagesView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { fullWidth: true }
    },
    {
      path: '/web-forms',
      name: 'web-forms',
      component: () => import('../views/webforms/WebFormsDashboardView.vue')
    },
    {
      path: '/web-forms/builder/:id?',
      name: 'web-forms-builder',
      component: () => import('../views/webforms/FormBuilderView.vue'),
      meta: { fullWidth: true }
    },
    {
      path: '/web-forms/templates',
      name: 'web-forms-templates',
      component: () => import('../views/webforms/ManageTemplatesView.vue')
    },
    {
      path: '/web-forms/submissions',
      name: 'web-forms-submissions',
      component: () => import('../views/webforms/SubmissionsView.vue')
    },
    {
      path: '/web-forms/detail/:id',
      name: 'web-forms-detail',
      component: () => import('../views/webforms/FormDetailView.vue')
    },
    {
      path: '/',
      redirect: '/dashboard'
    }
  ]
})

export default router
