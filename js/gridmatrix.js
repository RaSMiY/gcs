/*/============================Блок лицензии============================================
Copyright (c) RaSMiY semenov@razum.top
This file is part of VitAndMin project.

    VitAndMin project is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    VitAndMin project is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with VitAndMin project.  If not, see <http://www.gnu.org/licenses/>.

  (Этот файл — часть проекта VitAndMin.

   Проект VitAndMin - свободная программа: вы можете перераспространять ее и/или
   изменять ее на условиях Стандартной общественной лицензии GNU в том виде,
   в каком она была опубликована Фондом свободного программного обеспечения;
   либо версии 3 лицензии, либо (по вашему выбору) любой более поздней
   версии.

   Программа VitAndMin распространяется в надежде, что она будет полезной,
   но БЕЗО ВСЯКИХ ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА
   или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ. Подробнее см. в Стандартной
   общественной лицензии GNU.

   Вы должны были получить копию Стандартной общественной лицензии GNU
   вместе с этой программой. Если это не так, см. <http://www.gnu.org/licenses/>.)
//=============================Конец блока Лицензии=====================================*/


//===============================Вспомогательные функции===============================
function getUniqueSelector(element) {
//определяем уникалный селектор выбранного элемента
	uniqueSelector='';
	par = element;
	while (par.parentNode.tagName!='HTML') {
		count=1;
		prev=par;
		while (prev.previousElementSibling!=null){
			count++;
			prev=prev.previousElementSibling;
		}
		uniqueSelector = '>:nth-child(' + count + ')'+uniqueSelector;
		par = par.parentNode;
	}
	uniqueSelector = 'body'+uniqueSelector;
	return uniqueSelector;
}

function ind(el) {
// возвращает индекс элемента  el в массиве  Vit_and_Mins
	for (vit=0; vit<Vit_and_Min.length; vit++)
		if (Vit_and_Min[vit].alias[1]==el) return vit;
}

function menu(cat) {
// Функция возвращает список продуктов в соответствующем меню
// на вход подаётся id соответствующего списка
	list=[];
	for (i=0; i<document.getElementById(cat).children.length; i++) 
		list.push(document.getElementById(cat).children[i].classList.item(0));
	return list;
}

function contains(list, el) {
// Возвращает число вхождений элемента el в массив list
	count=0;
	for (i in list) {
		if (list[i]==el) count++;
	}
	return count;
}

