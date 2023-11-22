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

		this.baseAxiosOptions = {
			responseType: 'json',
			timeout: 5000,
			validateStatus: function (status) {
				return status == 200
			}
		}

		this.apiClient = axios.create({
			baseURL: 'http://' + this.config.host + ':' + this.config.port + '/api/',
			...this.baseAxiosOptions
		})

		this.states = {
			onair: false,
			enablecountdown: false,
			autoonair: false,
			countdowntext: '',
			countdowntime: '',
			'12hclock': false,
			transparent: false,
			showclockhands: false,
		}

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.setVariableValues(this.states) // set initial variable values

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

		this.apiClient = axios.create({
			baseURL: 'http://' + this.config.host + ':' + this.config.port + '/api/',
			...this.baseAxiosOptions
		})
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
		if (this.pollTimer != null) clearInterval(this.pollTimer)
		if (!this.config.host || this.config.host == '') {
			this.updateStatus(InstanceStatus.BadConfig, 'No target IP set')
			return
		}
		if (this.config.port == '') {
			this.updateStatus(InstanceStatus.BadConfig, 'No target port set')
			return
		}

		//Test connection
		this.updateStatus(InstanceStatus.Connecting, 'Waiting')
		this.log('debug', 'URL: http://' + this.config.host + ':' + this.config.port + '/api/')
		this.apiClient.get('getstates').then((response) => {
			if (response.status == 200) {
				this.updateStatus(InstanceStatus.Ok)
				this.pollTimer = setInterval(() => {
					this._restPolling()
				}, this.config.pollingInterval)
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, response.status + ' ' + response.statusText)
			}
		}).catch((error) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, error.message)
		})
	}

	async _restPolling() {
		try {
			let response = await this.apiClient.get('getstates')
			await this.processResponse(response)
		} catch (error) {
			await this.processError(error)
		}
	}

	async processError(error) {
		console.error("Processing error", error)
		this.updateStatus(InstanceStatus.Error, error.message)
	}

	async processResponse(response) {
		this.updateStatus(InstanceStatus.Ok)
		if (!Array.isArray(response.data)) return
		response.data.forEach((key) => {
			if (this.states.hasOwnProperty(key.id)) {
				if(key.hasOwnProperty('state')) {
					this.states[key.id] = key.state
				} else if(key.hasOwnProperty('text')) {
					this.states[key.id] = key.text
				}
			}
		})
		this.setVariableValues(this.states)
		this.checkFeedbacks('OnAir', 'Countdown', 'AutoOnAir')
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
