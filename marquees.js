
var marqueeMessages = [
	{
		'html': "YOU HAVE $<span class='amount'>5000</span> NORMALIZED SPACE DOLLARS",
		'class': 'money',
		'condition': function () {
			return true;
		}
	},
	{
		'html': "PRODUCTION DECLINING, CORPORATE OVERSIGHT IMMINENT",
		'class': 'alert',
		'condition': function () {
			return true;
		}
	},
	{
		'html': "<span class='amount'>0</span> ROBOTS HAVE DIED AT YOUR HANDS. HOW MANY MORE MUST SUFFER?",
		'class': 'killed',
		'condition': function () {
			return playerState.getTotalRobotsKilled() > 0;
		}
	},
	{
		'html': "CONGRATULATIONS, YOU HAVE OBTAINED <span class='amount'>0</span> PAYDIRTIUM",
		'class': 'resource paydirtium',
		'condition': function () {
			return playerState.getResource('paydirtium') > 0;
		}
	},
	{
		'html': "CONGRATULATIONS, YOU HAVE OBTAINED <span class='amount'>0</span> FATLOOTIUM",
		'class': 'resource fatlootium',
		'condition': function () {
			return playerState.getResource('fatlootium') > 0;
		}
	},
	{
		'html': "CONGRATULATIONS, YOU HAVE OBTAINED <span class='amount'>0</span> CHEDDARIUM",
		'class': 'resource cheddarium',
		'condition': function () {
			return playerState.getResource('cheddarium') > 0;
		}
	},
	{
		'html': "CONGRATULATIONS, YOU HAVE OBTAINED <span class='amount'>0</span> AFLUENTIUM",
		'class': 'resource affluentium',
		'condition': function () {
			return playerState.getResource('affluentium') > 0;
		}
	},
	{
		'html': "CONGRATULATIONS, YOU HAVE OBTAINED <span class='amount'>0</span> CASHMONIUM",
		'class': 'resource cashmonium',
		'condition': function () {
			return playerState.getResource('cashmonium') > 0;
		}
	},
	{
		'html': "YOU HAVE DISCOVERED <span class='amount'>0</span> ALIEN ARTIFACTS. WHAT PURPOSE DO THEY HOLD?",
		'class': 'resource artifacts',
		'condition': function () {
			return playerState.getResource('artifacts') > 0;
		}
	},
	{
		'html': "4 OUT OF 5 ASTEROID MINERS RECOMMEND TERRAFORMING. ASK YOUR MINING PROFESSIONAL ABOUT TERRAFORMING TODAY!",
		'class': 'ad',
		'condition': function () {
			return true;
		}
	}
];

function addToMarquee() {
	var possibleMessages = marqueeMessages.filter(function (msg) {
		return msg.condition();
	});
	console.log(possibleMessages);
	var msg = possibleMessages[_.random(possibleMessages.length - 1)];
	if (msg.condition() === true) {
		$('<span class="notification">').addClass(msg.class)
			.html(msg.html)
			.appendTo($('marquee'));
	}
}

addToMarquee();
setInterval(addToMarquee, 5000);
