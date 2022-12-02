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
const global =
{
	/**
	* вызов функций, которые должны запускаться после загрузки DOM
	*/
	init()
	{
		this.header.stickCall();
		this.header.dropdownShowSubList();
		this.tabs();
		this.selects();
		this.youtubeLazy();
		this.rangeSlider();
		this.sliders.init();
		this.scrollTop.init();
		Maska.create('._masked');
	},

	popups:
	{
		showPopup: function(popup)
		{
			let $overlay = document.querySelector('._overlay'),
				$popup = document.querySelector(popup)
			$overlay.classList.add("_show");
			$popup.classList.add("_show");
		},
		closePopup: function()
		{
			let $overlay = document.querySelector('._overlay'),
				$popups = document.querySelectorAll('.popup')

			for (var i = 0; i < $popups.length; i++) {
				$popups[i].classList.remove('_show')
			}
			$overlay.classList.remove("_show");
			// $('body').css('overflow', 'visible');
		},
	},

	scrollTop:
	{
		init: function()
		{
			window.onscroll = function()
			{
				global.scrollTop.scrollFunction();
			};
		},
		scrollFunction: function()
		{
			var button = document.querySelector('.scroll-top');

			if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
				button.style.display = "block";
			else
				button.style.display = "none";
		},
		topFunction: function()
		{
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		}
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
					$subList.forEach((elem) => { elem.classList.remove('is-active'); })
					$subList[i].classList.add('is-active');
				});

				$triggerList[i].addEventListener('mouseleave', () => {
					$subList.forEach((elem) => { elem.classList.remove('is-active'); })
				});
			}
		},

		// активность поля для поиска и появление дропдауна с результатами
		search(instance)
		{
			if(instance.value && instance === document.activeElement)
			{
				document.querySelector('._searchDropdown').classList.add('is-active');
				document.querySelector('._search').classList.add('g-search--has-value');
			}
			else
			{
				document.querySelector('._searchDropdown').classList.remove('is-active');
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
			instance.classList.toggle('is-active');

		if(elem)
			document.querySelector(elem).classList.toggle('is-active');
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
		const $btns = document.querySelectorAll('[data-nav-for]'),
			  $tabs = document.querySelectorAll('[data-tab]');

		if(!$btns.length)
			return

		for(let i = 0; i < $btns.length; i++) {

			$btns[i].addEventListener('click', function() {
				global.getSiblings(this).forEach((elem) => { elem.classList.remove('is-active') });
				this.classList.add('is-active');

				$tabs.forEach((elem) => {
					elem.classList.remove('is-active');

					if(elem.getAttribute('data-tab') === $btns[i].getAttribute('data-nav-for'))
					elem.classList.add('is-active');
				});
			});
		}
	},

	youtubeLazy()
	{
		let $youtube = document.querySelectorAll( '._youtube' );

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
				b.target.parentElement.classList.toggle('is-active');
			})
		})

		$option.forEach(a => {
			a.addEventListener('click', b => {
				const parent = b.target.closest('._select');

				parent.classList.remove('is-active');

				if(b.target.hasAttribute('data-value'))
					parent.children[0].setAttribute('data-value', b.target.getAttribute('data-value'));

				parent.children[0].innerText = b.target.innerText;
			})
		})
	},

	rangeSlider()
	{
		const $productLimitSlider = document.querySelector('._priceRange'),
			  $minValueInput = document.querySelector('._priceMin'),
			  $maxValueInput = document.querySelector('._priceMax');

		if(!$productLimitSlider)
			return

		noUiSlider.create($productLimitSlider, {
			start: [1600, 8000],
			connect: true,
			tooltips: false,
			step: 1,
			range: {
				'min': 50,
				'max': 11547
			},

			format: {
				from: function(value)
				{
					return parseInt(value);
				},

				to: function(value)
				{
					return parseInt(value);
				}
			},
		});

		$productLimitSlider.noUiSlider.on('update', function( values, handle ) {
			$minValueInput.value = values[0];
			$maxValueInput.value = values[1];
		});

		$minValueInput.addEventListener('input', function () {
			$productLimitSlider.noUiSlider.set([this.value, null]);
		});

		$maxValueInput.addEventListener('input', function () {
			$productLimitSlider.noUiSlider.set([null, this.value]);
		});
	},

	sliders:
	{
		init()
		{
			this.productsCarousel();
			this.catalogProductSliders();
			this.productSlider();
			this.productPhotoCarousel();
			this.collectionCarousel();
			this.reviewsCarousel();
			this.suppliersCarousel();
			this.videoGalleryCarousel();
		},

		productsCarousel()
		{
			if(document.documentElement.clientWidth > 1023)
				return

			let $productsCarousel = document.querySelectorAll('._productsCarousel');

			if(!$productsCarousel.length)
				return

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

		catalogProductSliders()
		{
			const $catalogProduct = document.querySelectorAll('._catalogProduct');

			if(!document.querySelectorAll('._catalogProduct').length)
				return

			$catalogProduct.forEach(elem => {
				let $catalogProductSlider = new Splide(elem.querySelector('._catalogProductSlider'), {
					rewind     : true,
					heightRatio: 0.5,
					pagination : false,
					cover  : true,
					lazyLoad: 'nearby',
					fixedWidth: '340px',
					fixedHeight: '340px',

					breakpoints: {
						1099:
						{
							fixedWidth: '280px',
							fixedHeight: '280px',
						},

						1099:
						{
							fixedWidth: '290px',
							fixedHeight: '290px',
						}
					}
				} );

				let images = elem.querySelectorAll( '._catalogProductThumbs li' );

				let activeImage;
				let activeClass = 'is-active';

				for ( let i = 0, len = images.length; i < len; i++ ) {
					let image = images[ i ];

					$catalogProductSlider.on( 'click', function () {
						if ( activeImage !== image ) {
							$catalogProductSlider.go( i );
						}
					}, image );
				}

				$catalogProductSlider.on( 'mounted move', function ( newIndex ) {
					// newIndex will be undefined through the "mounted" event.
					let image = images[ newIndex !== undefined ? newIndex : splide.index ];

					if ( image && activeImage !== image ) {
						if ( activeImage ) {
							activeImage.classList.remove( activeClass );
						}

						global.getSiblings(image).forEach(elem => {
							elem.classList.remove(activeClass);
						})

						image.classList.add( activeClass );
						activeImage = image;
					}
				} );

				$catalogProductSlider.mount();

			})

		},

		productSlider()
		{
			if(!document.querySelectorAll('._product').length)
				return

			let secondarySlider = new Splide( '._productThumbs', {
				fixedWidth : '90px',
				fixedHeight: '90px',
				rewind     : true,
				gap        : 10,
				pagination : false,
				cover      : true,
				isNavigation: true,

				breakpoints: {
					1023:
					{
						fixedWidth : '60px',
						fixedHeight: '60px',
						gap        : 13,
					}
				}
			} ).mount();

			let primarySlider = new Splide( '._productSlider', {
				type       : 'fade',
				heightRatio: 0.5,
				fixedWidth : '470px',
				fixedHeight: '470px',
				pagination : false,
				arrows     : false,
				cover      : true,
				lazyLoad   : 'nearby',
				isNavigation: true,

				breakpoints: {
					1023:
					{
						fixedWidth : '280px',
						fixedHeight: '280px',
					},

					767:
					{
						fixedWidth : '290px',
						fixedHeight: '290px',
					}
				}
			} );

			primarySlider.sync( secondarySlider ).mount();
		},

		productPhotoCarousel()
		{
			if(!document.querySelectorAll('._productPhotoCarousel').length)
				return

				new Splide( '._productPhotoCarousel', {
					perPage: 4,
					perMove: 1,
					fixedWidth : '270px',
					fixedHeight: '214px',
					cover      : true,
					lazyLoad: 'nearby',
					gap: '30px',
					pagination: false
					// breakpoints: {
					// 	1023: {
					// 		perPage: 1,
					// 		perMove: 1,
					// 		fixedWidth: '575px',
					// 	},

					// 	600:
					// 	{
					// 		perPage: 1,
					// 		perMove: 1,
					// 		fixedWidth: 0
					// 	}
					// }
				} ).mount();
		},

		collectionCarousel()
		{
			if(!document.querySelectorAll('._collectionCarousel').length)
				return

			new Splide( '._collectionCarousel', {
				perPage: 4,
				perMove: 1,
				lazyLoad: 'nearby',
				gap: '30px',
				pagination: false,
				breakpoints: {
					1023: {
						perPage: 3,
						perMove: 1,
					},

					600:
					{
						perPage: 2,
						perMove: 1,
						gap: '12px',
						pagination: true,
					}
				}
			} ).mount();
		},

		reviewsCarousel()
		{
			if(!document.querySelectorAll('._reviewsCarousel').length)
				return

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

		videoGalleryCarousel()
		{
			if(!document.querySelectorAll('._videoGalleryCarousel').length)
				return

			new Splide( '._videoGalleryCarousel', {
				perPage: 4,
				perMove: 4,
				lazyLoad: 'nearby',
				gap: '30px',
				breakpoints: {
					1023: {
						perPage: 3,
						perMove: 3,
					},

					600:
					{
						perPage: 2,
						perMove: 2,
						fixedWidth: '135px',
						gap: '12px',
					}
				}
			} ).mount();
		},

		suppliersCarousel()
		{
			if(!document.querySelectorAll('._suppliersCarousel').length)
				return

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