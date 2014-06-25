(function () {
    var radius = 10,
        dx = 0,
        dy = 0;

    var canvas = null,
        ctx = null,
        imgBall = new Image();

    var ball = {
      x: 50,
      y: 0
    };

    $(function () {
        canvas = document.getElementById('cvsGame');
        ctx = canvas.getContext('2d');

        ball.x = (canvas.width/2) - radius;
        ball.y = (canvas.height/2) - radius;

        // load the ball image
        imgBall.onload = function(){
            // TODO: START ANIMATION THREAD HERE
            animationLoop();
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

            if (c < (radius + 30)) {
                dx = dx + _map(ballCenterX - x, -30, 30, -2.5, 2.5);
                dy = dy + _map(ballCenterY - y, -30, 30, -2.5, 2.5);
                //ball.x += 40;
                ctx.drawImage(imgBall, ball.x, ball.y); // Or at whatever offset you like
            }
        });
    });

    function animationLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgBall, ball.x, ball.y);
        updateBall();
        requestAnimationFrame(animationLoop);
    }

    function updateBall() {
        ball.x += dx;
        ball.y += dy;

        // slow your role
        if (dx > 0) {
            dx -= 0.05;
            if (dx < 0) dx = 0;
        } else if (dx < 0) {
            dx += 0.05;
            if (dx > 0) dx = 0;
        }

        if (dy > 0) {
            dy -= 0.05;
            if (dy < 0) dy = 0;
        } else if (dy < 0) {
            dy += 0.05
            if (dy > 0) dy = 0;
        }

        dx = Math.round(dx * 100) / 100;
        dy = Math.round(dy * 100) / 100;

        // check bounds
        if (ball.x <= 0) {
            ball.x = 0.5;
        } else if (ball.x + radius >= canvas.width) {
            ball.x = canvas.width - radius - 0.5;
        }

        if (ball.y <= 0) {
            ball.y = 0.5;
        } else if (ball.y + radius >= canvas.height) {
            ball.y = canvas.height - radius - 0.5;
        }
    }

    // ---- Helpers ----
    function _getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function _map (val, x1, x2, y1, y2) {
        return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
    }

})();