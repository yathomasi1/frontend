// @flow
import { makeABTest } from 'common/modules/commercial/contributions-utilities';

import {
    getSupporterPaymentRegion as geolocationGetSupporterPaymentRegion,
    getSync as geolocationGetSync,
} from 'lib/geolocation';

import config from 'lib/config';

import type { CtaUrls } from 'common/modules/commercial/contributions-utilities';

const EURsupportURL = 'https://support.theguardian.com/eu';
const abTestName = 'AcquisitionsEpicEurSupport';

const oneButtonTemplate = (urls: CtaUrls): string => {
    const url = urls.supportUrl || '';

    const supportButtonSupport = `
        <div>
            <a class="contributions__option-button contributions__contribute contributions__contribute--epic contributions__contribute--epic-member contributions__contribute--epic-single-button"
              href="${url}"
              target="_blank">
              Support The Guardian
            </a>
        </div>`;

    const paymentLogos = `<img class="contributions__payment-logos contributions__contribute--epic-member" src="${config.get(
        'images.acquisitions.paypal-and-credit-card',
        ''
    )}" alt="Paypal and credit card">`;

    return `
        <div class="contributions__amount-field">
            ${supportButtonSupport}
            ${paymentLogos}
        </div>`;
};

export const acquisitionsEpicEurSupport = makeABTest({
    id: abTestName,
    campaignId: abTestName,

    start: '2018-03-01',
    expiry: '2018-04-17',

    author: 'Santiago Villa Fernandez',
    description: 'Use the Epic to partition the audience for the EUR test',
    successMeasure: 'AV 2.0',
    idealOutcome:
        'We channel an even split of frontend traffic into the correct eu version',
    audienceCriteria: 'ALL EUR transaction web traffic',
    audience: 1,
    audienceOffset: 0,
    canRun: () =>
        geolocationGetSupporterPaymentRegion(geolocationGetSync()) === 'EU',
    variants: [
        {
            id: 'control',
            products: [],
        },
        {
            id: 'support_contribute',
            products: [],
            options: {
                supportBaseURL: EURsupportURL,
                buttonTemplate: oneButtonTemplate,
            },
        },
    ],
});
