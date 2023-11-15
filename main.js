const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const axios = require('axios')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting, 'Waiting')
		this.config = config

		this.pollTimer = null
		this.pollingInterval = 1000

		this.apiClient = axios.create({
			baseURL: 'http://' + this.config.host + ':' + this.config.port + '/api/',
			responseType: 'json',
			validateStatus: function (status) {
				return status != 200
			},
		})

		this.states = {
			onair: false,
			enablecountdown: false,
			autoonair: false,
			countdowntext: false,
			countdowntime: false,
			'12hclock': false,
			transparent: false,
			showclockhands: false,
		}

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		this.setupPolling()
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')

		if (this.pollTimer != null) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	async configUpdated(config) {
		this.config = config

		this.destroy()
		this.setupPolling()
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
				default: 13344,
			},
			{
				type: 'number',
				id: 'pollingInterval',
				label: 'Polling Interval (ms)',
				width: 4,
				default: 1000,
				min: 100,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	setupPolling() {
		clearInterval(this.pollTimer)
		this.pollTimer = setInterval(this._restPolling.bind(this), this.config.pollingInterval)
		this.log('info', 'Polling enabled at ' + this.config.pollingInterval + 'ms')
	}

	async _restPolling() {
		try {
			let response = await apiClient.get('states')
			await this.processResponse(response)
		} catch (error) {
			await this.processError(error)
		}
	}

	async processError(error) {
		this.updateStatus(InstanceStatus.Error, error.message)
	}

	async processResponse(response) {
		this.updateStatus(InstanceStatus.Ok)
		let states = response.body
		for (let key in states) {
			if (states.hasOwnProperty(key)) {
				this.states[key] = states[key]
			}
		}
		console.log(this.states)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
