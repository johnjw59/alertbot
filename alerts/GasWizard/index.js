'use strict';

const alertEvents = require('../../lib/AlertEvents');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const schedule = require('node-schedule');
const store = require('store2');

function GasWizard() {
  // Daily at 6:30am.
  const schedule_rule = '0 30 6 * * *';

  const job = schedule.scheduleJob(schedule_rule, () => {
    axios.get('https://gaswizard.ca/gas-price-predictions/')
      .then(({ data }) => {
        const $ = cheerio.load(data);

        // Find the row for Vancouver.
        $('td.gwgp-cityname').each((i, el) => {
          const $el = $(el);

          if ($el.text().indexOf('Vancouver') !== -1) {
            // Price for regular is the first price element.
            const $price_elem = $($('.gwgp-price', $el.parent())[0]);
            const change = $('.price-direction', $price_elem).text();

            // If there's a change, send a message about it.
            if (change != 'n/c') {
              const data = {
                price: $price_elem.contents()[0].nodeValue.trim(),
                date: parseInt(moment(
                  $('.price-date').text().substring(21),
                  'dddd Do of MMMM YYYY'
                ).format('X')),
              };

              // Keep track of our data.
              const old_data = store.get('gaswizard.latest', { date: -1 });
              store.set('gaswizard.latest', data);

              // Send the alert!
              // But make sure we're looking at a new date. If we've seen this
              // date before, only continue if the price has changed.
              if ((data.date > old_data.date) || ((data.date == old_data.date) && (data.price != old_data.price))) {
                alertEvents.emitAlert(`Gas prediction for ${moment(data.date, 'X').format('LL')}: (${change}) ${data.price}/L`);
              }
            }
          }
        });
      });
  });
}

module.exports = GasWizard();
