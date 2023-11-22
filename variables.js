module.exports = async function (self) {
	self.setVariableDefinitions([
		{ variableId: 'onair', name: 'On Air' },
		{ variableId: 'enablecountdown', name: 'Enable Countdown' },
		{ variableId: 'autoonair', name: 'Auto On Air' },
		{ variableId: 'countdowntext', name: 'Countdown Text' },
		{ variableId: 'countdowntime', name: 'Countdown Time' },
		{ variableId: '12hclock', name: '12h Clock' },
		{ variableId: 'transparent', name: 'Transparent' },
		{ variableId: 'showclockhands', name: 'Show Clock Hands' }
	])
}
