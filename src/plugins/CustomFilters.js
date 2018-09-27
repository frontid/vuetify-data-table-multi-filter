/**
 * Enabled v-data-table to have moire than one filter.
 */
class CustomFilters {

  /**
   * Constructor.
   *
   * @param items
   * @param filters
   * @param filter
   * @param headers
   */
  constructor(items, filters, filter, headers) {
    this.items = items;
    this.filter = filter;
    this.headers = headers;
    this.filters = filters;
    this.filterCallbacks = {};
  }

  /**
   * Updates filter values.
   * @param filters filter´s object
   * @param val JSON chunk to be updated.
   * @returns {*}
   */
  static updateFilters(filters, val) {
    return Object.assign({}, filters, val);
  }

  /**
   * Adds a new filter
   * @param filterName The name of the filter from which the information will be extracted
   * @param filterCallback The callback that will apply the filter.
   */
  registerFilter(filterName, filterCallback) {
    this.filterCallbacks[filterName] = filterCallback;
  }

  /**
   * Run all filters.
   * @returns {*}
   */
  runFilters() {
    const self = this;
    let filteredItems = self.items;

    Object.entries(this.filterCallbacks)
      .forEach(([entity, cb]) => {
        filteredItems = cb.call(self, self.filters[entity], filteredItems);
      });

    return filteredItems;
  }

  /**
   * Helper function. @docme
   * @param obj
   * @param path
   * @param fallback
   * @returns {*}
   * @private
   */
  _getNestedValue(obj, path, fallback) {
    const last = path.length - 1;

    if (last < 0) return obj === undefined ? fallback : obj;

    for (let i = 0; i < last; i++) {
      if (obj == null) {
        return fallback;
      }
      obj = obj[path[i]];
    }

    if (obj == null) return fallback;

    return obj[path[last]] === undefined ? fallback : obj[path[last]];
  }

  /**
   * Helper function. @docme
   * @param obj
   * @param path
   * @param fallback
   * @returns {*}
   */
  _getObjectValueByPath(obj, path, fallback) {

    const self = this;
    if (!path || path.constructor !== String) return fallback;
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, ''); // strip a leading dot
    return self._getNestedValue(obj, path.split('.'), fallback);
  }
}

export { CustomFilters as default };
