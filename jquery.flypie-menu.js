//http://stefangabos.ro/jquery/jquery-plugin-boilerplate-revisited/
//http://learn.jquery.com/plugins/basic-plugin-creation/

(function($) {

    $.flypiemenu = function(element, options) {
        /*degrees start counting form the left horizontal line
         * maxItems defines how many spaces are reserved for items in the whole circle	
         * itemRad defines the radius of the share buttons.
         * orbitRad defines the distance from the middle of the main button to the share buttons
         * buttonRad defines the radius of the main button
         */
        var defaults = {
            "degreeStart": 0,
            "maxItems": 10,
            "itemRad": 25,
            "orbitRad": 100,
            "buttonRad": 40,
            "orientation": "center",
            "popup": true,
            "mode": "mouseover",
            "direction": "counterclockwise"
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            //old calculations [
            //plugin.itemoffset = parseInt(plugin.settings.orbitRad) - parseInt(plugin.settings.buttonRad)/2 + parseInt(plugin.settings.itemRad)/2 +3;   // centering the items
            //plugin.buttonoffset = parseInt(plugin.settings.orbitRad) - parseInt(plugin.settings.buttonRad) + parseInt(plugin.settings.itemRad)
            //plugin.itembox = parseInt(plugin.settings.orbitRad) + parseInt(plugin.settings.itemRad); // Outline of the whole box with button + items
            // ] old calculations			

            //calculate the center point
            plugin.center = {
                "x": plugin.settings.orbitRad + plugin.settings.itemRad,
                "y": plugin.settings.orbitRad + plugin.settings.itemRad
            };
            //centering the middle button
            plugin.buttonoffset = {
                "x": plugin.center.x - plugin.settings.buttonRad,
                "y": plugin.center.y - plugin.settings.buttonRad
            };
            //centering the items
            plugin.itemoffset = {
                "x": plugin.center.x - plugin.settings.itemRad,
                "y": plugin.center.y - plugin.settings.itemRad
            };
            //Outline of the whole box with button + items
            plugin.itembox = {
                "width": (plugin.settings.orbitRad + plugin.settings.itemRad) * 2,
                "height": (plugin.settings.orbitRad + plugin.settings.itemRad) * 2
            };
            //sets the orientation of the button depending on the settings in the function call.
            plugin.setorientation();

            //now position all items
            plugin.initCSS();


            var itms = $element.siblings('li'); //the sibling list elements of the button
            switch (plugin.settings.mode) {
                case "click":
                    $element.on('click', function() {
                        //console.log("open click");
                        plugin.open($(this), itms);
                    });
                    break;
                case "manual":
                    //the user controlls when to open and close
                    break;
                case "mouseover":
                default:
                    //mouseover as default
                    $element.mouseenter(function() {
                        //console.log("over");
                        plugin.open($(this), itms);
                    });
                    break;
            }

            if (plugin.settings.popup) {
                $(itms).find('a').click(function(e) {
                    e.preventDefault();
                    var link = $(this);

                    plugin.popup(link.attr('href'), link.data('width'), link.data('height'), link.data('title'));
                });
            }
        }

        //execute the open event
        plugin.open = function(context, elements) {
            //delayTime increment for each of the items
            var delay = 40,
                delayTime;
            elements.each(function(i) {
                var ele = $(this);
                var deg = (Math.PI / 180) * (parseInt(plugin.settings.degreeStart) + i * (360 / plugin.settings.maxItems)); //converting Degree for each button to Radiant

                delayTime = i * delay;
                //show the items with a delay difference (delayTime)
                window.setTimeout(function() {
                    //make the elements visible
                    ele.css("display", "block");
                    //need this mini-timeout, so the blocks will animate properly
                    window.setTimeout(function() {
                        //set the new coords
                        ele.css({
                            "top": plugin.gettop(deg) + plugin.itemoffset.y,
                            "left": plugin.getleft(deg) + plugin.itemoffset.x
                        });
                        //show them
                        ele.css({
                            "opacity": "1"
                        });
                    }, 1);
                }, delayTime);
            });

            var _elements = elements;
            switch (plugin.settings.mode) {
                case "click":
                    //may be not the beast solution if the user has his own click events registered on the element
                    context.off('click');
                    context.on('click', function() {
                        //console.log("close click");
                        plugin.close(_elements);

                        context.off('click');
                        context.on('click', function() {
                            //console.log("close click");
                            plugin.open(context, _elements);
                        });
                    });
                    break;
                case "manual":
                    //the user controlls when to open and close
                    break;
                case "mouseover":
                default:
                    //mouseover as default
                    context.parent().mouseleave(function() {
                        //console.log("leave");
                        plugin.close(_elements);
                    });
                    break;
            }
        }

        //execute the close event
        plugin.close = function(elements) {
            //Get reversed array of itms
            $($(elements).get().reverse()).each(function(i) {
                //delayTime increment for each of the items
                var delay = 40,
                    delayTime;

                var ele = $(this);
                delayTime = i * delay;

                window.setTimeout(function() {
                    //reset the coords
                    ele.css({
                        "top": plugin.itemoffset.y,
                        "left": plugin.itemoffset.x
                    });
                    //hide them
                    ele.css({
                        "opacity": "0"
                    });
                    //make the elements hidden after their animation
                    window.setTimeout(function() {
                        ele.css("display", "none")
                    }, 200);
                }, delayTime);
            });
            if (plugin.settings.mode == "click") {

            }
        }
        //show the popup window
        plugin.popup = function(url, width, height, title) {
            window.open(url, title, "status = 1, height = " + height + ", width = " + width + ", resizable = 0");
        }

        //initialize the CSS of the buttons with the chosen settings
        plugin.initCSS = function() {
            var container = $element.parent().parent().parent().css({
                "position": "relative"
            });
            var aside = container.find('aside').css({
                "position": "relative",
                "top": plugin.itembox.y + "px",
                "left": plugin.itembox.x + "px",
            });
            var ul = aside.find('ul').css({
                "position": "absolute",
                "height": plugin.itembox.height + "px",
                "width": plugin.itembox.width + "px",
                "list-style-type": "none",
                /*"padding": "0",*/
                //ALEX: ul needs an higher z-index so the mouseleave event works correctly
                "z-index": "100",
                "padding": "0",
                "margin": "0"
            });
            ul.find('li:last-child').css({
                "position": "absolute",
                "top": plugin.buttonoffset.y + "px",
                "left": plugin.buttonoffset.x + "px",
                "height": plugin.settings.buttonRad * 2,
                "width": plugin.settings.buttonRad * 2
            });
            var flyoutitms = ul.find('li').not(':last-child').css({
                "display": "block",
                "position": "absolute",
                "height": plugin.settings.itemRad * 2,
                "width": plugin.settings.itemRad * 2,
                "top": plugin.itemoffset.y,
                "left": plugin.itemoffset.x,
                "-webkit-transition": "all 250ms, display 0",
                "-moz-transition": "all 250ms, display 0",
                "-o-transition": "all 250ms, display 0",
                "-ms-transition": "all 250ms, display 0",
                "transition": "all 250ms, display 0",
                "opacity": "0"
            });
        }
        //getters + setters

        //get top variable for the items
        plugin.gettop = function(degree) {
            if ((degree % 360) > 180) {
                return -parseInt(plugin.settings.orbitRad * Math.sin(degree).toFixed(8)); //Math.sin/cos needs Radiant unit
            } else {
                return parseInt(plugin.settings.orbitRad * Math.sin(degree).toFixed(8)); //Math.sin/cos needs Radiant unit
            }
        }
        //gets the left value for the items. (depends on direction variable)
        plugin.getleft = function(degree) {
            if (plugin.settings.direction == "clockwise") {
                return plugin.leftvalue(degree, 1);
            } else { //plugin.settings.direction == "counterclockwise"
                return plugin.leftvalue(degree, - 1);
            }

        }
        //shorten the code in getleft
        plugin.leftvalue = function(degree, dir) {
            if ((degree % 360) < 90 || (degree % 360) > 270) {
                return (dir * parseInt(plugin.settings.orbitRad * Math.cos(degree).toFixed(8)));
            } else {
                return (dir * parseInt(plugin.settings.orbitRad * Math.cos(degree).toFixed(8)));
            }
        }
        //sets the orientation of the button depending on the settings in the function call.
        plugin.setorientation = function() {
            switch (plugin.settings.orientation) {
                case "top-left":
                    plugin.itembox.x = -plugin.buttonoffset.x;
                    plugin.itembox.y = -plugin.buttonoffset.y;
                    break;
                case "top-right":
                    plugin.itembox.x = plugin.buttonoffset.x;
                    plugin.itembox.y = -plugin.buttonoffset.y;
                    break;
                case "top-center":
                    plugin.itembox.x = "";
                    plugin.itembox.y = -plugin.buttonoffset.y;
                    break;
                case "left":
                    plugin.itembox.x = -plugin.buttonoffset.x;
                    plugin.itembox.y = "";
                    break;
                case "right":
                    plugin.itembox.x = plugin.buttonoffset.x;
                    plugin.itembox.y = "";
                    break;
                case "bottom-left":
                    plugin.itembox.x = -plugin.buttonoffset.x;
                    plugin.itembox.y = plugin.buttonoffset.y;
                    break;
                case "bottom-right":
                    plugin.itembox.x = plugin.buttonoffset.x;
                    plugin.itembox.y = plugin.buttonoffset.y;
                    break;
                case "bottom-center":
                    plugin.itembox.x = "";
                    plugin.itembox.y = plugin.buttonoffset.y;
                    break;
                case "center":
                default:
                    plugin.itembox.x = "";
                    plugin.itembox.y = "";
                    break;
            }

        }
        plugin.init();
    }


    $.fn.flypiemenu = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('flypiemenu')) {
                var plugin = new $.flypiemenu(this, options);
                $(this).data('flypiemenu', plugin);
            }
        });
    }

})(jQuery); 
