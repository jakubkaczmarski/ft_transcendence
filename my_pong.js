var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Keys;
(function (Keys) {
    Keys[Keys["W_key"] = 87] = "W_key";
    Keys[Keys["S_key"] = 83] = "S_key";
    Keys[Keys["ARROW_UP"] = 38] = "ARROW_UP";
    Keys[Keys["ARROW_DOWN"] = 40] = "ARROW_DOWN";
})(Keys || (Keys = {}));
var Animnum;
var Game = /** @class */ (function () {
    function Game() {
        var paddleWidth = 20;
        var paddleHeight = 60;
        var ballSize = 10;
        var wallOffset = 20;
        this.multiplayer_ = false;
        this.gameCanvas = document.getElementById("pong");
        this.gameContext = this.gameCanvas.getContext("2d");
        this.gameContext.font = "30px Orbitron";
        window.addEventListener("keydown", function (e) {
            console.log("Key is pressed");
            Game.keysPressed[e.which] = true;
        });
        window.addEventListener("keyup", function (e) {
            console.log("Key is left ", e.which);
            Game.keysPressed[e.which] = false;
        });
        this.player1_ = new Paddle(paddleWidth, paddleHeight, wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2);
        // if(this.multiplayer_)
        // {
        // this.player1_ = new Paddle(paddleWidth, paddleHeight,
        //     wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2);
        // }else{
        this.computerP_ = new ComputerPaddle(paddleWidth, paddleHeight, this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2);
        // }
        this.ball_ = new Ball(ballSize, ballSize, this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);
    }
    Game.prototype.drawGame = function () {
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 7;
        this.gameContext.strokeRect(10, 10, this.gameCanvas.width - 20, this.gameCanvas.height - 20);
        for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
            this.gameContext.fillStyle = "#fff";
            this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
        }
        this.gameContext.fillText(Game.player_1_Score, 280, 50);
        this.gameContext.fillText(Game.computerScore, 390, 50);
    };
    Game.prototype.update = function () {
        this.player1_.update(this.gameCanvas);
        this.computerP_.update(this.ball_, this.gameCanvas);
        this.ball_.update(this.player1_, this.computerP_, this.gameCanvas);
    };
    Game.prototype.draw = function () {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawGame();
        this.player1_.draw(this.gameContext);
        this.computerP_.draw(this.gameContext);
        this.ball_.draw(this.gameContext);
    };
    Game.prototype.draw_ending_screen = function (val) {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.gameContext.fillStyle = "#fff";
        if (val == true) {
            this.gameContext.fillText("You won son", 280, 50);
        }
        else {
            this.gameContext.fillText("Computer won son", 280, 50);
        }
        window.cancelAnimationFrame(Animnum);
    };
    Game.prototype.Loop = function () {
        game.update();
        game.draw();
        if (Game.player_1_Score == 1) {
            game.draw_ending_screen(true);
        }
        else if (Game.computerScore == 5) {
            game.draw_ending_screen(false);
        }
        Animnum = requestAnimationFrame(game.Loop);
    };
    Game.keysPressed = [];
    Game.player_1_Score = 0;
    Game.player_2_Score = 0;
    Game.computerScore = 0;
    return Game;
}());
var Instance = /** @class */ (function () {
    function Instance(w, h, x, y) {
        this.xVel = 0;
        this.yVel = 0;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }
    Instance.prototype.draw = function (context) {
        context.fillStyle = '#fff';
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Instance;
}());
var Paddle = /** @class */ (function (_super) {
    __extends(Paddle, _super);
    function Paddle(w, h, x, y) {
        var _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 10;
        return _this;
    }
    Paddle.prototype.update = function (canvas) {
        if (Game.keysPressed[Keys.ARROW_UP] || Game.keysPressed[Keys.W_key]) {
            this.yVel = -1;
            console.log("Paddle " + this.x + " " + this.height + " " + this.y + " " + this.width + " " + this.height);
            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (Game.keysPressed[Keys.ARROW_DOWN] || Game.keysPressed[Keys.S_key]) {
            this.yVel = 1;
            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
    };
    return Paddle;
}(Instance));
var ComputerPaddle = /** @class */ (function (_super) {
    __extends(ComputerPaddle, _super);
    function ComputerPaddle(w, h, x, y) {
        var _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 10;
        return _this;
    }
    ComputerPaddle.prototype.update = function (ball, canvas) {
        if (ball.y < this.y && ball.xVel == 1) {
            this.yVel = -1;
            if (this.y <= 20) {
                this.yVel = 0;
            }
        }
        else if (ball.y > this.y + this.height && ball.xVel == 1) {
            this.yVel = 1;
            if (this.y + this.height >= canvas.height - 20) {
                this.yVel = 0;
            }
        }
        else {
            this.yVel = 0;
        }
        this.y += this.yVel * this.speed;
    };
    return ComputerPaddle;
}(Instance));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(w, h, x, y) {
        var _this = this;
        console.log("Ball constructor " + w + " " + h + " " + x + " " + y);
        _this = _super.call(this, w, h, x, y) || this;
        _this.speed = 5;
        var randomDir = Math.floor(Math.random() * 2) + 1;
        if (randomDir % 2) {
            _this.xVel = 1;
        }
        else {
            _this.xVel = -1;
        }
        _this.yVel = 1;
        return _this;
    }
    Ball.prototype.update = function (player, computer, canvas) {
        //Check if ball is still in the bounds and if it scored the goal
        if (this.y <= 10) {
            this.yVel = 1;
        }
        if (this.y + this.height >= canvas.height - 10) {
            this.yVel = -1;
        }
        if (this.x <= 0) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.computerScore += 1;
        }
        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width / 2 - this.width / 2;
            Game.player_1_Score += 1;
        }
        if (this.x <= player.x + player.width) {
            if (this.y >= player.y && this.y + this.height <= player.y + player.height) {
                this.xVel = 1;
            }
        }
        if (this.x + this.width >= computer.x) {
            if (this.y >= computer.y && this.y + this.height <= computer.y + computer.height) {
                this.xVel = -1;
            }
        }
        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    };
    return Ball;
}(Instance));
var game = new Game();
Animnum = requestAnimationFrame(game.Loop);
