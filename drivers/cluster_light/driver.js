/*
Copyright 2018, Robin de Gruijter (gruijter@hotmail.com)

This file is part of com.gruijter.clusterlights.

com.gruijter.clsterlights is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

com.gruijter.clusterlights is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with com.gruijter.clusterlights. If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

const Homey = require('homey');


class ClusterLightDriver extends Homey.Driver {

	onInit() {
		this.log('ClusterLightDriver onInit');
	}

	async discoverLights() {
		this.log('device discovery started');
		try {
			// discover all peripherals that advertise a service fff0
			const list = await Homey.ManagerBLE.discover(['fff0']);
			const pairList = list.map((light) => {
				const device = {
					name: `${light.address}_${light.localName}`,
					data: { id: light.uuid },
				}
				return device;
			});
			return Promise.resolve(pairList);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	onPairListDevices(data, callback) {
		this.log('pair listing of devices started');
		this.discoverLights()
			.then((deviceList) => {
				callback(null, deviceList);
			})
			.catch((error) => {
				callback(error);
			});
	}

}

module.exports = ClusterLightDriver;