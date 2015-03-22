/*** This Code is from https://github.com/SINTEF-9012/PruneCluster/blob/master/examples/realworld.50000-categories.html
*
*/

 colors = ['#66c2a5', '#fc8d62', '#8da0cb'],
 pi2 = Math.PI * 2;

var MarkerIcon = L.Icon.extend({
    options: {
        iconSize: new L.Point(44, 44)
    },
    createIcon: function () {
        // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
        if (L.Browser.retina) {
            e.width = s.x + s.x;
            e.height = s.y + s.y;
        } else {
            e.width = s.x;
            e.height = s.y;
        }
        // this.draw(e.getContext('2d'), s.x, s.y);
        this.draw(e.getContext('2d'), e.width, e.height);
        return e;
    },
    createShadow: function () {
        return null;
    },
    draw: function(canvas, width, height) {
        var xfactor = width / 44;
        var yfactor = height / 44;
        var factor = (xfactor + yfactor) / 2;
        var xa = 2 * xfactor, xb = 50 * xfactor, ya = 18 * yfactor, yb = 21* yfactor;
        var r = ya + (this.population - xa) * ((yb - ya) / (xb - xa));
        var radiusMarker = Math.min(r, 21 * factor),
        radiusCenter = 8 * factor,
        center = width / 2;
        if (L.Browser.retina) {
            canvas.scale(2, 2);
            center /= 2;
            canvas.lineWidth = 0.5;
        }
        canvas.strokeStyle = 'rgba(0,0,0,0.25)';
        var start = 0, stroke = true;
        for (var i = 0, l = colors.length; i < l; ++i) {
        	console.log();
            var size = this.stats[i] / this.population;
            if (size > 0) {
                stroke = size != 1;
                canvas.beginPath();
                canvas.moveTo(center, center);
                canvas.fillStyle = colors[i];
                var from = start + 0.14,
                to = start + size * pi2;
                if (to < from || size == 1) {
                    from = start;
                }
                canvas.arc(center, center, radiusMarker, from, to);
                start = start + size * pi2;
                canvas.lineTo(center, center);
                canvas.fill();
                if (stroke) {
                    canvas.stroke();
                }
                canvas.closePath();
            }
        }
        if (!stroke) {
            canvas.beginPath();
            canvas.arc(center, center, radiusMarker, 0, Math.PI * 2);
            canvas.stroke();
            canvas.closePath();
        }
        canvas.beginPath();
        canvas.fillStyle = this.options.middleColor;
        canvas.moveTo(center, center);
        canvas.arc(center, center, radiusCenter, 0, Math.PI * 2);
        canvas.fill();
        canvas.closePath();
        canvas.fillStyle = '#454545';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.font = 'bold '+(this.population < 100 ? '12' : (this.population < 10 ? '11' : '9'))+'px sans-serif';
        canvas.fillText(this.population, center, center, radiusCenter*2);
    }
});