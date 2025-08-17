import { AccountsTemplates } from 'meteor/useraccounts:core';

export default (() => {
	AccountsTemplates.configure({
		// Behavior
		confirmPassword: true,
		enablePasswordChange: false,
		forbidClientAccountCreation: true,
		overrideLoginErrors: false,
		sendVerificationEmail: false,
		lowercaseUsername: true,
		focusFirstInput: true,

		// Appearance
		showAddRemoveServices: false,
		showForgotPasswordLink: false,
		showLabels: true,
		showPlaceholders: true,
		showResendVerificationEmailLink: false,
	});

	var pwd = AccountsTemplates.removeField('password');
	AccountsTemplates.removeField('email');
	AccountsTemplates.addFields([
		{
			_id: "username",
			type: "text",
			displayName: "username",
			required: true,
		},
		pwd
	]);	
})();
