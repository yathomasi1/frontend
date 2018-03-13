// @flow

import {
    isPayingMember,
    accountDataUpdateWarning,
} from 'common/modules/commercial/user-features';
import fastdom from 'lib/fastdom-promise';
import { Message } from 'common/modules/ui/message';
import config from 'lib/config';
import bean from 'bean';
import mediator from 'lib/mediator';

const showAccountDataUpdateWarningMessage = accountDataUpdateWarningLink => {
    const gaTracker = config.get('googleAnalytics.trackers.editorial');
    const newMessage = new Message('membership-action-required', {
        cssModifierClass: 'membership-action-required',
        trackDisplay: true,
        siteMessageLinkName: 'membership-action-required',
        siteMessageComponentName: 'membership-action-required',
        customJs: () => {
            bean.on(document, 'click', '.js-site-message-close', () => {
                window.ga(
                    `${gaTracker}.send`,
                    'click',
                    'in page',
                    'membership action required | banner hidden'
                );
            });

            window.ga(
                `${gaTracker}.send`,
                'element view',
                'internal',
                'membership action required | banner impression'
            );
        },
    });
    newMessage.show(
        `An action is needed on your Guardian account. Please <a href='${
            accountDataUpdateWarningLink
        }'>update your details</a>`
    );
};

const initMembership = (): void => {
    console.log('** initMembership **');

    const asyncThing = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000)
        });
    };

    const updateLink = accountDataUpdateWarning();

    asyncThing().then((showMessage) => {
        console.log('*** initMembership async thing done ***', showMessage);

        if (showMessage) {
            showAccountDataUpdateWarningMessage(updateLink);
        }
    });

    // if (updateLink) {
    //     mediator.on('modules:onwards:breaking-news:ready', breakingShown => {
    //         if (!breakingShown) {
    //             showAccountDataUpdateWarningMessage(updateLink);
    //         }
    //     });
    // }
    // if (isPayingMember()) {
    //     fastdom
    //         .read(() => document.getElementsByClassName('js-become-member'))
    //         .then(becomeMemberLinks => {
    //             if (becomeMemberLinks.length) {
    //                 becomeMemberLinks[0].setAttribute('hidden', 'hidden');
    //             }
    //         });

    //     fastdom
    //         .read(() => document.getElementsByClassName('js-subscribe'))
    //         .then(subscriberLinks => {
    //             if (subscriberLinks.length) {
    //                 subscriberLinks[0].classList.remove(
    //                     'brand-bar__item--split--last'
    //                 );
    //             }
    //         });
    // }
};

export { initMembership };
