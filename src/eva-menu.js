//TEMPLATE EvaMenu
function EvaMenu(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("EvaMenu");
    this.target;
    this.autoRender = true;

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);


    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

EvaMenu.prototype = {
    render: function () {
        var _this = this;
        console.log("Initializing");


//        var navgationHtml = '' +
//
//            '</div>' +
//            '</div>' +
//            '';

        $(this.target).click(function (e) {
            if ($(e.target).prop("tagName") == 'A') {
                _this._optionClickHandler(e.target);
            }
        });

        //HTML skel
        this.target
    },
    draw: function () {
    },
    _optionClickHandler: function (aEl) {
        $(this.target).find('.active').removeClass('active');
        $(aEl).parent().addClass('active');
        this.trigger('menu:click', {option: $(aEl).text(), sender: this})
    },
    select: function (optionName) {
        var aEl = this.target.querySelector('a[href="#' + optionName + '"]')
        this._optionClickHandler(aEl);
    }
}