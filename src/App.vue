<template>
  <v-app>
    <v-content>
      <InvoicesTable/>
    </v-content>
  </v-app>
</template>

<script>
import InvoicesTable from './components/InvoicesTable'

export default {
  name: 'App',
  components: {
    InvoicesTable
  },
  data () {
    return {
    }
  }
}
</script>
