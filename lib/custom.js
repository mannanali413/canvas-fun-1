(function(){
   function y() {
        var $body = $("body");
        function init() {
            $body.mousemove(function(event) {
                clientX = event.clientX;
                clientY = event.clientY;
                mouseMoveDate = Date.now();
                shouldFire || animateCanvas();
            });
            $(window).on("blur mouseout", function() {
                clientY = null;
                clientX = null;
            }).on("resize", function() {
                loginFunCanvas && loginFunCanvas.parentNode && loginFunCanvas.parentNode.removeChild(loginFunCanvas);
                initializeCanvas();
            });
            initializeCanvas()
        }
        function initializeCanvas() {
            var bodyWidth, bodyHeight;
            bodyWidth = $body.width();
            bodyHeight = $body.height();
            loginFunCanvas = document.createElement("canvas");
            loginFunCanvas.className = "loginFun";
            loginFunCanvas.width = bodyWidth;
            loginFunCanvas.height = bodyHeight;
            $body.append(loginFunCanvas);
            overlayCanvas = document.createElement("canvas");
            overlayCanvas.width = bodyWidth;
            overlayCanvas.height = bodyHeight;
            if (loginFunCanvas.getContext && loginFunCanvas.getContext("2d"))
            { 
                loginFunCanvasContext = loginFunCanvas.getContext("2d");
                overlayCanvasContext = overlayCanvas.getContext("2d");
                overlayCanvasContext.lineCap = "round";
                overlayCanvasContext.shadowColor = "#000000";
                overlayCanvasContext.shadowBlur = -1 < navigator.userAgent.indexOf("Firefox") ? 0 : 30;
                if(!backgroundImage) {
                    backgroundImage = new Image;
                    // if (!$body.css("background-image"))
                    //     throw Error("element must have a background image");
                    $(backgroundImage).one("load", animateCanvas);
                    $(backgroundImage).attr("src", "images/bg_tiles_color.use.jpg");
                }
            }
        }
        function animateCanvas() {
            var bodyScrollTop, currDate = Date.now();
            bodyScrollTop = $body.scrollTop();
            shouldFire = currDate > mouseMoveDate + 500 ? !1 : !0;
            if(clientX && shouldFire){
                currentPositions.unshift({
                    time: currDate,
                    x: clientX,
                    y: clientY + bodyScrollTop
                });
            }
            for (b = 0; b < currentPositions.length; )
                1E3 < currDate - currentPositions[b].time ? currentPositions.length = b : b++;

             if(0 < currentPositions.length){
                window.requestAnimationFrame(animateCanvas);
            }
            
            overlayCanvasContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            for (b = 1; b < currentPositions.length; b++) {
                var distance = Math.sqrt(Math.pow(currentPositions[b].x - currentPositions[b - 1].x, 2) + Math.pow(currentPositions[b].y - currentPositions[b - 1].y, 2));
                overlayCanvasContext.strokeStyle = "rgba(0,0,0," + Math.max(1 - (currDate - currentPositions[b].time) / 1E3, 0) + ")";
                overlayCanvasContext.lineWidth = 25 + 75 * Math.max(1 - distance / 50, 0);
                overlayCanvasContext.beginPath();
                overlayCanvasContext.moveTo(currentPositions[b - 1].x, currentPositions[b - 1].y);
                overlayCanvasContext.lineTo(currentPositions[b].x, currentPositions[b].y);
                overlayCanvasContext.stroke();
            }
            

            var tempWidth = loginFunCanvas.width;
            var tempHeight = loginFunCanvas.width / backgroundImage.naturalWidth * backgroundImage.naturalHeight;
            
            if(tempHeight < loginFunCanvas.height) {
                tempHeight = loginFunCanvas.height;
                tempWidth = loginFunCanvas.height / backgroundImage.naturalHeight * backgroundImage.naturalWidth;
            }
            /*
                ctx.drawImage(image, dx, dy, dWidth, dHeight) 
                dx - X-cordinate from the top-left corner in the destination canvas from where we begin to draw
                dy - Y-cordinate from the top-left corner in the destination canvas from where we begin to draw
                dWidth -  the Width to draw the image in the destination canvas
                dHeight - the Height to draw the image in the destination canvas
            */

            loginFunCanvasContext.drawImage(backgroundImage, 0, 0, tempWidth, tempHeight);

            /*
                Displays the destination image in to the source image. 
                Only the part of the destination image that is INSIDE the source image is shown, and the source image is transparent
            */
            loginFunCanvasContext.globalCompositeOperation = "destination-in";
            /*
                ctx.drawImage(image, dx, dy) -- X & Y co-ordinates in the destination canvas from which to start drawing the image
            */
            loginFunCanvasContext.drawImage(overlayCanvas, 0, 0);
            /*
                Displays the source image over the destination image
            */
            loginFunCanvasContext.globalCompositeOperation = "source-over";
        }
        var loginFunCanvas, overlayCanvas, loginFunCanvasContext, overlayCanvasContext, backgroundImage, clientX = null, clientY = null, currentPositions = [], mouseMoveDate = 0, shouldFire = !0;
        $(init);
    };
    $(function() {
        y()
    }); 
})();