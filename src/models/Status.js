import { Model } from '@vuex-orm/core';

export default class Status extends Model {
  static entity = 'statuses';

  static fields() {
    return {
      id: this.attr(),
      status: this.string(''),
      status_name_t: this.string(''),
      substatus_name_t: this.attr(null),
      description_t: this.attr(null),
      primary_state: this.attr(null),
      substatus: this.attr(null),
      list_order: this.attr(null),
      phases: this.attr(null),
    };
  }
}
