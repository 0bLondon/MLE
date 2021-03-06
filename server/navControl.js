'use strict';
const GenRobotInstruct = require('./genRobotInstructions.js');

var SPEED = 75;
var DURATION = 0.5;

function RobotNav(botNum) {

	this.STATES = {
		STOPPED: 'Stopped',
		SEARCHING: 'Searching',
		BACKTRACKING: 'Backtracking',
		FOUND: 'Found'
	}

	this.rNum = botNum;

	this.CURR_STATE = this.STATES.STOPPED;

	this.history = [];
	this.searchCounter = 0;

	this.report = function(message) {
		console.log('Bot ' + this.rNum + ': ' + message);
	}

	this.setState = function(state) {
		this.CURR_STATE = this.STATES[state];
		this.report("Nav State set to " + this.CURR_STATE);
	}

	this.getCmd = function() {
		if(this.CURR_STATE == this.STATES.STOPPED) {
			return GenRobotInstruct.getStop();
		}
		if(this.CURR_STATE == this.STATES.SEARCHING) {
			var cmd = '';
			if(this.searchCounter == 0) {
				cmd = GenRobotInstruct.genForward(SPEED, DURATION);
			}
			else if(this.searchCounter == 1) {
				cmd = GenRobotInstruct.genLeft(-SPEED, DURATION);
			}
			else if(this.searchCounter == 2) {
				cmd = GenRobotInstruct.genRight(SPEED,DURATION);
			}
			else if(this.searchCounter == 3) {
				cmd = GenRobotInstruct.genRight(SPEED, DURATION)
			}
			else if(this.searchCounter == 4) {
				cmd = GenRobotInstruct.genLeft(-SPEED, DURATION)
			}
			this.searchCounter += 1
			if(this.searchCounter > 4) {
				this.searchCounter = 0;
			}
			if(this.history.length >= 5) {
				this.history.shift();
			}
			this.history.push(cmd);
			return cmd;
		}
		if(this.CURR_STATE == this.STATES.BACKTRACKING) {
			if(this.searchCounter.length > 0) {
				return this.searchCounter.pop();
			}
			return GenRobotInstruct.getStop();
		}
		if(this.CURR_STATE == this.STATES.FOUND) {
			return GenRobotInstruct.getStop();
		}
	}
}

module.exports = RobotNav;
