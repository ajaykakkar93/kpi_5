define(["qlik", "ng!$q", "css!./style.css", "css!./css/all.css"], function(qlik, $q) {
	// test
	'use strict';
	(function($) {
		$.fn.textfill = function(pointer) {
			//maxFontSize = parseInt(maxFontSize, 10);
			return this.each(function() {
				var ourText = $(pointer, this),
					parent = ourText.parent(),
					maxHeight = parent.height(),
					maxWidth = parent.width(),
					fontSize = parseInt(ourText.css("fontSize"), 10),
					multiplier = maxWidth / ourText.width(),
					newSize = (fontSize * (multiplier - 0.1) - 10);
				ourText.css("fontSize", newSize);
				console.log('------------------------------');
				console.log('Max Width', maxWidth, 'Max Height', maxHeight);
				console.log('Font size', fontSize);
				console.log('Text width', ourText.width());
				console.log('Multiplier: maxWidth/Text.width()', multiplier);
				console.log('New Size: (fontSize*(multiplier-0.1)', newSize);
				console.log('------------------------------');
			});
		};
	})(jQuery);
	var app = qlik.currApp();
	var getSheetList = function() {
		var defer = $q.defer();
		app.getAppObjectList(function(data) {
			var sheets = [];
			var sortedData = _.sortBy(data.qAppObjectList.qItems, function(item) {
				return item.qData.rank;
			});
			_.each(sortedData, function(item) {
				sheets.push({
					value: item.qInfo.qId,
					label: item.qMeta.title
				});
			});
			return defer.resolve(sheets);
		});
		return defer.promise;
	};
	// end
	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				measures: {
					uses: "measures",
					min: 1,
					max: 2,
					items: {
						headerlabel: {
							type: "string",
							ref: "qDef.headerlabel",
							label: "Header Label",
							//expression: "optional",
							component: "expression",
							defaultValue: ""
						},
						textcolor: {
							type: "string",
							ref: "qDef.textcolor",
							label: "Text Color",
							//expression: "optional",
							component: "expression",
							defaultValue: ""
						},
						fontsize: {
							type: "string",
							ref: "qDef.fontsize",
							label: "Font Size",
							//expression: "optional",
							component: "expression",
							defaultValue: ""
						},
						HeaderAlign: {
							type: "string",
							component: "dropdown",
							label: "Header Align",
							ref: "qDef.Alignation",
							options: [{
								value: "left",
								label: "Left"
							}, {
								value: "right",
								label: "Right"
							}, {
								value: "center",
								label: "Center"
							}],
							defaultValue: "left"
						}
						/*textcolor: {
							type: "string",
							ref: "qAttributeExpressions.0.qExpression",
							label: "Text Color",
							//expression: "optional",
							component: "expression",
							defaultValue: ""
						},
						*/
						// end 
					}
				},
				settings: {
					uses: "settings",
					items: {
						navtosheet: {
							label: 'Navigation',
							items: {
								sheetlst: {
									type: "string",
									component: "dropdown",
									label: "Select Sheet",
									ref: "gotosheet",
									options: function() {
										return getSheetList().then(function(items) {
											return items;
										});
									}
								},
								sheetname: {
									type: "string",
									ref: "sheetname",
									label: "Sheet Name",
									component: "expression",
									defaultValue: ""
								},
								NavigationAnimation: {
									type: "string",
									component: "dropdown",
									label: "Navigation Animation",
									ref: "Nav_Animation",
									options: [{
										value: "blind",
										label: "Blind"
									}, {
										value: "bounce",
										label: "Bounce"
									}, {
										value: "clip",
										label: "Clip"
									}, {
										value: "fade",
										label: "Fade"
									}, {
										value: "highlight",
										label: "Highlight"
									}, {
										value: "puff",
										label: "Puff"
									}, {
										value: "shake",
										label: "Shake"
									}],
									defaultValue: "shake"
								}
							}
						},
						iconcust: {
							label: 'Icon Coustomization',
							items: {
								bgontrack: {
									ref: "bgontrack",
									label: "Icon Background Color",
									/*	
										component: "color-picker",
										type: "object",
										dualOutput: true
									*/
									type: "string",
									component: "expression"
								},
								bgicon: {
									ref: "bgicon",
									label: "Icon Color",
									/*
										component: "color-picker",
										type: "object",
										dualOutput: true
									*/
									type: "string",
									component: "expression"
								},
								font: {
									type: "string",
									ref: "font",
									label: "Add Font(fa fa-user)",
									component: "expression",
									defaultValue: "fa fa-user"
								}
							}
						}
						// end
					}
				}
			}
		},
		support: {
			snapshot: true,
			export: true,
			exportData: true
		},
		paint: function($element, layout) {
			console.log(layout);
			var hycube = layout.qHyperCube.qMeasureInfo;
			var bgontrack = layout.bgontrack;
			var bgicon = layout.bgicon;
			var font = layout.font;
			// 1st mes
			var value1 = layout.qHyperCube.qGrandTotalRow["0"].qText;
			var Alignation1 = hycube["0"].Alignation;
			var textcolor1 = hycube["0"].textcolor;
			var fontsize1 = hycube["0"].fontsize;
			var basecolor1 = hycube["0"].coloring == '' || hycube["0"].coloring == null || hycube["0"].coloring == undefined ? textcolor1 : hycube["0"].coloring.baseColor.color;
			var headerlabel1 = hycube["0"].headerlabel;
			console.log("value1 is", value1, ",color1 is", basecolor1);
			// 2nd mes
			var value2 = layout.qHyperCube.qGrandTotalRow["1"].qText;
			var Alignation2 = hycube["1"].Alignation;
			var textcolor2 = hycube["1"].textcolor;
			var fontsize2 = hycube["1"].fontsize;
			var basecolor2 = hycube["1"].coloring == '' || hycube["1"].coloring == null || hycube["1"].coloring == undefined ? textcolor2 : hycube["1"].coloring.baseColor.color;
			var headerlabel2 = hycube["1"].headerlabel;
			console.log("value2 is", value2, ",color2 is", basecolor2);
			// main div container
			if ($('#kpi_cont_' + layout.qInfo.qId).length == 0) {
				$('<div/>', {
					id: 'kpi_cont_' + layout.qInfo.qId,
					title: layout.sheetname,
					class: 'stat-card'
				}).appendTo($element);
				// icon to container
				$('<div/>', {
					id: 'kpi_v1_' + layout.qInfo.qId,
					class: 'stat-icon right',
					append: '<span class="bg-ontrack"></span><i class=""></i>'
				}).appendTo($('#kpi_cont_' + layout.qInfo.qId));
				// text for container
				$('<div/>', {
					append: '<h3 style="text-align: ' + Alignation1 + ';" id="exp_header1' + layout.qInfo.qId + '"></h3>',
					style: 'width:90%; '
				}).appendTo($('#kpi_cont_' + layout.qInfo.qId));
				// value
				$('<h4/>', {
					class: 'stat-num reize_kpi',
					style: 'text-align:' + Alignation1 + '; ',
					append: '<span id="exp_val1' + layout.qInfo.qId + '" class="txt-ontrack"></span>'
				}).appendTo($('#kpi_cont_' + layout.qInfo.qId));
				// text for container
				$('<div/>', {
					class: 'subtext',
					style: 'text-align: ' + Alignation2 + ';',
					append: '<span id="exp_header2' + layout.qInfo.qId + '">percent occupied of</span> <strong id="exp_val2' + layout.qInfo.qId + '"></strong>'
				}).appendTo($('#kpi_cont_' + layout.qInfo.qId));
				/*
								// text for container for space
								$('<div/>', {
									class: 'subtext'
								}).appendTo($('#kpi_cont_'+layout.qInfo.qId));
				*/
				/*
				// Source for container
				$('<div/>', {
					class: 'source',
					append: '<i style="color:green; margin-right: 5px;" class="lui-icon lui-icon--triangle-top"></i>Source: <a href="#">Graydale Housing Authority</a>'
				}).appendTo($('#kpi_cont_' + layout.qInfo.qId));
				
				$('<div/>', {
					id: layout.qInfo.qId,
					class: 'some-class',
					title: 'now this div has a title!'
				}).appendTo($element);
				*/
			}
			// apply style
			$('#kpi_cont_' + layout.qInfo.qId).css("width", ($element.width() - 35) + "px");
			$('#kpi_cont_' + layout.qInfo.qId).css("height", ($element.height() - 35) + "px");
			// value1
			$('#exp_val1' + layout.qInfo.qId).css("color", basecolor1);
			$('#exp_val1' + layout.qInfo.qId).css("text-align", Alignation1);
			$('#exp_val1' + layout.qInfo.qId).parent().css("text-align", Alignation1);
			$('#exp_val1' + layout.qInfo.qId).empty().html(value1);
			$('#exp_header1' + layout.qInfo.qId).empty().html(headerlabel1);
			$('#exp_val1' + layout.qInfo.qId).css("font-size", fontsize1);
			// value2
			$('#exp_val2' + layout.qInfo.qId).css("color", basecolor2);
			$('#exp_val2' + layout.qInfo.qId).css("text-align", Alignation2);
			$('#exp_val2' + layout.qInfo.qId).parent().css("text-align", Alignation2);
			$('#exp_val2' + layout.qInfo.qId).empty().html(value2);
			$('#exp_header2' + layout.qInfo.qId).empty().html(headerlabel2);
			$('#exp_val2' + layout.qInfo.qId).css("font-size", fontsize2);
			// basic styling
			$('#kpi_cont_' + layout.qInfo.qId + ' .bg-ontrack').css("background-color", bgontrack);
			$('#kpi_cont_' + layout.qInfo.qId + ' i').css("color", bgicon);
			$('#kpi_cont_' + layout.qInfo.qId + ' i').removeAttr("class").addClass(font);
			// navigation
			if(!layout.gotosheet == '' || !layout.gotosheet == undefined){
			$element.click(function(){ 
				if ($('#overlay' + layout.qInfo.qId).length == 0) {
					$("#kpi_v1_" + layout.qInfo.qId).effect(layout.Nav_Animation, 1000, function() {
						// nav to sheet
						var result = qlik.navigation.getMode();
						if (result == 'analysis') {
							console.log('ANALYSIS', layout.gotosheet);
							qlik.navigation.gotoSheet(layout.gotosheet);
						};
					});
					// end
				}
				// end
			});
			}
			//$('#kpi_cont_'+layout.qInfo.qId).textfill('#exp_val'+layout.qInfo.qId);
			//needed for export
			return qlik.Promise.resolve();
		}
		/*,resize: function($element, layout) {*
			//$('#kpi_cont_'+layout.qInfo.qId).textfill('#exp_val'+layout.qInfo.qId);
		}*/
	};
});