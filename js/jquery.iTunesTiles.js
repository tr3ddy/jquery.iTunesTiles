(function ($) {

    function getFirstTileNextRow(mainEle, currentTop) {
        var ele;
        mainEle.children().each(function () {
            if (!ele) {
                if ($(this).position().top > currentTop) {
                    ele = this;
                }
            }
        });
        return ele;
    }

    function rearrangeAll() {
        console.log(infoCount);
        if (selectedTile) {
            var ele;
            var currentTop = $(selectedTile).position().top;
            $('#' + settings.infoClass + (infoCount)).css('display', 'none');
            ele = getFirstTileNextRow(main, currentTop);
            if (ele) {
                $('#' + settings.infoClass + (infoCount)).insertBefore(ele);
            }
                //Insert at the end
            else {
                main.append($('#' + settings.infoClass + (infoCount)));
            }
            $('#' + settings.infoClass + (infoCount)).css('display', 'block');
        }
    }

    function closeInfo(infoCnt) {
        $('#' + settings.infoClass + infoCnt).queue(function () { settings.beforeInfoHide.call(this); jQuery.dequeue(this); }).css({ 'height': '0', 'opacity': '0' }).delay(settings.transitionDuration).queue(function () { $(this).remove(); });
    }

    var selectedTile;
    var main;
    var infoCount = 0;
    var settings;

    var methods = {
        init: function (options) {
            // Create some defaults, extending them with any options that were provided
            settings = $.extend({
                'tileClass': 'tile',
                'infoClass': 'info',
                'infoHeight': 'auto',
                'transitionDuration': 500,
                'overflow': 'hidden',
                'onInfoShow': function () { },
                'onTileClick': function () { },
                'beforeInfoHide': function () { }
            }, options);
            $('.' + settings.infoClass).css({ 'transition-duration': (settings.transitionDuration / 1000) + 's' });
            main = this;
            this.children('.' + settings.tileClass).click(function () {
                settings.onTileClick.call(this);
                if (selectedTile == this) {
                    closeInfo(infoCount);
					selectedTile = null;
                } else {
                    selectedTile = this;
                    var ele;
                    var currentTop = $(this).position().top;
                    var infoCopy;

                    //Find the first element on the next line
                    ele = getFirstTileNextRow(main, currentTop);
                    if (ele) {
                        //Insert before a tile
                        console.log($(ele).attr('class'));
                        if ($(ele).attr('class').indexOf(settings.infoClass) > -1) {
                            infoCopy = $(this).children('.' + settings.infoClass).clone().attr('id', settings.infoClass + ++infoCount).insertBefore(ele).css({ 'display': 'block', 'height': settings.infoHeight, 'opacity': '1' });
                            $('#' + settings.infoClass + (infoCount - 1)).queue(function () { settings.beforeInfoHide.call(this); jQuery.dequeue(this); }).remove();
                        } else {
                            infoCopy = $(this).children('.' + settings.infoClass).clone().attr('id', settings.infoClass + ++infoCount).insertBefore(ele).css('display', 'block');
                            setTimeout(function () {
                                infoCopy.css({ 'height': settings.infoHeight, 'opacity': '1' });
                            }, 1);
                            closeInfo(infoCount - 1);
                        }
                    }
                    else {
                        //Insert at the end
                        infoCopy = $(this).children('.' + settings.infoClass).clone().attr('id', settings.infoClass + ++infoCount).css('display', 'block');
                        main.append(infoCopy);
                        setTimeout(function () {
                            infoCopy.css({ 'height': settings.infoHeight, 'opacity': '1' });
                        }, 1);
                        closeInfo(infoCount - 1);
                    }
                    settings.onInfoShow.call(infoCopy[0]);
                }
            });
            //Rearrange tiles on resize
            $(window).resize(function () {
                rearrangeAll();
            });
            return this;
        },
        close: function () {
            closeInfo(infoCount);
            return this;
        },
        rearrange: function () {
            rearrangeAll();
            return this;
        }
    }
    $.fn.tiles = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);