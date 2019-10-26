import { Model } from '@vuex-orm/core'

export default class User extends Model {
    static entity = 'users';

    static fields () {
        return {
            id: this.increment(),
            first_name: this.string(''),
            last_name: this.string(''),
            email: this.string(''),
            roles: this.attr(null),
            organization: this.attr(null),
        }
    }

    static apiConfig = {
        actions: {
            login(email='tobi@tobiabiodun.com', password='admin123') {
                return this.post(`/api-token-auth`, {
                    email,
                    password
                }, { save: false});
            }
        }
    }
}