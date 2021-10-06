(() => {
    let yOffset = 0;
    let prevScrollHeight = 0; //이전 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된 씬
    let enterNewScene = false; // 새로운 씬 시작 여부 판단

    const sceneInfo = [{
            ////////////////////////   00000000   ////////////////////////
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                box0: document.querySelector('#big-box-0'),
            },
            values: {
                box0_translateY_in: [0, 100, {start: 0.07,end: 0.27}],
                box0_translateX_in: [0, 35, {start: 0.27,end: 0.39}],
                box0_translateY_out: [0, 100, {start: 0.39,end: 0.59}],
                box0_rotateZ_in: [0,360, {start: 0.27,end:0.39}],
            }
        },
        {
            ////////////////////////   11111111   ////////////////////////
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            ////////////////////////   22222222   ////////////////////////
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            ////////////////////////   33333333   ////////////////////////
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        },
        {
            ////////////////////////   44444444   ////////////////////////
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-4')
            }
        },
        {
            ////////////////////////   55555555   ////////////////////////
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-5')
            }
        }
    ];

    function calcValuesRatio(values, currentYOffset) {
        //currentYOffset = 현재씬에서 얼마나 스크롤 됬는지
		let rv; //리턴값이 있어야 다른곳에서 사용가능
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
                //console.log(scrollRatio); //  <- start지점 판독기로 쓰셈
		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
    }
    // function calcValuesPixel(values, currentYOffset) {
    //     //currentYOffset = 현재씬에서 얼마나 스크롤 됬는지
    //     let rv; //return 해줄값이 있어야 다른곳에서 쓸수 있음
    //     let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    //     let conversionYOffset = 다시 그위치의 픽셀로 변환...? 어케해야하지 머리가 띵해

    //     return rv;
    // }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs; 
        const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                let box0_translateY_in = calcValuesRatio(values.box0_translateY_in, currentYOffset);
                let box0_translateX_in = calcValuesRatio(values.box0_translateX_in, currentYOffset);
                let box0_translateY_out = calcValuesRatio(values.box0_translateY_out, currentYOffset);
                let box0_rotateZ_in = calcValuesRatio(values.box0_rotateZ_in, currentYOffset);
                if (scrollRatio <= 0.39) {
                    objs.box0.style.transform = `translate3d(${box0_translateX_in}vw,${box0_translateY_in}vh,0) rotateZ(${box0_rotateZ_in}deg)`
                }
                if (scrollRatio >= 0.39) {
                    objs.box0.style.transform = `translate3d(35vw,${100+box0_translateY_out}vh,0) rotateZ(${box0_rotateZ_in}deg)`
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
            // 현재위치까지의 총 스크롤 섹션의 높이 세팅 - 새로고침시 currentScene 재반영을 위해
            yOffset = window.pageYOffset;

            let totalScrollHeight = 0;
            for (let i = 0; i < sceneInfo.length; i++) {
                totalScrollHeight += sceneInfo[i].scrollHeight;
                if (totalScrollHeight >= yOffset) {
                    currentScene = i;
                    break;
                }
            }
        }
    }

    function scrollLoop() {
        // prevScrollHeight 세팅
        enterNewScene = false;
        prevScrollHeight = 0
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        //currentScene 결정
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = false;
            currentScene++;
        }
        if (yOffset < prevScrollHeight) {
            enterNewScene = false;
            if (currentScene === 0) return; // 애플 바운스 효과로 인한 오류 방지
            currentScene--;
        }
        // body에 currentScene id 지정
        document.body.setAttribute('id', `show-scroll-section-${currentScene}`);
        
        if (enterNewScene) return;

        playAnimation();
    }


    window.addEventListener('resize', setLayout);
    window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();

    });


})();