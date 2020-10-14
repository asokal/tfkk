"use strict"

/**
 * инициализация всех инициализаций
 */
$(document).ready(function()
{
	o2.init();
});

/**
 * основной объект
 * @type {object}
 */
var o2 =
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
		o2.stickHeader(window);

		$(window).scroll(function()
		{
			o2.stickHeader(this);
		});
	},
}