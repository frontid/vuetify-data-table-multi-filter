<template>
    <v-app>
        <v-content>
            <v-container grid-list-md>

                <h2>Full example</h2>
                <MultipleFiltersTable/>

                <br>
                <br>
                <br>
                <br>
                <br>

                <h2>Simplified component (for learning purposes)</h2>
                <SimplifiedMultipleFiltersTable/>


            </v-container>
        </v-content>
    </v-app>
</template>

<script>
  import MultipleFiltersTable from '@/components/MultipleFiltersTable'
  import SimplifiedMultipleFiltersTable from '@/components/SimplifiedMultipleFiltersTable'

  export default {
    name: 'App',
    components: {
      MultipleFiltersTable,
      SimplifiedMultipleFiltersTable
    },
    data() {
      return {}
    }
  }
</script>
