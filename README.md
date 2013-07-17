Configurable FlyPie Menu
==============================
Try this pie-menu with flyout elements in your projects, it's easy to use and configure.

Usage
------------------------------
Just link jquery.flypie-menu.js on your html document and Use html structure like bellow:

```html
<aside>
	<ul>
		<li><a href="#"><span>Item</span></li>
		<li><a href="#"><span>Item</span></li>
		<li><a href="#"><span>Item</span></li>
		<li><a href="#"><span>Item</span></li>
		<li><a href="#"><span>Item</span></li>
		<li class="flypie">
			<a href="javascript:void(0);"></a>
		</li>
	</ul> 
</aside>
```

Javascript

	this.$('.flypie').flyPieMenu();



Settings
-----------------------

default
```html
"degreeStart":      0         the position of your first button in degree
"maxItems":        10         Space reserved for a certain amount of Items
"itemRad":         25         radius of the item objects
"orbitRad":       100         radius from button middle to the items
"buttonRad":       40         radius of the button object
"orientation": center         placement of the button inside its box.
"popup":         true         decide how links inside the items should be opened
"mode":     mouseover         on which event you want to trigger flyPieMenu
"direction": counterclockwise items go counter- or clockwise around the button
```
values

	"degreeStart": 0-359 
	"maxItems": 1+ 
	"itemRad": 1+ 
	"orbitRad": 1+ 
	"buttonRad": 1+ 
	"orientation": "top-left", "top-center", "top-right". "left", "center", "right", "bottom-left", "bottom-center", "bottom-right"
	"popup": true, false
	"mode": "mouseover", "click", "manual"
	"direction": "counterclockwise", "clockwise"
