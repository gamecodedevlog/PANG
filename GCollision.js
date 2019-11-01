class GCollision {
    constructor(){}

    //사각 충돌
    hitRectangle(rect1, rect2) {
        return rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y;
      }
      
    //원형 충돌
    hitCircle(circle1, circle2) { 
        // 원의 중심 좌표로부터 벡터 x, y 계산 
        var vx = circle1.centerX() - circle2.centerX(); var vy = circle1.centerY() - circle2.centerY(); 
        // 원 사이의 거리 
        var d = Math.sqrt(vx * vx + vy * vy); 
        // 반지름의 합 
        var totalRadii = circle1.halfWidth() + circle2.halfWidth(); 
        // 충돌 검사 
        var hit = magnitude <= totalRadii; 
        return hit; 
    }
    
    //사각 충돌 위치
    hitRectangleSide(rect1, rect2) { 
        // 충돌 위치 
        var collisionSide = "none"; 
        // 사각형의 중심으로부터 벡터 x, y 계산 
        var vx = rect1.centerX() - rect2.centerX(); 
        var vy = rect1.centerY() - rect2.centerY(); 
        // 사각형 반넓이, 반높이의 합 
        var combinedHalfWidth = rect1.halfWidth() + rect2.halfWidth(); var combinedHalfHeight = rect1.halfHeight() + rect2.halfHeight(); 
        // 충돌 감지 
        if( Math.abs(vx) < combinedHalfWidth || Math.abs(vy) < combinedHalfHeight ) { 
            // 충돌 ! // 충돌위치를 구하는 로직 // 겹친 넓이, 높이 
            var overlapX = combinedHalfWidth - Math.abs(vx); var overlapY = combinedHalfHeight - Math.abs(vy); 
            if( overlapX >= overlapY ) { 
                // x축에서 충돌 발생 
                collisionSide = vy > 0 ? 'top' : 'bottom'; 
            } else { 
                // y축에서 충돌 발생 
                collisionSide = vx > 0 ? 'left' : 'right'; 
            } 
        } return collisionSide; 
    }
}