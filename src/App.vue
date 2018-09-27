<template>
  <v-app>
    <v-content>
      <MultipleFiltersTable/>
    </v-content>
  </v-app>
</template>

<script>
import MultipleFiltersTable from '@/components/MultipleFiltersTable'

export default {
  name: 'App',
  components: {
    MultipleFiltersTable
  },
  data () {
    return {
    }
  }
}
</script>
