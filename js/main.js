"use strict"

/**
* инициализация всех инициализаций
*/
document.addEventListener('DOMContentLoaded', function() {
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
		this.header.stickHeaderCall();
		this.header.dropdownShowSubList();
	},

	screenWidth: document.documentElement.clientWidth,

	header: 
	{

		stickHeader: function(instance)
		{
			let $catalog      = document.querySelector('._headerCatalog'),
				$body         = document.querySelector('body'),
				catalogHeight = $catalog.offsetHeight + 'px',
				catalogOffset = 157;

			if(instance.scrollY > catalogOffset && $catalog.classList.contains('header-catalog--fixed'))
				return;
		
			if(instance.scrollY > catalogOffset)
			{
				$catalog.classList.add('header-catalog--fixed');
				$body.style.paddingTop = catalogHeight;
			}
			else
			{
				$catalog.classList.remove('header-catalog--fixed');
				$body.style.paddingTop = 0;
			}
		},
		
		stickHeaderCall: function()
		{
			this.stickHeader(window);

			window.addEventListener('scroll', () => {
				this.stickHeader(window);
			});
		},
		
		toggleNav(instance, navItem)
		{
			instance.classList.toggle('active');
			document.querySelector(navItem).classList.toggle('active');
		},
		
		dropdownShowSubList()
		{
			const $triggerList = document.querySelectorAll('._subListTrigger'),
				  $subList     = document.querySelectorAll('._subList');
			
			for (let i = 0; i < $triggerList.length; i++) {
				$triggerList[i].addEventListener('mouseenter', () => {
					$subList.forEach((elem) => { elem.classList.remove('active'); })
					$subList[i].classList.add('active');
				});
				
				$triggerList[i].addEventListener('mouseleave', () => {
					$subList.forEach((elem) => { elem.classList.remove('active'); })
				});
			}
		},

		search(instance)
		{
			if(instance.value)
			{
				document.querySelector('._searchDropdown').classList.add('active');
				document.querySelector('._search').classList.add('g-search--has-value');
			}
			else
			{
				document.querySelector('._searchDropdown').classList.remove('active');
				document.querySelector('._search').classList.remove('g-search--has-value');
			}
		},

		searchClear()
		{
			document.querySelector('._searchInput').value = '';
			this.search('._searchInput');
		}
	},

}