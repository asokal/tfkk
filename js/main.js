"use strict"

/**
 * инициализация всех инициализаций
 */
$(document).ready(function()
{
	global.init();
});

/**
 * основной объект
 * @type {object}
 */
var global =
{
	/**
	 * вызов функций, которые должны запускаться при загрузке страницы
	 */
	init()
	{
		this.stickHeaderCall();
	},

	stickHeader: function(instance)
	{
		if($(instance).scrollTop() != 0 && $('._header').hasClass('header--fixed'))
			return;

		if($(instance).scrollTop() != 0)
			$('._header').addClass('header--fixed');
		else
			$('._header').removeClass('header--fixed');
	},

	stickHeaderCall: function()
	{
		global.stickHeader(window);

		$(window).scroll(function()
		{
			global.stickHeader(this);
		});
	},
}