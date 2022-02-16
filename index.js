const instance_skel = require('../../instance_skel')
let debug = () => {}
let log

class instance extends instance_skel {
	/**
	 * Create an instance of the module
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config)
		this.pollingInterval = 1000 // ms
		this.actions() // export actions
		this.startPolling();
	}

	updateConfig(config) {
		this.config = config;
		this.stopPolling();
		this.startPolling();
	}

	init() {
		this.status(this.STATE_OK)

		debug = this.debug
		log = this.log
	}

	// Return config fields for web config
	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Host',
				width: 12,
			},
			{
				type: 'number',
				id: 'port',
				label: 'Port',
				width: 6,
			}
		]
	}

	// When module gets deleted
	destroy() {
		this.stopPolling();
	}

	parseStates(data) {
		this.states = {};
		data.forEach((el) => {
			this.states[el.id] = "state" in el ? el.state : el.text;
		});
	}

	startPolling() {
		this.system.emit('rest_poll_destroy', this.id);
		this.system.emit('rest_poll_get', this.id, parseInt(this.pollingInterval), `http://${this.config.host}:${this.config.port}/api/getstates`, (err, pollInstance) => {
			this.status(this.STATUS_ERROR, 'Polling Failed');
		}, (error, response) => {
			if(error || typeof response.data !== 'object') {
				this.status(this.STATUS_ERROR, 'States Request Failed');
			} else {
				this.status(this.STATUS_OK);
				this.parseStates(response.data);
			}
		});
	}

	stopPolling() {
		this.system.emit('rest_poll_destroy', this.id);
	}

	actions(system) {
		this.setActions({
			enable_onair: {
				label: 'Enable ON AIR'
			},
            disable_onair: {
				label: 'Disable ON AIR'
			},
			toggle_onair: {
				label: 'Toggle ON AIR'
			},
			set_countdown_text: {
				label: 'Set countdown text',
				options: [
					{
						type: 'textinput',
						id: 'text',
						label: 'Text',
						width: 12,
					}
				]
			},
			set_countdown_time: {
				label: 'Set countdown time',
				options: [
					{
						type: 'textinput',
						id: 'time',
						label: 'Time',
						width: 12,
					}
				]
			},
            enable_countdown: {
				label: 'Enable countdown'
			},
            disable_countdown: {
				label: 'Disable countdown'
			},
			toggle_countdown: {
				label: 'Toggle countdown'
			},
            enable_countdown_go_on_air_on_time: {
				label: 'Go ON AIR when countdown finishes'
			},
            disable_countdown_go_on_air_on_time: {
				label: 'Disable going ON AIR when countdown finishes'
			},
			toggle_countdown_go_on_air_on_time: {
				label: 'Toggle going ON AIR when countdown finishes'
			},
            enable_12hclock: {
				label: 'Show clock in 12 hours format (AM/PM)'
			},
            disable_12hclock: {
				label: 'Show clock in 24 hours format'
			},
			toggle_12hclock: {
				label: 'Toggle clock in 24 hours format'
			},
			enable_transparent_background: {
				label: 'Enable transparent background'
			},
			disable_transparent_background: {
				label: 'Disable transparent background'
			},
			toggle_transparent_background: {
				label: 'Toggle transparent background'
			},
			enable_show_clock_hands: {
				label: 'Show clock hands'
			},
			disable_show_clock_hands: {
				label: 'Hide clock hands'
			},
			toggle_show_clock_hands: {
				label: 'Toggle clock hands'
			}
		})
	}

	action(action) {
		let action_switch_feature = /(enable|disable|toggle)_(onair|countdown_go_on_air_on_time|countdown|12hclock|transparent_background|show_clock_hands)/gm.exec(action.action);

		if(action_switch_feature) {
			let feature = action_switch_feature[2];
			let api_endpoint = feature
				.replace('countdown_go_on_air_on_time', 'autoonair')
				.replace('transparent_background', 'transparent')
				.replace('countdown', 'enablecountdown')
				.replace(/_/g, '');

			let enable = action_switch_feature[1] == 'enable';
			if(action_switch_feature[1] == 'toggle') {
				enable = !this.states[api_endpoint];
			}
			let api_state = enable ? 'true' : 'false';

			this.system.emit('rest_get', `http://${this.config.host}:${this.config.port}/api/${api_endpoint}/${api_state}`, (error, params) => {
				if(error) {
					this.status(this.STATE_ERROR, 'Request error');
				} else {
					this.status(this.STATE_OK);
					this.parseStates(params.data.currentState);
				}
			});
		} else if(action.action == 'set_countdown_text') {
			this.system.emit('rest', `http://${this.config.host}:${this.config.port}/api/countdowntext`, action.options.text, (error, params) => {
				if(error) {
					this.status(this.STATE_ERROR, 'Request error');
				} else {
					this.status(this.STATE_OK);
					this.parseStates(params.data.currentState);
				}
			});
		} else if(action.action == 'set_countdown_time') {
			this.system.emit('rest', `http://${this.config.host}:${this.config.port}/api/countdowntime`, action.options.time, (error, params) => {
				if(error) {
					this.status(this.STATE_ERROR, 'Request error');
				} else {
					this.status(this.STATE_OK);
					this.parseStates(params.data.currentState);
				}
			});
		}
	}
}
exports = module.exports = instance