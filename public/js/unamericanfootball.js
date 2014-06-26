(function () {
    var radius = 10,
        dx = 0,
        dy = 0,
        scoreLeft = 0,
        scoreRight = 0;

    var canvas = null,
        ctx = null,
        imgBall = new Image();

    var ball = {
      x: 50,
      y: 0
    };

    var goalLeft = {
        x: 0,
        y: 0,
        width: 50,
        height: 100,
        color: '#F5F5F5'
    };

    var goalRight = {
        x: 0,
        y: 0,
        width: 50,
        height: 100,
        color: '#F5F5F5'
    };

    var lblScoreRight = null,
        lblScoreLeft = null;

    $(function () {
        canvas = document.getElementById('cvsGame');
        ctx = canvas.getContext('2d');

        // initial positions
        centerBall();
        goalLeft.y = (canvas.height/2) - (goalLeft.height/2);
        goalRight.y = (canvas.height/2) - (goalRight.height/2);
        goalRight.x = canvas.width - goalRight.width;


        // load the ball image
        imgBall.onload = function(){
            // TODO: START ANIMATION THREAD HERE
            animationLoop();
        };
        imgBall.src = '/images/ball_small.png';

        lblScoreRight = $('#scoreRight');
        lblScoreLeft = $('#scoreLeft');
        lblScoreLeft.text(scoreLeft);
        lblScoreRight.text(scoreRight);

        /*if (TogetherJS.running) {
            TogetherJS.send({type: "syncBall", x: ball.x, y: ball.y });
        }*/

        // click events
        $('#btnMessage').click(function () {
           alert('message: ' + $('#txtMessage').val());
        });
        $('#cvsGame').click(function (e) {
            var coordinate = _getMousePosAlt(canvas, e),
                x = coordinate.x,
                y = coordinate.y;


            if (TogetherJS.running) {
                TogetherJS.send({type: "updateBall", x: x, y: y, ballX: ball.x, ballY: ball.y });
            }
            handleClick(x, y);

        });


        TogetherJS.hub.on("updateBall", function (msg) {
            if (!msg.sameUrl) return;
            ball.x = msg.ballX;
            ball.y = msg.ballY;
            handleClick(msg.x, msg.y);
        });

        TogetherJS.hub.on("syncBall", function (msg) {
            if (!msg.sameUrl) return;
            ball.x = msg.x;
            ball.y = msg.y;
        });

        TogetherJS.hub.on("syncScore", function (msg) {
            if (!msg.sameUrl) return;
            scoreLeft = msg.scoreLeft;
            scoreRight = msg.scoreRight;
        });

        /*setInterval(function () {
            if (TogetherJS.running) {
                TogetherJS.send({type: "syncBall", x: ball.x, y: ball.y });
            }
        }, 1000);*/
    });

    function animationLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgBall, ball.x, ball.y);
        drawGoals();
        updateBall();
        score();
        requestAnimationFrame(animationLoop);
    }

    function centerBall() {
        ball.x = (canvas.width/2) - radius;
        ball.y = (canvas.height/2) - radius;
    }

    function handleClick(x, y) {
        console.log('x: ' + x + ' y: ' + y);

        console.log('x: ' + x + ' y: ' + y);

        var ballCenterX = ball.x + radius,
            ballCenterY = ball.y + radius;

        var a = Math.abs(x - ballCenterX),
            b = Math.abs(y - ballCenterY),
            c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

        // check close enough
        if (c < (radius + 30)) {
            // update dx and dy
            dx = dx + _map(ballCenterX - x, -30, 30, -2.5, 2.5);
            dy = dy + _map(ballCenterY - y, -30, 30, -2.5, 2.5);
        }
    }

    function drawGoals () {
        ctx.strokeStyle = goalLeft.color;
        ctx.strokeRect(goalLeft.x, goalLeft.y, goalLeft.width, goalLeft.height);
        ctx.strokeStyle = goalRight.color;
        ctx.strokeRect(goalRight.x, goalRight.y, goalRight.width, goalRight.height);
    }

    function score() {
        if (ball.x < goalLeft.width && (ball.y > goalLeft.y && ball.y < (goalLeft.y + goalLeft.height))) {
            lblScoreLeft.text(++scoreLeft);
           centerBall();
        } else if (ball.x > (canvas.width - goalRight.width) && (ball.y > goalRight.y && ball.y < (goalRight.y + goalRight.height))){
            lblScoreRight.text(++scoreRight);
            centerBall();
        }
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
    function _getMousePos(canvas, x, y) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: x - rect.left,
            y: y - rect.top
        };
    }

    function _getMousePosAlt(canvas, e) {
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;


        return {
            x: x,
            y: y
        }
    }


    function _map (val, x1, x2, y1, y2) {
        return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
    }

})();