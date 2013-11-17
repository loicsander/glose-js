
// GLOSE
// Loïc Sander – www.akalollip.com
// v1.0 november 2013


// Glose.js is a simple plugin meant to facilitate/promote the usage of sidenotes – common in print design – on the web.

// Put simply, it elevates a targeted element to the position of its anchor in the web page.
// To achieve this, Glose works with one/two side container/s (defined by the parameter $mode, see below for details)
// the target elements are moved to the side container/s and then pushed until they face their anchor, if possible.

// By default, Glose creates the side container/s based on a main container you indicate as the parameter $mainContainer.
// You can have the side containers already set in the DOM tree and ask only that the target elements
// be lifted up to their anchor: if the parameter $move is ‘true’, Glose skips the moving-to-side-container part.


(function ( $ ) {

	var elementsMoved = false,
		baselineRatio = 0.75; // see hDelta() for explanations

	$.fn.glose = function(mainContainer, mode, moveOnly) {

		var anchors = this,
			mainColumn = $(mainContainer),
			globalSideClass = "aside",
			sideClassOne = "left",
			sideClassTwo = "right",
			even = false;

		init();

		function init() {

			if (!moveOnly || moveOnly === undefined) { pageSetting(); }
			toLevel(anchors);

			if ($(window).width() > 700) { elementsMoved = true; }
		}

		// There are 3 modes
		// 12: a side column on both sides (1 & 2) of the main col.
		// 1: one side column to the left of the main col.
		// 2: one side column to the right of the main col.

		function pageSetting() {

			if ($(window).width() >= 1024) {

				if (mode === 12) {

					$("." + sideClassOne + ", ." + sideClassTwo).addClass("dump").removeClass(globalSideClass); // Clear previous side containers if

					mainColumn // style for main column
						.before('<div class="'+ globalSideClass + ' ' + sideClassOne + '"></div>') // add side containers
						.after('<div class="'+ globalSideClass + ' ' + sideClassTwo + '"></div>')
						.css({ // style for main column 
							"width": "44%",
							"margin-left": "3%",
							"margin-right": "3%",
							"float": "left"
						});

					$('.' + globalSideClass) // style for side columns
						.css({
						"width": "24%",
						"float": "left"
					});
				}

				if (mode === 1 || mode ===2) { $("." + sideClassOne + ", ." + sideClassTwo).addClass("dump").removeClass(globalSideClass); } // Clear previous side containers if


				if (mode === 1) { mainColumn.before('<div class="'+ globalSideClass + ' ' + sideClassOne + '"></div>').css("margin-left", "5%"); } // add side container
				if (mode === 2) { mainColumn.after('<div class="'+ globalSideClass + ' ' + sideClassTwo + '"></div>').css("margin-right", "5%"); } // add side container


				if (mode === 1 || mode === 2) {

					mainColumn.css({ // style for main column 
							"width": "65%",
							"max-width": "30em",
							"float": "left"
						});

					$('.' + globalSideClass) // style for side column
						.css({
						"width": "30%",
						"float": "left"
						});
				}


				if (mode === 1 || mode === 2) { moveNote(anchors, "." + globalSideClass); }
				if (mode === 12) { moveNote(anchors, "." + sideClassOne, "." + sideClassTwo); }
			}


			if (($(window).width() < 1024) && ($(this).width() >= 700) && (mode === 12)) {

					mainColumn.css({
						"width": "65%",
						"max-width": "30em",
						"float": "left",
						"margin-left": "0"
					});

					$("." + sideClassOne + ", ." + sideClassTwo).addClass("dump").removeClass(globalSideClass);

					mainColumn.after('<div class="'+ globalSideClass + ' ' + sideClassTwo + '"></div>').css("margin-right", "5%");

					$('.' + globalSideClass).css({
						"width": "30%",
						"float": "left"
						});

					moveNote(anchors, '.' + globalSideClass);
				}


			if ($(window).width() < 700 && elementsMoved) {

				$("." + sideClassOne + ", ." + sideClassTwo).addClass("dump").removeClass(globalSideClass); // Clear previous side containers if

				mainColumn.css({
					"width": "100%",
					"max-width": "30em",
					"float": "none",
					"margin-left": "0",
					"margin-right": "0"
				});

				moveNote(anchors, "back");
			}

			$(".dump").remove();
		}


		$(window).resize(function() {

			pageSetting();
			toLevel(anchors);
		});


		
		function moveNote(anchors, container1, container2) { // moves the note to defined container/s

			anchors.each(function() {

				var
					anchor = $(this),
					target = $(anchor.attr("href")),
					receptacle;

				if (container1 === "back") { receptacle = anchor.parent().parent(); }
				else if (container2 === undefined) { receptacle = container1; }
				else if (container2 != undefined && !even) { receptacle = container1; }
				else if (container2 != undefined && even) { receptacle = container2; }

				if (target.length != 0) {

					var display = target.css("display");
					if (display != "block") {target.css("display", "block");} // in case lifted content as an inline/hidden behavior

					$(target).appendTo(receptacle); // move element to $receptacle

					if (container2 != undefined && !even) { even = true }
					else if (container2 != undefined && even) { even = false }
				}
			});
		}




		function toLevel(anchors) { // sets marginTop of the note so as to align with its anchor

			anchors.each(function() {

				anchor = $(this),
				target = $(anchor.attr("href"));

				if (target.length != 0) { 

					target.css("margin-top", ""); // Reset marginTop in case of any previous positioning

					if (hDelta(anchor, target) > 0) { 

						// if target element is higher in page than reference, it is pushed to align with its anchor.
						target.css("margin-top", hDelta(anchor, target));
					}
				}
			});
		}



		function hDelta(elem1, elem2) { // returns the height difference between two elements

			var 
				topMargin = parseFloat(elem2.css("margin-top")),
				prevMargin = parseFloat(elem2.prev().css("margin-bottom")),
				baselineShift = (parseFloat(elem1.css("font-size")) - parseFloat(elem2.css("font-size")))*baselineRatio;

			if (!prevMargin) { prevMargin = 0; }

			var	Delta = elem1.offset().top - elem2.offset().top + baselineShift + topMargin + prevMargin;

				// Note on baselineShift: 
				// the value is used to align baselines between main text and text put aside
				// the Delta value is calculated by substracting font-sizes + a baseline position indicator.
				// $baselineRatio is an approximation of baseline position, default is set to 0.75
				// This value corresponds to the ascenders’ height relating to a body size of 1:
				// you may need to adjust this value depending on the typeface you use
				// To deactivate the baseline alignment, enter a value of 1.

			return Delta;
		}
	}
	
}(jQuery));
