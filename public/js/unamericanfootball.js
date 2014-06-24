(function () {
    var radius = 20;
    var canvas = null;
    var ball = {
      x: 50,
      y: 0
    };

    $(function () {
        canvas = document.getElementById('cvsGame');
        var ctx = canvas.getContext('2d');

        // load the ball image
        var imgBall = new Image;
        imgBall.onload = function(){
            // TODO: START ANIMATION THREAD HERE
            ctx.drawImage(imgBall, ball.x, ball.y); // Or at whatever offset you like
        };
        imgBall.src = '/images/ball_small.png';

        // click event
        $('#cvsGame').click(function (e) {
            var coordinate = _getMousePos(canvas, e),
                x = coordinate.x,
                y = coordinate.y;

            var ballCenterX = ball.x + radius,
                ballCenterY = ball.y + radius;

            var a = Math.abs(x - ballCenterX),
                b = Math.abs(y - ballCenterY),
                c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

            if (c < radius) {
                ball.x += 40;
                ctx.drawImage(imgBall, ball.x, ball.y); // Or at whatever offset you like
            }
        });
    });

    function _getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

})();