function checkCompatibility(cat) {
//В качестве входного аргумента указываем id завтрака, обеда или ужина.
//Функция раскрашивает элементы списка в соответствии с их взаимной совместимостью - красным подсвечивает
//конфликтующие, зелёным - блогоприятствующие друг другу и отсутствие цвета говорит о нейтральном влиянии
//друг на друга
	list=menu(cat);
//	console.log('функция checkCompatibility(); menu(cat)=', list);
	for (i=0; i<document.getElementById(cat).children.length; i++) {
		element=document.getElementById(cat).children[i];
		element.classList.remove('conflict', 'support', 'support-n-conflict');
		element.removeAttribute('support');
		element.removeAttribute('conflict');
		if (element.children[1].tagName=='BUTTON') {
			element.removeChild(element.children[1]);
			element.removeChild(element.children[0]);
		}
		else if (element.children[0].tagName=='BUTTON') {
			element.removeChild(element.children[0]);
		}

		if (name=document.getElementById(cat).children[i].classList.item(0)=='razum')
			continue; //проверка необходима на случай  присутствия отладочных элементов в списке

		for (j in list) {
			// для каждого элемента в меню строим списки конфликтов и поддержек
			name=document.getElementById(cat).children[i].classList.item(0); 
			
			if (Vit_and_Min[ind(name)].compatibility[list[j]]<0) {
				if (element.hasAttribute('conflict')) {
					element.setAttribute('conflict', element.getAttribute('conflict')+' '+list[j]);
//					console.log('conflict add', element.getAttribute('conflict'), list);
				}
				else {
					element.setAttribute("conflict", list[j]);
//					console.log('conflict new', element.getAttribute('conflict'), list);
				}
			}
			else {
				if (Vit_and_Min[ind(name)].compatibility[list[j]]>0) {
					if (element.hasAttribute('support')) {
						element.setAttribute('support', element.getAttribute('support')+' '+list[j]);
//						console.log('support add', element.getAttribute('support'), list);
					}
					else {
						element.setAttribute("support", list[j]);
//						console.log('support new', element.getAttribute('support'), list);
					}
				}
			}
		}

//	теперь, в зависимости от наличиствующих списков, назначаем класс, и, заодно, добавляем описание "что взаимодействует с чем и каким образом"
		if (element.hasAttribute("support")&&element.hasAttribute("conflict")) {
			element.classList.add('support-n-conflict');

			supportList=element.getAttribute('conflict').split(" ");
			ll='';
			for (l in supportList) {
				(l<supportList.length-1)?ll+=Vit_and_Min[ind(supportList[l])].alias[0]+', ':ll+=Vit_and_Min[ind(supportList[l])].alias[0];
			}
			element.innerHTML='<button class="conflict" data-toggle="popover" title="Усвоение элемента сдерживают" data-content="'+ll+'" data-placement="bottom">ослабл.</button>'+element.innerHTML;
			
			supportList=element.getAttribute('support').split(" ");
			ll='';
			for (l in supportList) {
				(l<supportList.length-1)?ll+=Vit_and_Min[ind(supportList[l])].alias[0]+', ':ll+=Vit_and_Min[ind(supportList[l])].alias[0];
			}
			element.innerHTML='<button class="support" data-toggle="popover" title="Усвоение элемента усиливают" data-content="'+ll+'" data-placement="bottom">усилен.</button>'+element.innerHTML;
		}
		else 
			if (element.hasAttribute("conflict")) {
				element.classList.add('conflict');
				supportList=element.getAttribute('conflict').split(" ");
//				console.log(element.getAttribute('conflict'), suportList);
				
				ll='';
				for (l in supportList) {
					(l<supportList.length-1)?ll+=Vit_and_Min[ind(supportList[l])].alias[0]+', ':ll+=Vit_and_Min[ind(supportList[l])].alias[0];
				}
				element.innerHTML='<button class="conflict" data-toggle="popover" title="Усвоение элемента сдерживают" data-content="'+ll+'" data-placement="bottom">ослабл.</button>'+element.innerHTML;
			}
			else 
				if (element.hasAttribute("support")) {
					element.classList.add('support');
					supportList=element.getAttribute('support').split(" ");
					ll='';
					for (l in supportList) {
						(l<supportList.length-1)?ll+=Vit_and_Min[ind(supportList[l])].alias[0]+', ':ll+=Vit_and_Min[ind(supportList[l])].alias[0];
					}
					element.innerHTML='<button class="support" data-toggle="popover" title="Усвоение элемента усиливают" data-content="'+ll+'" data-placement="bottom">усилен.</button>'+element.innerHTML;
				}
	}

	$('[data-toggle="popover"]').popover({trigger: "hover"});   
}
//===========================конец блока вспомогательных функций==========================


//=========================Наполнение карусели витаминов=================================
function fillVitAndMins() {
	vitandmins=document.getElementById('vitandmins');
	vitandmins.innerHTML='';
	for (vit=0; vit<Vit_and_Min.length; vit++) {
		elementV=document.createElement("li");

		elementV.innerHTML+='<img src="pictures/vitandmins/png/'+Vit_and_Min[vit].pict+'" alt="'+Vit_and_Min[vit].alias[0]+'" />';
		$(elementV).addClass(Vit_and_Min[vit].alias[1]);
		
		title='Источники: ';
		for (i in Vit_and_Min[vit].sources) {
			i!=Vit_and_Min[vit].sources.length-1?title+=Vit_and_Min[vit].sources[i]+', ':title+=Vit_and_Min[vit].sources[i];
		}
		$(elementV).children(':first-child').attr('title', title);
		p=document.createElement("p");
		$(p).html(Vit_and_Min[vit].alias[0]);
		elementV.appendChild(p);
		
		vitandmins.appendChild(elementV);
	}
//	console.log('calc('+$('.colmd11').css('height')+' - '+$('#vitandmins').prev().css('height')+' - '+$('.carousel-label>h4').css('margin-bottom')+' - 1rem - 2px)');
	$('#vitandmins').css('height',  'calc(' + $('.colmd11').css('height') + ' - ' + $('#vitandmins').prev().css('height') + ' - ' + $('#vitandmins').prev().css('margin-bottom') + ' - 1rem - 2px)');
//		$('#vitandmins').css('height',  'calc('+$('.colmd11').css('height')+' - '+$('#vitandmins').prev().css('height')+' - 0.1vh - 1rem - 2px)');
//		$('#vitandmins').css('height', $('.colmd11').css('height'));
//		$('.'+Vit_and_Min[vit].alias[1]).css('background-image', 'url("pictures/vitandmins/png/'+Vit_and_Min[vit].pict+'")');
}
//=========================Конец блока наполнения карусели витаминов=======================

