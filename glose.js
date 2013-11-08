
// GLOZE
// Loïc Sander – www.akalollip.com
// v1.0 november 2013


// Gloze.js is a simple plugin meant to facilitate/promote the usage of sidenotes – common in print design – on the web.

// Put simply, it elevates a targeted element to the position of its anchor in the web page.
// To achieve this, Gloze works with one/two side container/s (defined by the parameter $mode, see below for details)
// the target elements are moved to the side container/s and then pushed until they face their anchor, if possible.

// By default, Gloze creates the side container/s based on a main container you indicate as the parameter $mainContainer.
// You can have the side containers already set in the DOM tree and ask only that the target elements
// be lifted up to their anchor: if the parameter $move is ‘false’, Gloze skips the moving-to-side-container part.


(function ( $ ) {

	var elemMoved = false;

	$.fn.glose = function(mainContainer, mode, move) {

		var 
			even = false,
			baselineRatio = 0.75, // see shift() for explanations
			baselineShift,
			parent = $(mainContainer),
			thisAnchor = this;


		if (move != undefined) { elemMoved = move; }

		// There are 3 modes
		// 12: a side column on both sides (1 & 2) of the main col.
		// 1: one side column to the left of the main col.
		// 2: one side column to the right of the main col.

		if (mode === 12) {

			parent // style for main column
				.before('<div class="aside left"></div>') // add side containers
				.after('<div class="aside right"></div>')
				.css({
					"width": "44%",
					"margin-left": "3%",
					"margin-right": "3%",
					"float": "left"
				});

			$('.aside') // style for side columns
				.css({
				"width": "24%",
				"float": "left"
			});
		}


		if (mode === 1) {

			parent // style for main column
				.before('<div class="aside left"></div>') // add side container
				.css({
					"width": "67%",
					"margin-left": "3%",
					"float": "left"
				});

			$('.aside') // style for side column
				.css({
				"width": "30%",
				"float": "left"
			});
		}


		if (mode === 2) {

			parent // style for main column
				.after('<div class="aside right"></div>') // add side container
				.css({
					"width": "67%",
					"margin-right": "3%",
					"float": "left"
				});

			$('.aside') // style for side column
				.css({
				"width": "30%",
				"float": "left"
			});
		}




		if (!elemMoved) {

			// 1. move all target elements to their side containers

			this.each(function() {

				var 
					anchor = $(this),
					target = $(anchor.attr("href")),
					side;


				if (target.length != 0) {

					if (mode === 1 || mode === 2) { side = ".aside"}
					if (mode === 12 && !even) { side = ".left"; }
					if (mode === 12 && even) { side = ".right"; }


					var display = target.css("display");
					if (display != "block") {target.css("display", "block");} // in case lifted content as an inline/hidden behavior

					target.appendTo(side); // move element to container $side
				}

				if (mode === 12 && side === ".left") { even = true; }
				if (mode === 12 && side === ".right") { even = false; }
			});



			// 2. lift the target elements up to their anchor’s position

			// Operations are separated to allow targeted elements to be originally situated anywhere in the DOM
			// if the two actions move/lift were part of the same .each() loop, 
			// target elements prior to their anchor in the DOM tree would falsify the lift calculation

			this.each(function() {

				var 
					anchor = $(this),
					target = $(anchor.attr("href"));


				if (target.length != 0) {

					// if target element is higher in page than reference, it is pushed to align with its anchor.
					if (shift(anchor, target, baselineRatio) > 0) { target.css("margin-top", shift(anchor, target, baselineRatio)); }
				}
			});

			elemMoved = true;
		}


		$(window).resize(function() {

			thisAnchor.each(function() {

				var 
					anchor = $(this),
					target = $($(this).attr("href"));

				if (target.length != 0 && elemMoved) {

					target.css("margin-top", "");

					if (shift(anchor, target, baselineRatio) > 0) { target.css("margin-top", shift(anchor, target, baselineRatio)); }
				}
			});
		});



		function shift(elem1, elem2, baseline) {

			var 
				topMargin = parseFloat(elem2.css("margin-top")),
				prevMargin = parseFloat(elem2.prev().css("margin-bottom")),
				baselineShift = (parseFloat(elem1.css("font-size")) - parseFloat(elem2.css("font-size")))*baseline;

			if (!prevMargin) { prevMargin = 0; }

			var	shift = elem1.offset().top - elem2.offset().top + baselineShift + topMargin + prevMargin;

				// Note on baselineShift: 
				// the value is used to align baselines between main text and text put aside
				// the shift value is calculated by substracting font-sizes + a baseline position indicator.
				// $baselineRatio is an approximation of baseline position, default is set to 0.75
				// This value corresponds to the ascenders’ height relating to a body size of 1:
				// you may need to adjust this value depending on the typeface you use
				// To deactivate the baseline alignment, enter a value of 1.

			return shift;
		}
	}
	
}(jQuery));
