// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * TODO describe module gateway_modal
 *
 * @module     paygw_wallet/gateway_modal
 * @copyright  2025 Mohammad Farouk <phun.for.physics@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Selectors from "core_payment/selectors";
import $ from 'jquery';
import {getString} from 'core/str';
import Ajax from 'core/ajax';

const walletComponents = ['enrol_wallet', 'auth_wallet', 'availability_wallet'];

/**
 *
 * @param {string} component
 * @param {string} paymentArea
 * @param {integer} itemId
 * @param {string} description
 * @returns {string}
 */
export const process = async(component, paymentArea, itemId, description) => {
    if (walletComponents.includes(component)) {
        removeWallet();
        throw new Error(await getString('walletnotforwallet', 'paygw_wallet'));
    }

    let result = await processPayment(component, paymentArea, itemId, description);

    if (!result.success) {
        throw new Error(result.reason);
    }

    let returnStr = await getString('paymentsuccessfull', 'paygw_wallet', result.url);

    window.location.href = result.url;
    return returnStr;
};

/**
 * Process The payment.
 * @param {string} component
 * @param {string} paymentArea
 * @param {integer} itemId
 * @param {string} description
 * @returns {Object}
 */
async function processPayment(component, paymentArea, itemId, description)  {
    let requests = Ajax.call([{
        methodname: 'paygw_wallet_process',
        args: {
            component: component,
            paymentarea: paymentArea,
            itemid: itemId,
            description: description,
        }
    }]);
    let response = await requests[0];
    return response;
}

/**
 * Try to remove the wallet option.
 */
function removeWallet() {
    let walletGateway = $(Selectors.regions.gatewaysContainer + ' div.form-check.wallet');
    walletGateway.remove();
}