//=============================Создание таблицы совместимости===========================
function fillTableOfComatibility() {
	elTable=document.createElement("table");

	compatibilityTable=document.getElementById('table-of-compatibility');
		elHeader=document.createElement("h3");
			elHeader.innerHTML='Таблица совместимости витаминов и минералов';
	compatibilityTable.appendChild(elHeader);

/*		elCaption=document.createElement("caption");
			elCaption.innerHTML='Таблица совместимости витаминов и минералов';
		elTable.appendChild(elCaption);*/

//	Создаём заглавную строку (названия столбцов)
		elTableHead=document.createElement("thead");
			elRow=document.createElement("tr");
				elCell=document.createElement("th"); //первая ячейка с координатами [0;0]
					elName=document.createElement("p");
						elName.innerHTML="Элементы";
				elCell.appendChild(elName);
			elRow.appendChild(elCell);
			for (vjt=0; vjt<Vit_and_Min.length; vjt++) {
				elCell=document.createElement("th");
					elName=document.createElement("p");
						elName.innerHTML+=Vit_and_Min[vjt].alias[0];
						elName.classList.toggle("vertical-text", true);
					elCell.appendChild(elName);
				elRow.appendChild(elCell);
			}

				elCell=document.createElement("th"); //ячейка с координатами [<последний столбец>;0]
					elName=document.createElement("p");
						elName.innerHTML="Элементы";
				elCell.appendChild(elName);
			elRow.appendChild(elCell);

		elTableHead.appendChild(elRow);
	elTable.appendChild(elTableHead);
//	конец блока создания заглавной строки

//	Создаём нижнюю строку названия столбцов (футтер)
		elTableFoot=document.createElement("tfoot");
			elRow=document.createElement("tr");
				elCell=document.createElement("th"); //ячейка с координатами [0;<последняя строка>]
					elName=document.createElement("p");
						elName.innerHTML="Элементы";
					elCell.appendChild(elName);
			elRow.appendChild(elCell);
			for (vjt=0; vjt<Vit_and_Min.length; vjt++) {
				elCell=document.createElement("th");
					elName=document.createElement("p");
						elName.innerHTML+=Vit_and_Min[vjt].alias[0];
						elName.classList.toggle("vertical-text", true);
					elCell.appendChild(elName);
				elRow.appendChild(elCell);
			}

				elCell=document.createElement("th"); //ячейка с координатами [<последний столбец>;<последняя строка>]
					elName=document.createElement("p");
						elName.innerHTML="Элементы";
				elCell.appendChild(elName);
			elRow.appendChild(elCell);

			elTableFoot.appendChild(elRow);
		elTable.appendChild(elTableFoot);
//	конец блока создания нижней строки названий

		elTableBody=document.createElement("tbody");
//	создаём и заполняем строки
		for (vit=0; vit<Vit_and_Min.length; vit++) {
			elRow=document.createElement("tr");
//	первая ячейка каждой строки содержит название элемента
				elCell=document.createElement("td");
					elName=document.createElement("p");
						elName.innerHTML+=Vit_and_Min[vit].alias[0];
					elCell.appendChild(elName);
				elRow.appendChild(elCell);
//	конец блока создания первой ячейки
				for (vjt=0; vjt<Vit_and_Min.length; vjt++) {
					elCell=document.createElement("td");
						elComp=document.createElement("p");
							elComp.innerHTML+=Vit_and_Min[vit].compatibility[Vit_and_Min[vjt].alias[1]];
							if (vit==vjt) {
								elCell.classList.toggle("self");
							} else if (Vit_and_Min[vit].compatibility[Vit_and_Min[vjt].alias[1]]>0) {
								elCell.classList.toggle("support");
							} else if (Vit_and_Min[vit].compatibility[Vit_and_Min[vjt].alias[1]]<0) {
								elCell.classList.toggle("conflict");
							}
						elCell.appendChild(elComp);
					elRow.appendChild(elCell);
				}
//	последняя ячейка каждой строки тоже содержит название элемента
				elCell=document.createElement("td");
					elName=document.createElement("p");
						elName.innerHTML+=Vit_and_Min[vit].alias[0];
					elCell.appendChild(elName);
				elRow.appendChild(elCell);
//	конец блока создания последней ячейки
			elTableBody.appendChild(elRow);
		}
//	конец блока создания строк
	
		elTable.appendChild(elTableBody);
//		elTable.classList.toggle('table');
//		elTable.classList.toggle('table-responsive');
//		elTable.classList.toggle('table-warning');
//		elTable.classList.toggle('table-striped');
//		elTable.classList.toggle('table-bordered');
		elTable.classList.toggle('table-hover');
	
	compatibilityTable.appendChild(elTable);
}
//=====================конец блока создания таблицы совместимости===========================

