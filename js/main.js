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
		this.tabs();
		this.selects();
		this.reviewLazy();
		this.sliders.init();
		Maska.create('._masked');
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

	// переключение класса активности у передаваемых элементов
	toggle(instance, elem)
	{
		if(instance)
			instance.classList.toggle('active');
		
		if(elem)
			document.querySelector(elem).classList.toggle('active');
	},
	
	// получить соседние элементы
	getSiblings(e)
	{
		let siblings = []; 
		// if no parent, return no sibling
		if(!e.parentNode)
			return siblings;
		
		// first child of the parent node
		let sibling  = e.parentNode.firstChild;
		
		// collecting siblings
		while (sibling)
		{
			if (sibling.nodeType === 1 && sibling !== e)
				siblings.push(sibling);
			
			sibling = sibling.nextSibling;
		}
		
		return siblings;
	},
	
	// инициализировать все табы на странице
	tabs()
	{
		const $btns = document.querySelectorAll('[data-nav-for]');
			  $tabs = document.querySelectorAll('[data-tab]');
		
		if(!$btns.length)
			return
		
		for(let i = 0; i < $btns.length; i++) {
			
			$btns[i].addEventListener('click', function() {
				global.getSiblings(this).forEach((elem) => { elem.classList.remove('active') });
				this.classList.add('active');
				
				$tabs.forEach((elem) => {
					elem.classList.remove('active');
					
					if(elem.getAttribute('data-tab') === $btns[i].getAttribute('data-nav-for'))
					elem.classList.add('active');
				});
			});
		}
	},

	reviewLazy()
	{
		let $youtube = document.querySelectorAll( '._reviewVideo' );
		
		for (let i = 0; i < $youtube.length; i++) {
			let source = 'https://img.youtube.com/vi/'+ $youtube[i].dataset.embed +'/hqdefault.jpg';
			
			let image = new Image();
			image.src = source;
			image.addEventListener( 'load', function() {
				$youtube[i].appendChild( image );
			}.bind(this, i ) );
	
			$youtube[i].addEventListener( 'click', function() {
				let iframe = document.createElement( 'iframe' );
				iframe.setAttribute( 'frameborder', '0' );
				iframe.setAttribute( 'allowfullscreen', '' );
				iframe.setAttribute( 'src', 'https://www.youtube.com/embed/'+ this.dataset.embed +'?rel=0&showinfo=0&autoplay=1' );

				this.innerHTML = '';
				this.appendChild( iframe );
			} );	
		};
	},
	
	// инициализировать все селекты на странице
	selects()
	{
		const $select = document.querySelectorAll('._selectBtn'),
			  $option = document.querySelectorAll('._selectOption');
		let index = 1;

		if(!$select.length)
			return
		
		$select.forEach(a => {
			a.addEventListener('click', b => {
				b.target.parentElement.classList.toggle('active');
			})
		})

		$option.forEach(a => {
			a.addEventListener('click', b => {
				const parent = b.target.closest('._select');
				
				parent.classList.remove('active');

				if(b.target.hasAttribute('data-value'))
					parent.children[0].setAttribute('data-value', b.target.getAttribute('data-value'));

				parent.children[0].innerText = b.target.innerText;
			})
		})
	},

	sliders:
	{
		init()
		{
			this.productsCarousel();
			this.reviewsCarousel();
			this.suppliersCarousel();
		},

		productsCarousel()
		{
			if(document.documentElement.clientWidth > 1023)
				return

			let $productsCarousel = document.querySelectorAll('._productsCarousel');

			$productsCarousel.forEach(elem => {
				new Splide(elem, {
					perPage: 3,
					perMove: 1,
					pagination: true,
					lazyLoad: 'nearby',
					gap: '30px',
					grid: {
						rows: 2,
						cols: 1,
						gap : {
							row: '20px',
						}
					},
					breakpoints: {
						479:
						{
							perPage: 2,
							perMove: 1,
							gap: '12px',
							pagination: true,
	
							grid: {
								gap : {
									row: '10px',
								}
							},
						}
					}
				} ).mount(window.splide.Extensions );
			})
		},

		reviewsCarousel()
		{
			new Splide( '._reviewsCarousel', {
				perPage: 2,
				perMove: 1,
				lazyLoad: 'nearby',
				gap: '30px',
				breakpoints: {
					1023: {
						perPage: 1,
						perMove: 1,
						fixedWidth: '575px',
					},

					600:
					{
						perPage: 1,
						perMove: 1,
						fixedWidth: 0
					}
				}
			} ).mount();
		},

		suppliersCarousel()
		{
			new Splide( '._suppliersCarousel', {
				perPage: 4,
				perMove: 1,
				pagination: false,
				cover  : true,
				lazyLoad: 'nearby',
				fixedWidth: '270px',
				fixedHeight: '268px',
				gap: '30px',
				grid: {
					rows: 2,
					cols: 1,
					gap : {
						row: '20px',
					}
				},
				breakpoints: {
					1023: {
						perPage: 2,
						perMove: 2,
						pagination: true,
					},

					479:
					{
						fixedWidth: '156px',
						fixedHeight: '152px',
						perPage: 1,
						perMove: 1,
						gap: '10px',
						pagination: true,

						grid: {
							gap : {
								row: '8px',
							}
						},
					}
				}
			} ).mount(window.splide.Extensions );
		},
	}
}