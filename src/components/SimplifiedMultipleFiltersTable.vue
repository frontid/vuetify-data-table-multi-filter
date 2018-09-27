<template>
    <v-layout row wrap>

        <v-flex xs6>
            <v-text-field
                    append-icon="search"
                    label="Filter"
                    single-line
                    hide-details
                    @input="filterSearch"
            ></v-text-field>
        </v-flex>

        <v-flex xs6>
            <v-select
                    :items="authors"
                    label="Author"
                    @change="filterAuthor"
            ></v-select>
        </v-flex>


        <v-flex xs12>


            <v-data-table
                    :headers="headers"
                    :items="rows"
                    item-key="name"

                    :search="filters"
                    :custom-filter="customFilter"
            >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th v-for="header in props.headers" :key="header.text">
                            {{ header.text }}
                        </th>
                    </tr>
                </template>

                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.added_by }}</td>
                    </tr>
                </template>

            </v-data-table>

        </v-flex>


    </v-layout>
</template>

<script>
  import CustomFilters from '@/plugins/CustomFilters';

  export default {
    data: () => ({
      filters: {
        search: '',
        added_by: '',
      },

      authors: ['Admin', 'Editor'],
      headers: [
        {
          text: 'Names',
          align: 'left',
          value: 'name',
          sortable: false
        },
        {
          text: 'Item addad by',
          value: 'added_by',
          align: 'left',
          sortable: false
        }
      ],
      rows: [
        {
          name: 'Marcelo Tosco',
          added_by: 'admin'
        },
        {
          name: 'Carlos Campos',
          added_by: 'admin'
        },
        {
          name: 'Luis Gonzalez',
          added_by: 'Editor'
        },
        {
          name: 'Keopx',
          added_by: 'Editor'
        },
        {
          name: 'Marco Marocchi',
          added_by: 'Admin'
        },

      ]
    }),

    methods: {

      customFilter(items, filters, filter, headers) {
        // Init the filter class.
        const cf = new CustomFilters(items, filters, filter, headers);

        cf.registerFilter('search', function (searchWord, items) {
          if (searchWord.trim() === '') return items;

          return items.filter(item => {
            return item.name.toLowerCase().includes(searchWord.toLowerCase());
          }, searchWord);

        });


        cf.registerFilter('added_by', function (added_by, items) {
          if (added_by.trim() === '') return items;

          return items.filter(item => {
            return item.added_by.toLowerCase() === added_by.toLowerCase();
          }, added_by);

        });

        // Its time to run all created filters.
        // Will be executed in the order thay were defined.
        return cf.runFilters();
      },


      /**
       * Handler when user input something at the "Filter" text field.
       */
      filterSearch(val) {
        this.filters = CustomFilters.updateFilters(this.filters, {search: val});
      },

      /**
       * Handler when user  select some author at the "Author" select.
       */
      filterAuthor(val) {
        this.filters = CustomFilters.updateFilters(this.filters, {added_by: val});
      },

    }

  };
</script>
