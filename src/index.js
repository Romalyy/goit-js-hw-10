import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { countryСard, countryList } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry() {
  const searchQuery = inputEl.value.trim();
  if (searchQuery === '') {
    countryInfo.innerHTML = '';
    listEl.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        Notify.success('Too many matches found. Please enter a more specific name.');
        countryInfo.innerHTML = '';
        listEl.innerHTML = '';
        return;
      }

      if (data.length <= 10) {
        const listMarkup = data.map(country => countryList(country));
        listEl.innerHTML = listMarkup.join('');
        countryInfo.innerHTML = '';
      }

      if (data.length === 1) {
        const markup = data.map(country => countryСard(country));
        countryInfo.innerHTML = markup.join('');
        listEl.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryInfo.innerHTML = '';
      listEl.innerHTML = '';
      return error;
    });
}