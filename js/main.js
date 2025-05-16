// document.addEventListener('DOMContentLoaded', function () {
// 	alert('DOM fully loaded!');
// });

// Animated role text for hero section
const roles = [
	'AI Engineer',
	'ML Practitioner',
	'NLP Specialist',
	'LLM Developer'
];
let roleIndex = 0;
const animatedRoleText = document.getElementById('animated-role-text');

function showNextRole() {
	if (!animatedRoleText) return;
	animatedRoleText.style.opacity = 0;
	setTimeout(() => {
		animatedRoleText.textContent = roles[roleIndex];
		animatedRoleText.style.opacity = 1;
		roleIndex = (roleIndex + 1) % roles.length;
	}, 350);
}

setInterval(showNextRole, 2000);