//==============следующий блок кода необходим из-за неправильной работы плагина fht-table===========
function setCompatibilityTableSize() {
// Определяем ширину окна 
//		$(window).width();
//	wWidth=String(document.body.clientWidth*0.96);
//		wHeight=String(document.body.clientHeight*0.92);
//	compatibilityTable.style.width=wWidth;
//	compatibilityTable.style.height=wHeight;
//		console.log('wWidth, wHeight =', wWidth, ",",  wHeight, '$(window).height() =', $(window).height(), "$('.colmd11').css('height') =", $('.colmd11').css('height'));

		
		setTimeout(function(){
//			$('.fht-table-wrapper').css('width', wWidth);
			$('.fht-table-wrapper, .fht-fixed-body').css('width', $('#table-of-compatibility').width());
//			$('.fht-table-wrapper').width($('#table-of-compatibility').width());
			if ($('.fht-table-init').height()>$(window).height()) {
				$('.fht-table-wrapper, .fht-fixed-column').css('height',  'calc(' + $(window).height() + 'px)');
				$('.fht-tbody').css('height', 'calc(' + $(window).height() + 'px - 2 * ' + $('th').height() + 'px)');
			} else {
				$('.fht-table-wrapper, .fht-fixed-column').css('height',  'calc(' + $('.fht-table-init').height() + 'px + ' + $('th').height() + 'px)');
				$('.fht-tbody').css('height', 'calc(' + $('.fht-table-init').height() + 'px - ' + $('th').height() + 'px)');
			}
//			$('.fht-fixed-column').css('height', $(window).height());
//			$('.fht-fixed-column .fht-tfoot').css('height', '5.6em');
			$('.fht-fixed-column .fht-tfoot').css('top', 'unset');
			$('.fht-fixed-column table tr td:first-child').css('background-color', 'rgba(255,187,64,1)');
//			$('.fht-tbody').css('height', 'calc(wHeight - 5.6em)');
//			$('.fht-tbody').css('z-index', 1); 
		}, 1000);
		
//		setTimeout(function(){$(".fht-fixed-body thead th p, .fht-fixed-body tfoot th p").css("height", "7em")}, 100);
//		$(".fht-fixed-body thead th p, .fht-fixed-body tfoot th p").css("height", "7em");
//		$("table tr td:first-child p, table tr td:last-child p").css("width", "7em");
//		setTimeout(function(){$(".fht-fixed-body thead th p, .fht-fixed-body tfoot th p").css("width", "1em")}, 100);
//	$('#table-of-compatibility table').fixedHeaderTable({ width: wWidth, height: wHeight, footer: true, cloneHeadToFoot: false, fixedColumn: true });
//	setTimeout(function(){$('#table-of-compatibility table').fixedHeaderTable({ footer: true, cloneHeadToFoot: false, fixedColumn: true })}, 2000);
}
//==============конец блока кода необходимого из-за неправильной работы плагина fht-table===========

