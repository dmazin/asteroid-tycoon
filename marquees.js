
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
		'html': "HEY YOU, STOP STARING AT THIS MARQUEE AND GET BACK TO WORK!",
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
		'html': "GRUMBLING IS HEARD AMONG THE ROBOT RANKS. THERE IS TALK OF STARTING A UNION.",
		'class': 'alert',
		'condition': function () {
			return playerState.getTotalRobotsKilled() > 10;
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
		'html': "YOU HAVE DISCOVERED <span class='amount'>0</span> ALIEN ARTIFACTS. WHAT SECRETS DO THEY HOLD?",
		'class': 'resource artifact',
		'condition': function () {
			return playerState.getResource('artifact') > 0;
		}
	},
	{
		'html': "4 OUT OF 5 ASTEROID MINERS RECOMMEND TERRAFORMING",
		'class': 'ad',
		'condition': function () {
			return true;
		}
	}
];

function addToMarquee() {
	var possibleMessages = marqueeMessages.filter(function (msg) {
		return msg.condition()
			&& ('notification ') + msg.class != $('marquee').children().last().attr('class');
	});
	var msg = possibleMessages[_.random(possibleMessages.length - 1)];
	$('<span class="notification">').addClass(msg.class)
		.html(msg.html)
		.appendTo($('marquee'));
	updateNotifications();
}

function updateNotifications() {
	_.each(playerState.getResources(), function (amount, resource) {
		$('.notification.' + resource + ' .amount').text(parseInt(amount));
	});
	$('.notification.killed .amount').text(playerState.getTotalRobotsKilled());
}

addToMarquee();
addToMarquee();
addToMarquee();
setInterval(addToMarquee, 5000);
