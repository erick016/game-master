(function () {
    "use strict";
    var BVTouchable = window.BVTouchable
        , Element = window.Element
        , Tangle = window.Tangle;
    Tangle.classes.CarouselText = {
        initialize: function (element, options, tangle, variable) {
            var carousel = this;
            carousel.values = (options.values !== undefined) ?
                options.values.split(" ") :
                ["locked"];

            element.onclick = function () {
                var value = tangle.getValue(variable);
                var key = carousel.values.indexOf(value);
                var next = (key + 1) % carousel.values.length;
                tangle.setValue(variable, carousel.values[next]);
            };
        }
    };
    Tangle.classes.DragText = {
        cursorDragClass: "TKCursorDragHorizontal",
        dragClass: "TKAdjustableNumberDown",

        initialize: function (element, options, tangle, variable) {
            this.element = element;
            this.values = this.getValues(options.values);

            this.tangle = tangle;
            this.variable = variable;

            this.initializeHover();
            this.initializeHelp();
            this.initializeDrag();
        },

        getValues: function (valuesData) {
            if (valuesData !== undefined && valuesData !== null) {
                return valuesData.split(" ");
            }

            return ["locked"];
        },

        hoverClass: "TKAdjustableNumberHover",

        initializeDrag: function () {
            this.isDragging = false;
            // ReSharper disable InconsistentNaming
            return new BVTouchable(this.element, this);
            // ReSharper restore InconsistentNaming
        },

        initializeHelp: function () {
            this.helpElement = (new Element("div", {
                "class": "TKAdjustableNumberHelp"
            })).inject(this.element, "top");
            this.helpElement.setStyle("display", "none");
            this.helpElement.set("text", "drag");
        },

        initializeHover: function () {
            var self = this;
            self.isHovering = false;
            this.element.addEvent("mouseenter", (function () {
                self.isHovering = true;
                this.updateRolloverEffects();
            }).bind(this));
            this.element.addEvent("mouseleave", (function () {
                self.isHovering = false;
                this.updateRolloverEffects();
            }).bind(this));
        },

        isActive: function () {
            return this.isDragging || this.isHovering;
        },

        touchDidGoDown: function () {
            this.valueAtMouseDown = this.tangle.getValue(this.variable);
            this.isDragging = true;
            this.updateRolloverEffects();
            this.updateStyle();
        },

        touchDidMove: function (touches) {
            var key = this.values.indexOf(this.valueAtMouseDown) + touches.translation.x / 10;
            key = (key.round()).limit(0, this.values.length - 1);
            var value = this.values[key];

            this.tangle.setValue(this.variable, value);
            this.updateHelp();
        },

        touchDidGoUp: function () {
            this.helpElement.setStyle("display", "none");
            this.isDragging = false;
            this.updateRolloverEffects();
            this.updateStyle();
        },

        updateCursor: function () {
            var body = document.getElement("body");
            if (this.isActive()) {
                body.addClass(this.cursorDragClass);
            } else {
                body.removeClass(this.cursorDragClass);
            }
        },

        updateHelp: function () {
            var size = this.element.getSize();
            var top = -size.y + 7;
            var left = Math.round(0.5 * (size.x - 20));
            var display = "none";
            if (this.isHovering) {
                display = "block";
            }

            this.helpElement.setStyles({
                left: left,
                top: top,
                display: display
            });
        },

        updateRolloverEffects: function () {
            this.updateStyle();
            this.updateCursor();
            this.updateHelp();
        },
        updateStyle: function () {
            if (this.isDragging) {
                this.element.addClass(this.dragClass);
            } else {
                this.element.removeClass(this.dragClass);
            }

            if (!this.isDragging && this.isActive()) {
                this.element.addClass(this.hoverClass);
            } else {
                this.element.removeClass(this.hoverClass);
            }
        }
    };
})();