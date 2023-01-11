enum Keys
{
    W_key = 87,
    S_key = 83,
    ARROW_UP = 38,
    ARROW_DOWN = 40
}
var Animnum:number;
class Game
{
    private gameCanvas;
    private gameContext;
    public static keysPressed: boolean[] = [];
    public static player_1_Score: number = 0;
    public static player_2_Score: number = 0;
    public static computerScore: number = 0;
    private player1_: Paddle
    private player2_: Paddle
    private computerP_ : ComputerPaddle;
    private ball_: Ball;
    private multiplayer_: boolean;
    constructor()
    {

        var paddleWidth:number = 20;
        var paddleHeight:number = 60;
        var ballSize:number = 10;
        var wallOffset:number = 20;
        this.multiplayer_ = false;

        this.gameCanvas = document.getElementById("pong");
        this.gameContext = this.gameCanvas.getContext("2d");
        this.gameContext.font = "30px Orbitron";

        window.addEventListener("keydown", function(e)
        {
            console.log("Key is pressed");
            Game.keysPressed[e.which] = true;
        });

        window.addEventListener("keyup", function(e)
        {
            console.log("Key is left ",e.which );
            Game.keysPressed[e.which] = false;
        });
        this.player1_ = new Paddle(paddleWidth, paddleHeight,
            wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2);
        // if(this.multiplayer_)
        // {
            // this.player1_ = new Paddle(paddleWidth, paddleHeight,
            //     wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2);
        // }else{
            this.computerP_ = new ComputerPaddle(paddleWidth, paddleHeight, 
                this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2);
        // }
        this.ball_ = new Ball(ballSize, ballSize,
            this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);
    }

    drawGame()
    {
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 7;
        this.gameContext.strokeRect(10, 10,
            this.gameCanvas.width - 20, this.gameCanvas.height - 20);
        
        for(var i = 0; i + 30 < this.gameCanvas.height; i += 30)
        {
            this.gameContext.fillStyle = "#fff";
            this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
        }

        this.gameContext.fillText(Game.player_1_Score, 280, 50);
        this.gameContext.fillText(Game.computerScore , 390, 50);
    }

    update()
    {
        
        this.player1_.update(this.gameCanvas);
        this.computerP_.update(this.ball_, this.gameCanvas);
        this.ball_.update(this.player1_, this.computerP_, this.gameCanvas);
    }
    
    draw()
    {
        this.gameContext.fillStyle = "#000";

        this.gameContext.fillRect(0,0, this.gameCanvas.width, this.gameCanvas.height); 
        this.drawGame();
        this.player1_.draw(this.gameContext);
        this.computerP_.draw(this.gameContext);
        this.ball_.draw(this.gameContext);
    }

    draw_ending_screen(val:boolean)
    {
        this.gameContext.fillStyle = "#000";

        this.gameContext.fillRect(0,0, this.gameCanvas.width, this.gameCanvas.height); 
        this.gameContext.fillStyle = "#fff";        
        if(val == true)
        {
            this.gameContext.fillText("You won son", 280, 50);
        }else{
            this.gameContext.fillText("Computer won son", 280, 50);
        }
        window.cancelAnimationFrame(Animnum);
    }
    Loop()
    {
        game.update();
        game.draw();
        if(Game.player_1_Score == 1)
        {
            game.draw_ending_screen(true);
        }else if(Game.computerScore == 5)
        {
            game.draw_ending_screen(false);
        }
        Animnum = requestAnimationFrame(game.Loop);
    }

}

class Instance
{
    width:number;
    height:number;
    x:number;
    y:number;
    xVel:number = 0;
    yVel:number = 0;
    constructor(w:number, h:number, x:number, y:number)
    {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
    }

    draw(context)
    {
        
        context.fillStyle = '#fff';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Paddle extends Instance
{
    private speed:number = 10;

    constructor(w:number, h:number, x:number, y:number)
    {
        super(w,h,x,y);
    }

    update(canvas)
    {
        if(Game.keysPressed[Keys.ARROW_UP] || Game.keysPressed[Keys.W_key])
        {
            this.yVel = -1;
            console.log("Paddle " + this.x + " " + this.height + " " + this.y + " " + this.width + " " + this.height);
            if(this.y <= 20)
            {
                this.yVel = 0;
            }
        }else if(Game.keysPressed[Keys.ARROW_DOWN] || Game.keysPressed[Keys.S_key])
        {
            this.yVel = 1;
            if(this.y + this.height >= canvas.height - 20)
            {
                
                this.yVel = 0;
            }
        }else{
            this.yVel = 0;
        }
        
        this.y += this.yVel * this.speed;
    }
}

class ComputerPaddle extends Instance
{
    private speed:number = 10;

    constructor(w:number,h:number,x:number,y:number){
        super(w,h,x,y);
    }
    
    update(ball:Ball, canvas){
        if(ball.y < this.y && ball.xVel == 1){
            this.yVel = -1;

            if(this.y <= 20){
                this.yVel = 0
            }
        }else if(ball.y > this.y + this.height && ball.xVel == 1)
        {
            this.yVel = 1;

            if(this.y + this.height >= canvas.height - 20){
                this.yVel = 0;
            }
        }else{
            this.yVel = 0;
        }
    
        this.y += this.yVel * this.speed;
    }
}

class Ball extends Instance
{
    private speed:number = 5;

    constructor(w:number,h:number,x:number,y:number){
        console.log("Ball constructor " + w + " " + h + " " + x + " " + y);
        super(w,h,x,y);
        var randomDir = Math.floor(Math.random() * 2) + 1;
        if(randomDir % 2)
        {
            this.xVel = 1;
        }else
        {
            this.xVel = -1;
        }
        this.yVel = 1;
    }
    
    update(player:Paddle, computer:ComputerPaddle, canvas){
        //Check if ball is still in the bounds and if it scored the goal
        if(this.y <= 10)
        {
            this.yVel = 1;
        }

        if(this.y + this.height >= canvas.height - 10)
        {
            this.yVel = -1;
        }

        if(this.x <= 0)
        {
            this.x = canvas.width / 2 - this.width / 2;
            Game.computerScore += 1;
        }

        if(this.x + this.width >= canvas.width)
        {
            this.x = canvas.width / 2 - this.width / 2;
            Game.player_1_Score += 1;
        }

        if(this.x <= player.x + player.width)
        {
            if(this.y >= player.y && this.y + this.height <= player.y + player.height)
            {
                this.xVel = 1;
            }
        }

        if(this.x + this.width >= computer.x)
        {
            if(this.y >= computer.y && this.y + this.height <= computer.y + computer.height)
            {
                this.xVel = -1;
            }
        }

        this.x += this.xVel * this.speed;
        this.y += this.yVel * this.speed;
    }
}

var game = new Game();
Animnum = requestAnimationFrame(game.Loop);