//=========================Наполнение страницы=========================================
function fillContent() {
	description=document.getElementById('description');
//	description.innerHTML='<div class="progress"><div id="load-progress" class="progress-bar" role="progressbar" aria-valuenow="70"  aria-valuemin="0" aria-valuemax="100" style="width:0%">0% Complete</div></div>';
//	loadProgress=document.getElementById('load-progress');
	
	for (vit=0; vit<Vit_and_Min.length; vit++) {
		element=document.createElement("div");
		
		element.innerHTML+='<img src="pictures/vitandmins/png/'+Vit_and_Min[vit].pict+'" alt="'+Vit_and_Min[vit].alias[0]+'" />';
		
		element.innerHTML+='<h2>'+(vit+1)+'. '+Vit_and_Min[vit].alias[0]+'</h2><p></p>';
		
		element.lastChild.innerHTML+='<b>Другие названия: </b>'+Vit_and_Min[vit].alias[2];
		for (vjt=3; vjt<Vit_and_Min[vit].alias.length; vjt++) {
			element.lastChild.innerHTML+=', '+Vit_and_Min[vit].alias[vjt];
		};

		element.innerHTML+='<p><b>Источники: </b>'+Vit_and_Min[vit].sources[0]+'</p>';
		for (vjt=1; vjt<Vit_and_Min[vit].sources.length; vjt++) {
			element.lastChild.innerHTML+=', '+Vit_and_Min[vit].sources[vjt];
		};

		element.innerHTML+='<h4>Основные функции</h4><ul></ul>';
		for (vjt=0; vjt<Vit_and_Min[vit].appointments.length; vjt++) {
			element.lastChild.innerHTML+='<li>'+Vit_and_Min[vit].appointments[vjt]+'</li>';
		};
		
		element.innerHTML+='<h4>Симптомы нехватки</h4><ul></ul>';
		for (vjt=0; vjt<Vit_and_Min[vit].symptoms_of_lack.length; vjt++) {
			element.lastChild.innerHTML+='<li>'+Vit_and_Min[vit].symptoms_of_lack[vjt]+'</li>';
		};
		
		element.innerHTML+='<h4>Суточная потребность</h4>';
		
		if (typeof Vit_and_Min[vit].daily_need == 'object'){
			d_n=Object.keys(Vit_and_Min[vit].daily_need);
			element.innerHTML+='<ul></ul>';
			for (vjt in d_n) {
//				element.innerHTML+='<li>'++'</li>';
				element.lastChild.innerHTML+='<li>'+'<b>'+d_n[vjt]+': '+'</b>'+Vit_and_Min[vit].daily_need[d_n[vjt]]+'мг'+'</li>';
			}
		} else 
			element.innerHTML+='<ul><li>'+Vit_and_Min[vit].daily_need+'мг'+'</li></ul>';
		
		element.innerHTML+='<hr/>';

//		Добавляем рекламный блок через определённые промежутки
		if ((vit+1)%4==0&&(vit+1<Vit_and_Min.length)) 
			element.innerHTML+='<div id="advertisment'+(vit+1)/4+'" class="py-5 advertisment">'+
				'<div class="container-fluid">'+
					'<div class="row">'+
						'<div class="col-md-12">'+
							'<div class="card">'+
								'<div class="card-block">'+
									'<div>'+
										'<h3>Рекламное место сдаётся</h3>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<hr/>';
//		конец блока рекламного кода
								
		description.appendChild(element);
	}
}

//============================конец блока наполнения страницы=============================

//=============================функции показа/скрытия разделов============================
function showDescription() {
	if ($('#description').html()=='') {
//		$('#description').html('<p style="text-align: center;"><img src="pictures/Loading-circles-acs-rectangles.gif" style="float: unset;"/></p>');
		
//		setTimeout(fillContent(), 4000);
		fillContent();

//		$('#description>:first-child').remove();
	}

	$('#description').show();
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').hide(); 
	$('#kitchen').hide(); 
	$('#vk_comments').show();
	$('#vk_community_messages').hide();
	$('#information').hide();
	$('#advertisment-description').hide();
	$('#articles').hide();
}

function showCompatibilityTable() {
	if ($('#table-of-compatibility').html()=='') {
		fillTableOfComatibility();
		setTimeout(function(){
			$('#table-of-compatibility table').fixedHeaderTable({ footer: true, cloneHeadToFoot: false, fixedColumn: true })
		}, 100); // делаем таблицу интерактивной
		setCompatibilityTableSize(); // устанавливаем размеры тэгов .fht- (иначе таблица будет не видна)
	}
	$('#description').hide();  
	$('#table-of-compatibility').show(); 
	$('#for-smartphones').hide(); 
	$('#contact-us').hide();
	$('#kitchen').hide();
	$('#vk_comments').show();
	$('#vk_community_messages').hide();
	$('#information').hide();
	$('#advertisment-description').hide();
	$('#articles').hide();
}

