<template>
  <div>
    <Navdar/>
    <Alert/>
    <div class="container-fluid">
      <div class="row">
        <Sidebar/>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4 mt-5">
          <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Navdar from '@/components/Navbar.vue'
import Alert from '@/components/Alert.vue'

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Navdar,
    Alert,
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
