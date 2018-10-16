<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import otherDashboard from './other'
export default {
  name: 'dashboard',
  components: {
    adminDashboard,
    otherDashboard
  },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.indexOf('1') === -1) {
      this.currentRole = 'otherDashboard'
    }
  }
}
</script>
