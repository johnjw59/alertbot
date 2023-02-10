'use strict';

const alertEvents = require('../../lib/AlertEvents');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const schedule = require('node-schedule');

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
            let change = $('.price-direction', $price_elem).text();

            // If there's a change, send a message about it.
            if (change != 'n/c') {
              const direction = $('.price-direction', $price_elem).hasClass('pd-down') ? 'decreasing' : 'increasing';
              change = change.substring(2);

              // Get the date and the predicted price.
              const price = $price_elem.contents()[0].nodeValue.trim();
              const date = moment(
                $('.price-date').text().substring(21),
                'dddd Do of MMMM YYYY'
              ).format('LL');

              // @TODO : remember this date (and price?) so we don't send duplicate notifications.

              // Send the message
              alertEvents.emitAlert(`Gas price is ${direction} to ${price}/L on ${date}`);
            }
          }
        });
      });
  });
}

module.exports = GasWizard();
