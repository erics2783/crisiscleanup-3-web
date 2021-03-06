<template>
  <form
    v-if="ready"
    ref="form"
    class="bg-gray-100 flex flex-col flex-grow w-full h-full border max-w-md self-center"
    @submit.prevent
  >
    <div class="intake-form flex-grow">
      <div class="form-field text-lg font-semibold">
        {{ $t('~~Personal Information') }}
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.name') }}</label>
        <input
          :value="pda.name"
          class="js-pda-name input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'name');
            }
          "
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.phone1') }}</label>
        <input
          :value="pda.phone1"
          class="js-pda-phone1 input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'phone1');
            }
          "
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.email') }}</label>
        <input
          :value="pda.email"
          class="js-pda-email input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'email');
            }
          "
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.address') }}</label>
        <WorksiteSearchInput
          :value="pda.address"
          selector="js-worksite-address"
          :suggestions="[
            {
              name: 'geocoder',
              data: geocoderResults || [],
              key: 'description',
            },
          ]"
          @clearSuggestions="
            () => {
              geocoderResults = [];
            }
          "
          display-property="description"
          :required="true"
          @input="
            value => {
              updatePda(value, 'address');
            }
          "
          @selectedGeocode="onGeocodeSelect"
          @search="geocoderSearch"
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.city') }}</label>
        <input
          :value="pda.city"
          class="js-pda-city input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'city');
            }
          "
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.county') }}</label>
        <input
          :value="pda.county"
          class="js-pda-county input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'county');
            }
          "
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.state') }}</label>
        <input
          :value="pda.state"
          class="js-pda-state input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'state');
            }
          "
        />
      </div>
      <div class="form-field">
        <label>{{ $t('formLabels.postal_code') }}</label>
        <input
          :value="pda.postal_code"
          class="js-pda-postal_code input"
          size="large"
          type="text"
          :required="true"
          @input="
            e => {
              updatePda(e.target.value, 'postal_code');
            }
          "
        />
      </div>
      <template v-for="field in fields">
        <div :key="field.field_key">
          <template v-if="['h4'].includes(field.html_type)">
            <div class="form-field text-lg font-semibold">
              {{ field.label_t }}
            </div>
          </template>
          <template v-if="['h5'].includes(field.html_type)">
            <div class="text-base font-semibold my-1 mx-3">
              {{ field.label_t }}
            </div>
          </template>
          <template v-if="field.html_type === 'select'">
            <div :key="field.field_key" class="form-field">
              <span>{{ field.label_t }}</span>
              <form-select
                :value="pda.formFields[field.field_key]"
                :options="
                  field.values || getSelectValuesList(field.values_default_t)
                "
                indicator-icon="caret-down"
                item-key="value"
                label="name_t"
                select-classes="h-10 border bg-white"
                @input="
                  value => {
                    dynamicFields[field.field_key] = value;
                  }
                "
              />
            </div>
          </template>
          <template v-if="field.html_type === 'cronselect'">
            <div key="field.field_key" class="form-field">
              <span>{{ field.label_t }}</span>
              <RecurringSchedule
                class="bg-white p-4"
                :value="pda.formFields[field.field_key]"
                @input="dynamicFields[field.field_key] = $event"
              />
            </div>
          </template>
          <template v-if="field.html_type === 'multiselect'">
            <div :key="field.field_key" class="form-field">
              <span>{{ field.label_t }}</span>
              <form-select
                :value="pda.formFields[field.field_key]"
                :options="
                  field.values || getSelectValuesList(field.values_default_t)
                "
                multiple
                indicator-icon="caret-down"
                item-key="value"
                label="name_t"
                select-classes="h-10 border"
                @input="
                  value => {
                    dynamicFields[field.field_key] = value;
                  }
                "
              />
            </div>
          </template>
          <template v-if="field.html_type === 'text'">
            <div :key="field.field_key" class="form-field">
              <label>{{ field.placeholder_t || field.label_t }}</label>
              <input
                :value="pda.formFields[field.field_key]"
                class="js-pda-postal_code input"
                size="large"
                type="text"
                @input="
                  e => {
                    dynamicFields[field.field_key] = e.target.value;
                  }
                "
              />
            </div>
          </template>
          <template v-if="field.html_type === 'textarea'">
            <div :key="field.field_key" class="form-field">
              <label>{{ field.placeholder_t || field.label_t }}</label>
              <textarea
                class="block w-full border outline-none"
                rows="3"
                :value="pda.formFields[field.field_key]"
                @input="
                  e => {
                    dynamicFields[field.field_key] = e.target.value;
                  }
                "
              />
            </div>
          </template>
          <template v-if="field.html_type === 'checkbox'">
            <div :key="field.field_key" class="py-1 mx-5">
              <input
                type="checkbox"
                :id="field.field_key"
                :value="pda.formFields[field.field_key]"
                @input="
                  e => {
                    dynamicFields[field.field_key] = e.target.checked;
                  }
                "
              />
              <label :for="field.field_key" class="px-2">{{
                field.placeholder_t || field.label_t
              }}</label>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div
      class="bg-white p-3 border-t border-gray-300 card-footer flex justify-between"
    >
      <base-button
        size="medium"
        data-cy="worksite-formaction-save"
        class="flex-grow m-1 text-black bg-purple-700 text-white"
        :action="savePda"
        :text="$t('~~Submit Request')"
      />
    </div>
  </form>
  <div v-else class="flex items-center justify-center h-full">
    <spinner />
  </div>