function show4Smartphones() {
	$('#description').hide(); 
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').show(); 
	$('#contact-us').hide();
	$('#kitchen').hide();
	$('#vk_comments').hide();
	$('#vk_community_messages').show();
	$('#information').hide();
	$('#advertisment-description').hide();
	$('#articles').hide();
}

function showMainPage() {
	$('#description').hide(); 
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').hide(); 
	$('#contact-us').hide();
	$('#kitchen').show();
	$('#vk_comments').show();
	$('#vk_community_messages').hide();
	$('#information').hide();
	$('#advertisment-description').hide();
	$('#articles').hide();
}

function showContactUs() {
	$('#description').hide(); 
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').hide(); 
	$('#contact-us').show();
	$('#kitchen').hide();
	$('#vk_comments').hide();
	$('#vk_community_messages').hide();
	$('#information').hide();
	$('#advertisment-description').hide();
	$('#articles').hide();
}

function showInformation() {
	$('#description').hide(); 
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').hide(); 
	$('#contact-us').hide();
	$('#kitchen').hide();
	$('#vk_comments').hide();
	$('#vk_community_messages').show();
	$('#information').show();
	$('#advertisment-description').hide();
	$('#articles').hide();
}

function showADdescription() {
	$('#description').hide(); 
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').hide(); 
	$('#contact-us').hide();
	$('#kitchen').hide();
	$('#vk_comments').hide();
	$('#vk_community_messages').show();
	$('#information').hide();
	$('#advertisment-description').show();
	$('#articles').hide();
	
//	$('.advertisment').hide();
//	setTimeout(function() {$('.advertisment').show()}, 300000);
}

function showArticles() {
	$('#description').hide(); 
	$('#table-of-compatibility').hide(); 
	$('#for-smartphones').hide(); 
	$('#contact-us').hide();
	$('#kitchen').hide();
	$('#vk_comments').hide();
	$('#vk_community_messages').hide();
	$('#information').hide();
	$('#advertisment-description').hide();
	$('#articles').show();
	if ($('#vk_groups').data('turnedOff')) {
		VK.Widgets.Group("vk_groups", {mode: 4, wide: 0, width: "auto", height: "1200"}, 155167160);
		$('#vk_groups').data('turnedOff', 0);
	}
}
//=======================конец блока функций показа/скрытия разделов========================

//==================================Пусковая функция===================================
function init() {
	
	$("#craftsplace").on("click", ".rem", function() {
		this.parentNode.parentNode.removeChild(this.parentNode);
	});
	
	
		drake = dragula([document.getElementById('1st-list'), document.getElementById('2nd-list'), document.getElementById('left-polygon'), document.getElementById('right-polygon')], {
   	   	   moves: function (el, container, handle) {
       	   	   return handle.classList.contains('handle');
     	 	 },
 			copy: function (el, source) {
				return (source === document.getElementById('1st-list'))||(source === document.getElementById('2nd-list'));
			},
			accepts: function (el, target) {
				return (target !== document.getElementById('1st-list'))&&(target !== document.getElementById('2nd-list'));
			},
			removeOnSpill: true,
			ignoreInputTextSelection: true,
			direction: 'horizontal',
			mirrorContainer: document.getElementById('mirrorContainer')
		}).on('drop', function(el, target, source, sibling) {
			})
			.on('remove', function(el, container, source) {
			})
			.on('drag', function(el, source) {
			    $(window).data('scroll', {top: $(window).scrollTop(), left: $(window).scrollLeft()});
			    $(window).scroll(function(){
			     $(window).scrollTop($(window).data('scroll').top).scrollLeft($(window).data('scroll').left);
			    });    
 			}) //попытка заблокировать прокрутку во время перетаскиваний
			.on('dragend', function(el) {
			    $(window).off('scroll'); 
			    $(window).removeData('scroll');
			 });
}

//onload = function() {
//	init();
//}
//===============================Конец пусковой функции================================
