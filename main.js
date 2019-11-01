var _engine;
var _aniContainer;

var _bg_obj;
var _bg_data;
var _W;
var _H;

var _player_state;
var _player_idx;
window.onload = function(){
    _engine= new GEngine(OBJECT[ID.BG].BG_WIDTH,OBJECT[ID.BG].BG_HEIGTH);
    _engine.loadImageFile(function (index) { 
        if(_engine.getImageCount() == index + 1){
            initGame(); 
            initInput();
            loop();
        }else{
            //이미지 로딩중
        }
    });
    _aniContainer = new AnimateContainer();
    _engine.setScale(2);
    _aniContainer.setScale(2);
}

function initGame(){
    _bg_obj = OBJECT[ID.BG];
    _bg_data = _bg_obj.DATA;
    _W = _bg_obj.TILE_WIDTH;
    _H = _bg_obj.TILE_HEIGTH;

    _engine.getBufferContext().drawImage(IMAGE[ID.BG][2], 0, 0);
    //_engine.drawMap(_bg_data,IMAGE[ID.BG],_W,_H);

    _player_idx =_aniContainer.newAnimate(new Animate(ID.PLAYER,OBJECT[ID.PLAYER],STATE[ID.PLAYER].NEW,200,170,
        function(index){
            var player_state =_aniContainer.getAnimate(index);
            _aniContainer.setState(index,STATE[ID.PLAYER].NEW,player_state.x,player_state.y);
        },
        checkPlayerMove,
        function(indexA,indexB){
            if(_aniContainer.getAnimate(indexA).state != STATE[ID.PLAYER].DIE & _aniContainer.getAnimate(indexA).glint ==0){
                if(_aniContainer.getAnimate(indexB).id == ID.BALL1){
                    _aniContainer.setState(indexA,STATE[ID.PLAYER].DIE,_player_state.x,_player_state.y);
                    _aniContainer.setGlint(_player_idx,100);
                }
            }    
        }
    ));

    _player_state = _aniContainer.getAnimate(_player_idx);
    //getCircleXY(12,180,5);
}

function loop(){
    var start = new Date().getTime();
    _engine.draw();
    _aniContainer.nextFrame(_engine.getContext());

    if(_aniContainer.getCount(ID.BALL1) == 0)
    _aniContainer.newAnimate(new Animate(ID.BALL1,OBJECT[ID.BALL1],STATE[ID.BALL1].NEW_1,10,50,null,checkBallMove));

    var delay = new Date().getTime() - start ;
    _loopTimmer = setTimeout(this.loop, LOOP_TIME - delay);
}

function checkPlayerMove(index){
    var player_ani = _aniContainer.getAnimate(index);
    var player_idx_X = parseInt((player_ani.x /_W));
    var player_idx_Y = parseInt((player_ani.y /_H));
    
    if(_bg_data[player_idx_Y][player_idx_X] != 0)
    _aniContainer.setState(index,STATE[ID.PLAYER].NEW,player_ani.x+5,player_ani.y);
    else if(_bg_data[player_idx_Y][player_idx_X+2] != 0)
    _aniContainer.setState(index,STATE[ID.PLAYER].NEW,player_ani.x-5,player_ani.y);
}

function initInput(){
    window.addEventListener( 'keydown', function(e) {
        //log("e.keyCode: " + e.keyCode);
        switch (e.keyCode){
            case GEngine.KEY_LEFT:
                if(_aniContainer.getAnimate(_player_idx).state != STATE[ID.PLAYER].DIE)
                _aniContainer.setState(_player_idx,STATE[ID.PLAYER].LEFT,_player_state.x,_player_state.y);
            break;
            case GEngine.KEY_RIGHT:
                if(_aniContainer.getAnimate(_player_idx).state != STATE[ID.PLAYER].DIE)
                _aniContainer.setState(_player_idx,STATE[ID.PLAYER].RIGHT,_player_state.x,_player_state.y);
            break;
            case GEngine.KEY_DOWN:
            break;
            case GEngine.KEY_UP:
            break;
            case GEngine.KEY_SPACE:
                if(_aniContainer.getCount(ID.ARROW_1) == 0)arrowFire(ID.ARROW_1);
                else if(_aniContainer.getCount(ID.ARROW_2) == 0)arrowFire(ID.ARROW_2);
            break;
        }
        e.preventDefault();
    });
}

function collisionBall(index,fx_state,ball_state,x,y){
    _aniContainer.newAnimate(new Animate(ID.FX,OBJECT[ID.FX],fx_state,x,y,function (index){_aniContainer.deleteAnimate(index);}));
    _aniContainer.setState(index,ball_state,x,y);
    _aniContainer.newAnimate(new Animate(ID.BALL1,OBJECT[ID.BALL1],ball_state,x,y,null,checkBallMove));
}

