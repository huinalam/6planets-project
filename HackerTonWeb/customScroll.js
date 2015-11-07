// Function  : CustomMovingScroll
// Parameter : 스크롤할 총 개수
// Description : 
// 스크롤할 페이지를 설정한다.
// scroll0 ~ [idxCountPara] 만큼 스크롤 선택 가능
// <div id="target0"></div> 코드를 숫자별로 입력해주어야함
// Example : 
//<a href="#target1" class="scroll" id="scroll1">Scroll to target</a>
//<a href="#target2" class="scroll" id="scroll2">Scroll to target</a>
//<div id="target1"></div>
//<div id="target2"></div>
// Author : huinalam
function CustomMovingScroll(idxCountPara) {
    // 인덱스 개수
    var idxCount = idxCountPara;
    var idx = 0;

    // ===========================================

    function addHandler(element, method, normal, oldIE, firefox) {
        if (element.addEventListener) {
            element.addEventListener(normal, method, false); //IE9, Chrome, Safari, Oper
            if (typeof firefox !== 'undefined') {
                element.addEventListener(firefox, method, false); //Firefox
            }
        } else {
            element.attachEvent(oldIE, method);  //IE 6/7/8
        }
    }

    function idxUp() {
        if (idx < idxCount) {
            idx++;
            $("#scroll" + idx).click();
        }
    }
    function idxDown() {
        if (idx > 0) {
            idx--;
            $("#scroll" + idx).click();
        }
    }
    function idxMov(movIdx) {
        if (movIdx > 0 && movIdx < idxCount) {
            idx = movIdx;
            $("#scroll" + movIdx).click();
        }
    }

    document.onkeydown = function (e) {
        var activeElement = document.activeElement;
        var tagName = activeElement.tagName;

        e = window.event || e || e.originalEvent;
        var charCode = e.charCode || e.keyCode;

        console.log("ScrollLog : " + charCode + " " + tagName);
        var shiftPressed = e.shiftKey;
        onkeydown(shiftPressed, charCode);
    };

    // Mouse Wheel Event
    function MouseWheelHandler(e) {
        if (true) {
            // cross-browser wheel delta
            e = window.event || e || e.originalEvent;

            // 마우스의 스크롤 값을 분석한다
            var value = e.wheelDelta || -e.deltaY || -e.detail;
            var delta = Math.max(-1, Math.min(1, value));
            if (delta < 0) {
                idxUp();
            } else {
                idxDown();
            }

            console.log(idx);

            return false;
        }
    }

    // Key Event 
    function onkeydown(shiftPressed, charCode) {
        switch (charCode) {
            //up
            case 38:
            case 33:
                idxDown();
                break;

                //down
            case 32: //spacebar

            case 40:
            case 34:
                idxUp();
                break;

                //Home
            case 36:
                idxMov(0);
                break;

                //End
            case 35:
                idxMov(idxCount);
                break;

                //left
            case 37:
                idxDown();
                break;

                //right
            case 39:
                idxUp();
                break;

            default:
                return; // exit this handler for other keys
        }
    }


    // 여러 브라우저의 event가 다르므로, 각각 설정함
    function addMouseWheelHandler() {
        addHandler(window, MouseWheelHandler, 'mousewheel', 'onmousewheel', 'wheel');
    }
    addMouseWheelHandler();
}

// 일단 주석처리
//$(".scroll").click(function (event) {
//    event.preventDefault();
//    $('html,body').animate({ scrollTop: $(this.hash).offset().top }, 500);
//});