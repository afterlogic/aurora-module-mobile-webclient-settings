'use strict';

module.exports = function (oAppData) {
	var
		ko = require('knockout'),
		App = require('%PathToCoreWebclientModule%/js/App.js')
	;
	
	if (App.getUserRole() === Enums.UserRole.NormalUser)
	{
		return {
			start: function (ModulesManager) {
				var SettingsView = require('modules/SettingsWebclient/js/views/SettingsView.js');
				var $html = $('html');
				SettingsView.ViewTemplate = '%ModuleName%_SettingsView';
				SettingsView.appsDom = null;
				SettingsView.showApps = ko.observable(false);
				SettingsView.onShow = function ()
				{
					$html.addClass('non-adjustable');
					if (this.appsDom === null)
					{
						this.appsDom = $('#apps-list');
						this.appsDom.on('click', function () {
							this.showApps(false);
						}.bind(this));

						this.showApps.subscribe(function (value) {
							$('body').toggleClass('with-panel-right-cover', value);
						}, this);
					}
				};
			}
		};
	}
	
	return null;
};
