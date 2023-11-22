module.exports = function (self) {
	self.setActionDefinitions({
		//On Air
		enable_onair: {
			name: 'Enable On Air',
			options: [],
			callback: async () => {
				await self.apiClient.get('onair/true')
			},
		},
		disable_onair: {
			name: 'Disable On Air',
			options: [],
			callback: async () => {
				await self.apiClient.get('onair/false')
			},
		},
		toggle_onair: {
			name: 'Toggle On Air',
			options: [],
			callback: async () => {
				await self.apiClient.get('onair/' + (self.states.onair ? 'false' : 'true'))
			},
		},
		//Enable Countdown
		enable_countdown: {
			name: 'Enable Countdown',
			options: [],
			callback: async () => {
				await self.apiClient.get('enablecountdown/true')
			},
		},
		disable_countdown: {
			name: 'Disable Countdown',
			options: [],
			callback: async () => {
				await self.apiClient.get('enablecountdown/false')
			},
		},
		toggle_countdown: {
			name: 'Toggle Countdown',
			options: [],
			callback: async () => {
				await self.apiClient.get('enablecountdown/' + (self.states.enablecountdown ? 'false' : 'true'))
			},
		},
		//Auto On Air
		enable_autoonair: {
			name: 'Enable Auto On Air',
			options: [],
			callback: async () => {
				await self.apiClient.get('autoonair/true')
			},
		},
		disable_autoonair: {
			name: 'Disable Auto On Air',
			options: [],
			callback: async () => {
				await self.apiClient.get('autoonair/false')
			},
		},
		toggle_autoonair: {
			name: 'Toggle Auto On Air',
			options: [],
			callback: async () => {
				await self.apiClient.get('autoonair/' + (self.states.autoonair ? 'false' : 'true'))
			},
		},
		//12h Clock
		enable_12hclock: {
			name: 'Enable 12h Clock',
			options: [],
			callback: async () => {
				await self.apiClient.get('12hclock/true')
			},
		},
		disable_12hclock: {
			name: 'Disable 12h Clock',
			options: [],
			callback: async () => {
				await self.apiClient.get('12hclock/false')
			},
		},
		toggle_12hclock: {
			name: 'Toggle 12h Clock',
			options: [],
			callback: async () => {
				await self.apiClient.get('12hclock/' + (self.states['12hclock'] ? 'false' : 'true'))
			},
		},
		//Transparent bkg
		enable_transparent_background: {
			name: 'Enable Transparent Background',
			options: [],
			callback: async () => {
				await self.apiClient.get('transparent/true')
			},
		},
		disable_transparent_background: {
			name: 'Disable Transparent Background',
			options: [],
			callback: async () => {
				await self.apiClient.get('transparent/false')
			},
		},
		toggle_transparent_background: {
			name: 'Toggle Transparent Background',
			options: [],
			callback: async () => {
				await self.apiClient.get('transparent/' + (self.states.transparent ? 'false' : 'true'))
			},
		},
		//Show Clock Hands
		enable_showclockhands: {
			name: 'Enable Show Clock Hands',
			options: [],
			callback: async () => {
				await self.apiClient.get('showclockhands/true')
			},
		},
		disable_showclockhands: {
			name: 'Disable Show Clock Hands',
			options: [],
			callback: async () => {
				await self.apiClient.get('showclockhands/false')
			},
		},
		toggle_showclockhands: {
			name: 'Toggle Show Clock Hands',
			options: [],
			callback: async () => {
				await self.apiClient.get('showclockhands/' + (self.states.showclockhands ? 'false' : 'true'))
			},
		},
		//Set Countdown Text
		set_countdowntext: {
			name: 'Set Countdown Text',
			options: [
				{
					id: 'text',
					type: 'textinput',
					label: 'Text',
					default: 'Countdown',
				},
			],
			callback: async (event) => {
				await self.apiClient.get('countdowntext/' + event.options.text)
			},
		},
		//Set Countdown Time
		set_countdowntime: {
			name: 'Set Countdown Time',
			options: [
				{
					id: 'time',
					type: 'textinput',
					label: 'Time',
					default: '00:00:00',
				},
			],
			callback: async (event) => {
				await self.apiClient.get('countdowntime/' + event.options.time)
			},
		},
	})
}
