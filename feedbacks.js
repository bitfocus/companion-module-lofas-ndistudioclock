const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		OnAir: {
			name: 'On Air status',
			type: 'boolean',
			label: 'On Air',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.states.onair
			},
		},
		Countdown: {
			name: 'Countdown status',
			type: 'boolean',
			label: 'Countdown',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.states.enablecountdown
			},
		},
		AutoOnAir: {
			name: 'Auto On Air status',
			type: 'boolean',
			label: 'Auto On Air',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.states.autoonair
			},
		},
	})
}
