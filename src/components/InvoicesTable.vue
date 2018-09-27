<template>

    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs3>
                <v-text-field
                        append-icon="search"
                        label="Filter"
                        single-line
                        hide-details
                        @input="filterSearch"
                ></v-text-field>
            </v-flex>
            <v-flex xs3>
                <v-select
                        :items="authors"
                        label="Author"
                        @change="filterAuthor"
                ></v-select>
            </v-flex>

            <v-flex xs3>
                start date
            </v-flex>

            <v-flex xs3>
                end date
            </v-flex>

            <v-flex xs12>


                <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="rows"
                        :pagination.sync="pagination"
                        select-all
                        item-key="name"
                        class="elevation-1"
                        :rows-per-page-items="[-1]"
                        hide-actions="true"

                        :search="filters"
                        :custom-filter="customFilter"
                >
                    <template slot="headers" slot-scope="props">
                        <tr>
                            <th>
                                <v-checkbox
                                        :input-value="props.all"
                                        :indeterminate="props.indeterminate"
                                        primary
                                        hide-details
                                        @click.native="toggleAll"
                                ></v-checkbox>
                            </th>
                            <th
                                    v-for="header in props.headers"
                                    :key="header.text"
                                    :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)"
                            >
                                <v-icon small>arrow_upward</v-icon>
                                {{ header.text }}
                            </th>
                        </tr>
                    </template>
                    <template slot="items" slot-scope="props">
                        <tr :active="props.selected" @click="props.selected = !props.selected">
                            <td>
                                <v-checkbox
                                        :input-value="props.selected"
                                        primary
                                        hide-details
                                ></v-checkbox>
                            </td>
                            <td>{{ props.item.name }}</td>
                            <td class="text-xs-right">{{ props.item.birth_date}}</td>
                            <td class="text-xs-right">{{ props.item.added_by }}</td>
                        </tr>
                    </template>
                </v-data-table>

            </v-flex>

            <v-flex>

                <v-card>
                    <v-card-title primary-title>
                        <h3>Filters log:</h3>
                    </v-card-title>
                    <ul>
                        <li>Filtered by word: {{filters.search}}</li>
                        <li>Author: {{filters.added_by}}</li>
                    </ul>
                </v-card>


            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
  import CustomFilters from '@/plugins/CustomFilters';

  export default {
    data: () => ({
      filters: {
        search: '',
        added_by: ''
      },
      authors: ['Marce', 'Foo'],
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          text: 'Names',
          align: 'left',
          value: 'name'
        },
        {
          text: 'Birth date',
          value: 'birth_date'
        },
        {
          text: 'Item addad by',
          value: 'added_by'
        }
      ],
      rows: [
        {
          value: false,
          name: 'Marcelo Tosco',
          birth_date: '08/12/1983',
          added_by: 'admin'
        },
        {
          value: false,
          name: 'Carlos Campos',
          birth_date: '08/12/2010',
          added_by: 'admin'
        },
        {
          value: false,
          name: 'Luis Gonzalez',
          birth_date: '08/12/1900',
          added_by: 'foo'
        },
        {
          value: false,
          name: 'Keopx',
          birth_date: '08/12/1000',
          added_by: 'foo'
        },
        {
          value: false,
          name: 'Marco Marocchi',
          birth_date: '08/12/1882',
          added_by: 'Admin'
        },

      ]
    }),

    methods: {

      customFilter(items, filters, filter, headers) {
        const cf = new CustomFilters(items, filters, filter, headers);

        // Use regular function(),
        // arrow functions does not allow context binding.
        // Register the global standard filter.
        cf.registerFilter('search', function (searchWord, items) {
          const self = this;
          let search = searchWord.toLowerCase();
          if (searchWord.trim() === '') return items;
          const props = self.headers.map(h => h.value);
          return items.filter(item => props.some(prop => self.filter(self._getObjectValueByPath(item, prop), search)));
        });


        // Use regular function(),
        // arrow functions does not allow context binding.
        // Register "added_by" filter.
        cf.registerFilter('added_by', function (added_by, items) {
          // If the filter has not been applied yet
          // just return all available items.
          if (added_by.trim() === '') return items;

          // Compare each item added_by and just return the matching ones.
          return items.filter(item => {
            return item.added_by.toLowerCase() === added_by.toLowerCase();
          }, added_by);

        });

        return cf.runFilters();
      },


      toggleAll() {
        if (this.selected.length) {
          this.selected = [];
        } else {
          this.selected = this.rows.slice();
        }
      },

      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },

      filterSearch(val) {
        this.filters = CustomFilters.updateFilters(this.filters, {search: val});
      },

      filterAuthor(val) {
        this.filters = CustomFilters.updateFilters(this.filters, {added_by: val});
      }
    }
  };
</script>
