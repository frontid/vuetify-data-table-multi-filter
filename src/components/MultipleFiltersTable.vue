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

                <v-menu
                        ref="show_start_date"
                        :close-on-content-click="false"
                        v-model="show_start_date"
                        :nudge-right="40"
                        :return-value.sync="start_date"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                >
                    <v-text-field
                            slot="activator"
                            v-model="start_date"
                            label="From"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker
                            v-model="start_date"
                            @input="filterStartDate"
                    ></v-date-picker>

                </v-menu>

            </v-flex>

            <v-flex xs3>
                <v-menu
                        ref="show_end_date"
                        :close-on-content-click="false"
                        v-model="show_end_date"
                        :nudge-right="40"
                        :return-value.sync="end_date"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                >
                    <v-text-field
                            slot="activator"
                            v-model="end_date"
                            label="To"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker
                            v-model="end_date"
                            @input="filterEndDate"
                    ></v-date-picker>

                </v-menu>
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
                        :hide-actions=true
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
                            <td class="text-xs-right">{{ props.item.birth_date | formatDate}}</td>
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
                        {{filters}}
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
      show_start_date: false,
      start_date: null,

      show_end_date: false,
      end_date: null,

      filters: {
        search: '',
        added_by: '',
        start_date: null,
        end_date: null,
      },
      authors: ['Admin', 'Foo'],
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
          birth_date: 1538006400000,
          added_by: 'admin'
        },
        {
          value: false,
          name: 'Carlos Campos',
          birth_date: 1537401600000,
          added_by: 'admin'
        },
        {
          value: false,
          name: 'Luis Gonzalez',
          birth_date: 1536537600000,
          added_by: 'foo'
        },
        {
          value: false,
          name: 'Keopx',
          birth_date: 1536364800000,
          added_by: 'foo'
        },
        {
          value: false,
          name: 'Marco Marocchi',
          birth_date: 1535846400000,
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

          /**
           * Helper to remove "searchable" columns.
           * @param array
           * @param element
           */
          function remove(array, element) {
            const index = array.indexOf(element);
            array.splice(index, 1);
          }

          // Since those items has their own filters we
          // can avoid them on the global search.
          remove(props, 'birth_date');
          remove(props, 'added_by');

          console.log(props);
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

        // Use regular function(),
        // arrow functions does not allow context binding.
        // Register "start_date" filter.
        cf.registerFilter('start_date', function (start_date, items) {
          // If the filter has not been applied yet
          // just return all available items.
          if (start_date === null) return items;

          // Compare each item start_date and just return the matching ones.
          return items.filter(item => {
            return item.birth_date >= start_date;
          }, start_date);

        });

        // Use regular function(),
        // arrow functions does not allow context binding.
        // Register "end_date" filter.
        cf.registerFilter('end_date', function (end_date, items) {
          // If the filter has not been applied yet
          // just return all available items.
          if (end_date === null) return items;

          // Compare each item end_date and just return the matching ones.
          return items.filter(item => {
            return item.birth_date <= end_date;
          }, end_date);

        });

        // Its time to rull all created filters.
        // Will be executed in the order thay were defined.
        return cf.runFilters();
      },


      /**
       * Toggle selected items with the master checkbox.
       */
      toggleAll() {
        if (this.selected.length) {
          this.selected = [];
        } else {
          this.selected = this.rows.slice();
        }
      },

      /**
       * Column shorting.
       *
       * @param column
       */
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
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

      /**
       * Handler when select a date on "From" date picker.
       */
      filterStartDate(val) {
        // Close the date picker.
        this.$refs.show_start_date.save(val);

        //Convert the value to a timestamp before saving it.
        const timestamp = new Date(val + 'T00:00:00Z').getTime();
        this.filters = CustomFilters.updateFilters(this.filters, {start_date: timestamp});
      },

      /**
       * Handler when select a date on "To" date picker.
       */
      filterEndDate(val) {
        // Close the date picker.
        this.$refs.show_end_date.save(val);

        //Convert the value to a timestamp before saving it.
        const timestamp = new Date(val + 'T00:00:00Z').getTime();
        this.filters = CustomFilters.updateFilters(this.filters, {end_date: timestamp});
      },


    },

    filters: {
      /**
       * Format a timestamp into a d/m/yyy (because spanish format).
       *
       * @param value
       * @returns {string}
       */
      formatDate: function (value) {
        if (!value) return '';
        return new Date(value).toLocaleDateString("es-ES");
      }
    }


  };
</script>
