// @flow
import { dfpEnv } from 'commercial-control/modules/dfp/dfp-env';
import loadAdvert from 'commercial-control/modules/dfp/load-advert';
import { Advert } from 'commercial-control/modules/dfp/Advert';
import { enableLazyLoad } from 'commercial-control/modules/dfp/enable-lazy-load';
import { updateAdvertMetric } from 'commercial-control/modules/dfp/performance-logging';

const advertsToInstantlyLoad = ['dfp-ad--merchandising-high', 'dfp-ad--im'];

const instantLoad = (): void => {
    const instantLoadAdverts = dfpEnv.advertsToLoad.filter(
        (advert: Advert): boolean => {
            if (advertsToInstantlyLoad.includes(advert.id)) {
                updateAdvertMetric(advert, 'loadingMethod', 'instant');
                updateAdvertMetric(advert, 'lazyWaitComplete', 0);
                return true;
            }
            updateAdvertMetric(advert, 'loadingMethod', 'lazy-load');
            return false;
        }
    );

    dfpEnv.advertsToLoad = dfpEnv.advertsToLoad.filter(
        (advert: Advert): boolean => !advertsToInstantlyLoad.includes(advert.id)
    );

    instantLoadAdverts.forEach(loadAdvert);
};

const displayLazyAds = (): void => {
    window.googletag.pubads().collapseEmptyDivs();
    window.googletag.enableServices();
    instantLoad();
    dfpEnv.advertsToLoad.forEach((advert: Advert): void => {
        enableLazyLoad(advert);
    });
};

export { displayLazyAds };
