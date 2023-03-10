
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite
({
    position:
    {
        x: 0,
        y: 0
    },
    imageSrc: 'img/background.png'
})

const shop = new Sprite
({
    position:
    {
        x: 600,
        y: 128
    },
    imageSrc: 'img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter
({
    position:
    {
        x: 0,
        y: 0
    },
    velocity:
    {
        x: 0,
        y: 10
    },
    imageSrc: 'img/swordsman/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset:
    {
        x: 215,
        y: 157
    },
    sprites:
    {
        idle:
        {
            imageSrc: 'img/swordsman/Idle.png',
            framesMax: 8
        },
        run:
        {
            imageSrc: 'img/swordsman/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: 'img/swordsman/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: 'img/swordsman/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: 'img/swordsman/Attack1.png',
            framesMax: 6
        },
        takeHit:
        {
            imageSrc: 'img/swordsman/Take_Hit-white_silhouette.png',
            framesMax: 4
        },
        death:
        {
            imageSrc: 'img/swordsman/Death.png',
            framesMax: 6
        }
    },
    attackBox:
    {
        offset:
        {
            x: 100,
            y: 50
        },
        width: 165,
        height: 50
    }
});

const enemy = new Fighter
({
    position:
    {
        x: 400,
        y: 100
    },
    velocity:
    {
        x: 0,
        y: 0
    },
    color: 'blue',
    imageSrc: 'img/genji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset:
    {
        x: 215,
        y: 167
    },
    sprites:
    {
        idle:
        {
            imageSrc: 'img/genji/Idle.png',
            framesMax: 4
        },
        run:
        {
            imageSrc: 'img/genji/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: 'img/genji/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: 'img/genji/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: 'img/genji/Attack1.png',
            framesMax: 4
        },
        takeHit:
        {
            imageSrc: 'img/genji/Take_hit.png',
            framesMax: 3
        },
        death:
        {
            imageSrc: 'img/genji/Death.png',
            framesMax: 7
        }
    },
    attackBox:
    {
        offset:
        {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

console.log(player);

const keys =
{
    a:
    {
        pressed: false
    },
    d:
    {
        pressed: false
    },
    ArrowLeft:
    {
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    }
}

decreaseTimer();

function animate()
{
    window.requestAnimationFrame(animate);
    //console.log("Working...");
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Player movement
    if (keys.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if (keys.d.pressed & player.lastKey === 'd')
    {
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else
    {
        player.switchSprite('idle');
    }

    //Player Jumping
    if (player.velocity.y < 0)
    {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0)
    {
        player.switchSprite('fall');
    }

    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else
    {
        enemy.switchSprite('idle');
    }

    //Enemy Jumping
    if (enemy.velocity.y < 0)
    {
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0)
    {
        enemy.switchSprite('fall');
    }

    //Player Collision detection and enemy is hit
    if
    (
        rectangularCollision
        ({
            rectangle1: player,
            rectangle2: enemy
        })
        && player.isAttacking
        && player.framesCurrent === 4
    )
    {
        enemy.takeHit();
        player.isAttacking = false;

        //This code works for health but is more abrupt
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%';

        //This cleans up the health bar nicely
        gsap.to('#enemyHealth',
        {
            width: enemy.health + '%'
        });

        //console.log("Player hit enemy");
    }

    //Player misses attack
    if (player.isAttacking && player.framesCurrent === 4)
    {
        player.isAttacking = false;
    }

    //Enemy Collision detection and Player gets hit
    if
    (
        rectangularCollision
        ({
            rectangle1: enemy,
            rectangle2: player
        })
        && enemy.isAttacking
        && enemy.framesCurrent === 2)
    {
        player.takeHit();
        enemy.isAttacking = false;

        //This code works for health but is more abrupt
        //document.querySelector('#playerHealth').style.width = player.health + '%';

        //This cleans up the health bar nicely
        gsap.to('#playerHealth',
        {
            width: player.health + '%'
        });

        console.log("Enemy hit player");
    }

    //Player misses attack
    if (enemy.isAttacking && enemy.framesCurrent === 2)
    {
        enemy.isAttacking = false;
    }

    //Game Over based on health
    if (enemy.health <= 0 || player.health <= 0)
    {
        determineWinner({player, enemy, timerId});
    }
}

animate();

let playerCanJump = true;
let enemyCanJump = true;

window.addEventListener('keydown', (event) =>
{
    if (!player.dead)
    {
        switch (event.key)
        {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                if (playerCanJump)
                {
                    player.velocity.y = -15;
                    console.log("Player jumped.");
                    playerCanJump = false;
                    setTimeout(() =>
                    {
                        //Delaying the jump so it is only possible when the player is on the ground
                        playerCanJump = true;
                    }, 420);
                }
                else
                {
                    console.log("Player jump on cooldown.");
                }
                break;
            case ' ':
                player.attack();
                break;
        }
    }

    if (!enemy.dead)
    {
        switch (event.key)
        {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if (enemyCanJump)
                {
                    enemy.velocity.y = -15;
                    console.log("Enemy jumped.");
                    enemyCanJump = false;
                    setTimeout(() =>
                    {
                        //Delaying the jump so it is only possible when the enemy is on the ground
                        enemyCanJump = true;
                    }, 420);
                }
                else
                {
                    console.log("Enemy jump on cooldown.");
                }
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }

    //console.log(event.key);
})

window.addEventListener('keyup', (event) =>
{
    //Player keys
    switch (event.key)
    {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }

    //Enemy keys
    switch (event.key)
    {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }

    //console.log(event.key);
})
