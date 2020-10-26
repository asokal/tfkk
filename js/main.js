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
		this.header.stickCall();
		this.header.dropdownShowSubList();
	},

	header: 
	{
		// прилипание меню
		stick(instance)
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
		
		// вызов прилипания при загрузке страницы и при скролле, если устройство не мобильное
		stickCall()
		{
			if(document.documentElement.clientWidth < 1199)
				return

			this.stick(window);

			window.addEventListener('scroll', () => {
				this.stick(window);
			});
		},
		
		// переключение класса активности у передаваемых элементов
		toggle(instance, elem)
		{
			if(instance)
				instance.classList.toggle('active');

			if(elem)
				document.querySelector(elem).classList.toggle('active');
		},
		
		// появляние подменю в меню каталога
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

		// активность поля для поиска и появление дропдауна с результатами
		search(instance)
		{
			if(instance.value && instance === document.activeElement)
			{
				document.querySelector('._searchDropdown').classList.add('active');
				document.querySelector('._search').classList.add('g-search--has-value');
			}
			else
			{
				document.querySelector('._searchDropdown').classList.remove('active');
				setTimeout(() => document.querySelector('._search').classList.remove('g-search--has-value'), 100);
			}
		},

		// очистить поле поиска
		searchClear()
		{
			document.querySelector('._searchInput').value = '';
			// this.search('._searchInput');
		}
	},

	// получить соседние элементы
	getSiblings(elem)
	{
		let siblings = []; 
		// if no parent, return no sibling
		if(!e.parentNode) {
			return siblings;
		}
		// first child of the parent node
		let sibling  = e.parentNode.firstChild;
		
		// collecting siblings
		while (sibling) {
			if (sibling.nodeType === 1 && sibling !== e) {
				siblings.push(sibling);
			}
			sibling = sibling.nextSibling;
		}

		return siblings;
	}	
}