function arrowFire(arr_id){
    _aniContainer.setState(_player_idx,STATE[ID.PLAYER].FIRE,_player_state.x,_player_state.y);
    _aniContainer.newAnimate(new Animate(arr_id,OBJECT[arr_id],STATE[arr_id].FIRE,_player_state.x+10,_player_state.y-50,
        function (index){
            var arr_state =_aniContainer.getAnimate(index);
            var idx_X = parseInt((arr_state.x /_W));
            var idx_Y = parseInt((arr_state.y /_H));
            if(_bg_data[idx_Y][idx_X] != 0){
                _aniContainer.deleteAnimate(index);
            }
        },
        null
        ,function (indexA,indexB){
            if(_aniContainer.getAnimate(indexB).id == ID.BALL1){
                var aniB =_aniContainer.getAnimate(indexB);
                if(isEmpty(aniB))return;
                aniB.reverseX = -1;
                switch (aniB.state) {
                    case STATE[ID.BALL1].NEW_1:
                    case STATE[ID.BALL1].MOVE_1:
                        collisionBall(indexB,STATE[ID.FX].BALL_2,STATE[ID.BALL1].NEW_2,aniB.x,aniB.y                       );
                        break;
                    case STATE[ID.BALL1].NEW_2:
                    case STATE[ID.BALL1].MOVE_2:
                        collisionBall(indexB,STATE[ID.FX].BALL_3,STATE[ID.BALL1].NEW_3,aniB.x,aniB.y);
                        break;
                    case STATE[ID.BALL1].NEW_3:
                    case STATE[ID.BALL1].MOVE_3:
                        collisionBall(indexB,STATE[ID.FX].BALL_4,STATE[ID.BALL1].NEW_4,aniB.x,aniB.y);
                        break;
                    case STATE[ID.BALL1].NEW_4:
                    case STATE[ID.BALL1].MOVE_4:
                        collisionBall(indexB,STATE[ID.FX].BALL_5,STATE[ID.BALL1].NEW_5,aniB.x,aniB.y);
                        break;
                    case STATE[ID.BALL1].NEW_5:
                    case STATE[ID.BALL1].MOVE_5:
                        _aniContainer.deleteAnimate(indexB);
                        _aniContainer.deleteAnimate(indexA);
                        break;     
                }
                _aniContainer.deleteAnimate(indexA);
            }
        }
    ));

    _aniContainer.newAnimate(new Animate(ID.FX,OBJECT[ID.FX],STATE[ID.FX].ARROW
        ,_player_state.x+5,_player_state.y-10
        ,function (index){
            _aniContainer.deleteAnimate(index);
        }
    ));
}

function checkBallMove(index){
    var ball_state = _aniContainer.getAnimate(index);
    var move_type;
    switch(ball_state.state){
        case STATE[ID.BALL1].MOVE_1:
        case STATE[ID.BALL1].MOVE_2:
        case STATE[ID.BALL1].MOVE_3:
        case STATE[ID.BALL1].MOVE_4:
        case STATE[ID.BALL1].MOVE_5:
            var ball_idx_Y = parseInt((ball_state.y /_H));
            if(ball_state.reverseX == 1){
                var ball_idx_X = parseInt(((ball_state.x + ball_state.w)/_W));
                if(_bg_data[ball_idx_Y][ball_idx_X+1] != 0)ball_state.reverseX = -1;
            }else{
                var ball_idx_X = parseInt((ball_state.x/_W));
                if(_bg_data[ball_idx_Y][ball_idx_X-1] != 0)ball_state.reverseX = 1;
            }
        break;
    }

    switch(ball_state.state){
        case STATE[ID.BALL1].NEW_1:move_type = STATE[ID.BALL1].MOVE_1;break;
        case STATE[ID.BALL1].NEW_2:move_type = STATE[ID.BALL1].MOVE_2;break;
        case STATE[ID.BALL1].NEW_3:move_type = STATE[ID.BALL1].MOVE_3;break;
        case STATE[ID.BALL1].NEW_4:move_type = STATE[ID.BALL1].MOVE_4;break;
        case STATE[ID.BALL1].NEW_5:move_type = STATE[ID.BALL1].MOVE_5;break;
    }

    switch(ball_state.state){
        case STATE[ID.BALL1].NEW_1:
        case STATE[ID.BALL1].NEW_2:
        case STATE[ID.BALL1].NEW_3:
        case STATE[ID.BALL1].NEW_4:
        case STATE[ID.BALL1].NEW_5:
            var ball_idx_X = parseInt((ball_state.x/_W));
            var ball_idx_Y = parseInt(((ball_state.y + ball_state.h) /_H));
            //if(ball_idx_Y > 20)ball_idx_Y-=1;
            if( _bg_data[ball_idx_Y][ball_idx_X] != 0)
            _aniContainer.setState(index,move_type,ball_state.x,ball_state.y);
        break;
    }
}