</template>

<script>
import * as turf from '@turf/turf';
import Pda from '@/models/Pda';
import GeocoderService from '@/services/geocoder.service';
import { What3wordsService } from '@/services/what3words.service';
import { getErrorMessage } from '@/utils/errors';
import RecurringSchedule from '@/components/RecurringSchedule';
import WorksiteSearchInput from '@/components/WorksiteSearchInput';
import Incident from '@/models/Incident';
import { buildForm, groupBy } from '@/utils/form';
import FormSelect from '@/components/FormSelect';

export default {
  name: 'PreliminaryAssessment',
  components: {
    FormSelect,
    RecurringSchedule,
    WorksiteSearchInput,
  },
  async mounted() {
    this.ready = false;
    await Incident.api().fetchById(this.$route.params.incident_id);
    this.ready = true;
  },
  data() {
    return {
      ready: false,
      gettingLocation: false,
      location: null,
      incident: null,
      geocoderResults: [],
      pda: {
        formFields: {},
      },
      dynamicFields: {},
      sectionCounter: 2,
      addAdditionalPhone: false,
    };
  },
  computed: {
    fields() {
      const excludeSections = ['claim_status_report_info'];
      if (this.currentIncident && this.currentIncident.form_fields) {
        const formFields = this.currentIncident.form_fields.filter(field => {
          return (
            !excludeSections.includes(field.field_parent_key) &&
            !excludeSections.includes(field.field_key)
          );
        });
        const returnArray = [];
        buildForm(null, groupBy('field_parent_key')(formFields), returnArray);
        return returnArray;
      }
      return [];
    },
    currentIncident() {
      return Incident.find(this.$route.params.incident_id);
    },
    fieldsArray() {
      return this.fields.map(field => field.field_key);
    },
  },
  methods: {
    getSectionCount(currentField) {
      return currentField.order_label;
    },
    updatePda(value, key) {
      this.pda[key] = value;
      this.pda = { ...this.pda };
    },
    async findPotentialGeocode() {
      const geocodeKeys = ['address', 'city', 'county', 'state', 'postal_code'];
      const nonEmptyKeys = geocodeKeys.filter(key => Boolean(this.pda[key]));
      if (nonEmptyKeys.length > 1) {
        const values = nonEmptyKeys.map(key => this.pda[key]);
        const address = values.join(', ');
        const geocode = await GeocoderService.getPlaceDetails(address);
        geocodeKeys.forEach(key =>
          this.updatePda(geocode.address_components[key], key),
        );
        const { lat, lng } = geocode.location;
        this.updatePda(
          {
            type: 'Point',
            coordinates: [lng, lat],
          },
          'location',
        );
        this.$emit('geocoded', geocode.location);
      }
    },
    checkGeocodeLocation({ lat, lng }) {
      if (!this.currentIncident.locationModels.length) {
        return true;
      }
      let isWithinBounds = false;

      this.currentIncident.locationModels.forEach(location => {
        const geojsonFeature = {
          type: 'Feature',
          properties: location.attr,
          geometry: location.poly || location.geom || location.point,
        };
        const locationFeature = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        };
        const intersects = turf.booleanPointInPolygon(
          locationFeature,
          geojsonFeature,
        );
        if (intersects) {
          isWithinBounds = true;
        }
      });
      return isWithinBounds;
    },
    async updatePdaFields(geocode) {
      const { lat, lng } = geocode.location;
      const geocodeKeys = ['address', 'city', 'county', 'state', 'postal_code'];
      geocodeKeys.forEach(key =>
        this.updatePda(geocode.address_components[key], key),
      );

      this.updatePda(
        {
          type: 'Point',
          coordinates: [lng, lat],
        },
        'location',
      );
      const what3words = await What3wordsService.getWords(lat, lng);
      this.updatePda(what3words, 'what3words');
      this.$emit('geocoded', geocode.location);
    },

    clearLocationFields() {
      const geocodeKeys = [
        'address',
        'city',
        'county',
        'state',
        'postal_code',
        'location',
        'what3words',
      ];
      geocodeKeys.forEach(key => this.updatePda(null, key));
      this.$emit('clearMarkers');
    },

    async onGeocodeSelect(value) {
      const geocode = await GeocoderService.getPlaceDetails(value.description);
      await this.updatePdaFields(geocode);
    },
    async geocoderSearch(value) {
      this.geocoderResults = await GeocoderService.getMatchingAddressesGoogle(
        value,
      );
    },
    async savePda() {
      const isValid = this.$refs.form.reportValidity();
      if (!isValid) {
        return;
      }

      if (this.location) {
        this.updatePda(
          {
            type: 'Point',
            coordinates: [
              this.location.coords.longitude,
              this.location.coords.latitude,
            ],
          },
          'location',
        );
      }
      const fieldData = this.dynamicFields;

      const truthyValues = Object.keys(fieldData).filter(key => {
        return Boolean(fieldData[key]) && this.fieldsArray.includes(key);
      });

      const formData = truthyValues.map(key => {
        return {
          field_key: key,
          field_value: fieldData[key],
        };
      });

      this.updatePda(formData, 'form_data');

      try {
        await Pda.api().post('/pdas', {
          ...this.pda,
          incident: this.currentIncident.id,
        });
        await this.$toasted.success(this.$t('caseForm.new_case_success'));
      } catch (error) {
        await this.$toasted.error(getErrorMessage(error));
      }
    },
    resetForm() {
      this.pda = new Pda({});
    },
    getValue(fieldKey) {
      if (!this.pda || !this.pda.form_data) {
        return '';
      }

      const key = this.pda.form_data.find(element => {
        return element.field_key === fieldKey;
      });
      if (key) {
        this.$log.debug(`${fieldKey}:${key.field_value}`);

        return key.field_value;
      }
      return '';
    },
    getSelectValue(fieldKey) {
      if (!this.pda || !this.pda.form_data) {
        return '';
      }

      const key = this.pda.form_data.find(element => {
        return element.field_key === fieldKey;
      });
      if (key) {
        const currentField = this.fields.find(field => {
          return field.field_key === fieldKey;
        });

        return currentField.values.find(field => {
          return field.value === key.field_value;
        });
      }
      return '';
    },
    getSelectValuesList(defaultValues) {
      return Object.keys(defaultValues).map(key => {
        return {
          value: key,
          name_t: this.$t(defaultValues[key]),
        };
      });
    },
    getBooleanValue(fieldKey) {
      if (!this.pda || !this.pda.form_data) {
        return '';
      }

      const key = this.pda.form_data.find(element => {
        return element.field_key === fieldKey;
      });
      if (key) {
        return key.field_value;
      }
      return false;
    },
    async getLocation() {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }
        navigator.geolocation.getCurrentPosition(
          pos => {
            resolve(pos);
          },
          err => {
            reject(err);
          },
        );
      });
    },
  },
};
</script>

<style scoped>
.ant-form-item {
  padding-top: 10px;
  margin: 0;
}

.intake-form {
  height: 600px;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.intake-form::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.card-footer {
  min-height: 80px;
}

.form-field {
  @apply py-1 mx-5 flex flex-col;
}

.form-field-row {
  @apply py-1 mx-3 flex flex-row;
}

.form-field > .input {
  @apply h-10 p-1 border outline-none;
}

h4 {
  font-size: 16px;
  font-weight: bold;
}

h5 {
  font-size: 14px;
  font-weight: bold;
}
</style>
