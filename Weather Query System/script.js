//===========================回到顶部===========================
function toTop() {
    loop();
    var top,
        stop = false;

    function loop() {
        if (top < 1 || stop) {
            if (!stop) document.documentElement.scrollTop = 0;
            return;
        }
        top = document.documentElement.scrollTop;
        document.documentElement.scrollTop = top * 0.9;
        setTimeout(() => {
            loop();
        }, 15)
    }
    document.onscroll = function (e) {
        if (top < document.documentElement.scrollTop) {
            stop = true;
        }
    }
}

let topYe = document.querySelector('.top');
topYe.addEventListener('click', toTop);

//===========================创建反馈弹窗===========================
const toasts = document.getElementById('toasts');

const messages = [
    '查询成功',
    '输入有误，请重新输入'
];

const types = ['success', 'error'];

//输入正确
function createNotification1() {
    const notice = document.createElement('div');
    const noticePic = document.createElement('img');
    noticePic.src = './img/正确.png';
    noticePic.width = '45';
    notice.classList.add('toast')
    notice.classList.add(types[0]);
    notice.innerText = messages[0];
    notice.appendChild(noticePic);
    toasts.appendChild(notice);
    setTimeout(() => {
        notice.remove();
    }, 3000)
}

//输入错误
function createNotification2() {
    const notice = document.createElement('div');
    const noticePic = document.createElement('img');
    noticePic.src = './img/感叹号.png';
    noticePic.width = '40';
    notice.classList.add('toast')
    notice.classList.add(types[1]);
    notice.innerText = messages[1];
    notice.appendChild(noticePic);
    toasts.appendChild(notice)
    setTimeout(() => {
        notice.remove()
    }, 13000)
}

//===========================show box===========================
const boxes = document.querySelectorAll('.box')
window.addEventListener('scroll', checkBoxes)
checkBoxes()
function checkBoxes() {
    const triggerBottom = window.innerHeight / 20 * 19;

    boxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top

        if (boxTop < triggerBottom) {
            box.classList.add('show')
        } else {
            box.classList.remove('show')
        }
    })
}

//===========================打印title===========================
const textEl = document.querySelector('.tips');
const speedEl = 2.8;
const text = 'Weather Forecast System'
let idx = 1
let speed = 300 / speedEl;

(function writeText() {
    textEl.innerText = text.slice(0, idx);
    textEl.innerText = text.slice(0, idx++) + "_"
    setTimeout(writeText, speed);

    if (idx > text.length) {
        textEl.innerText = textEl.innerText.slice(0, -1);
    }
})();

//=============================获取数据============================
let searchAll = document.querySelector('.search'),
    nameAll = document.querySelector('.name'),
    inputCity = document.querySelector('.city-name-search'),
    btnSearch = document.querySelector('.btn-search'),
    information = document.querySelector('.weather-inform'),

    inf = document.querySelector('.inf'),
    date = document.querySelector('.date'),
    nowTem = document.querySelector('.now-tem'),
    weatherType = document.querySelector('.weather-type'),
    dayTem = document.querySelector('.day-tem'),
    nightTem = document.querySelector('.night-tem'),

    win = document.querySelector('.win'),
    winLevel = document.querySelector('.win-level'),
    winSpeed = document.querySelector('.win-speed'),

    air = document.querySelector('.air'),
    airNum = document.querySelector('.circle'),
    airLevel = document.querySelector('.air-level'),
    airTip = document.querySelector('.air-tip'),

    weekInf = document.querySelectorAll('.w-box > div > div'),

    liveLevel = document.querySelectorAll('.live > div > div'),

    cityName = '';

//===========================点击触发查询事件==========================
async function search() {
    //获取input内容
    cityName = inputCity.value;

    //正则判断是否输入为中文
    let han = /[\u4e00-\u9fa5]/;
    if (!han.test(cityName)) {
        //错误提示
        createNotification2();
    } else {
        //=====================请求城市ID============================
        const res = await fetch('https://geoapi.qweather.com/v2/city/lookup?location=' + cityName + '&key=796a5af8a496494aa4b5a30c62c5e767&range=cn'),
            data = await res.json();

        if (data.code != '200') {
            createNotification2();
        } else {
            createNotification1();
            inf.style.display = 'block';
            cityName = data.location[0].name;
            nameAll.innerHTML = '-' + cityName + '-';
            let cityNum = data['location'][0]['id'],
                cityLat = data['location'][0]['lat'],
                cityLon = data['location'][0]['lon'];

            //==========================搜索完成后自动跳转===========================
            function animateScroll(element, speed) {
                let rect = element.getBoundingClientRect();
                //获取元素相对窗口的top值，加上窗口本身的偏移
                let top = window.pageYOffset + rect.top;
                let currentTop = 0;
                let requestId;
                function step() {
                    currentTop += speed;
                    if (currentTop <= top) {
                        window.scrollTo(0, currentTop);
                        requestId = window.requestAnimationFrame(step);
                    } else {
                        window.cancelAnimationFrame(requestId);
                    }
                }
                window.requestAnimationFrame(step);
            }
            animateScroll(inf, 100);

            //===================请求获取天气数据======================
            //day
            const res1 = await fetch('https://v0.yiketianqi.com/free/day?appid=22453411&appsecret=qRhAtV09&cityid=' + cityNum + '&unescape=1'),
                data1 = await res1.json();

            //week
            const res2 = await fetch('https://www.yiketianqi.com/free/week?unescape=1&appid=22453411&appsecret=qRhAtV09&cityid=' + cityNum),
                data2 = await res2.json();

            //live
            const res3 = await fetch('https://devapi.qweather.com/v7/indices/1d?key=796a5af8a496494aa4b5a30c62c5e767&type=0&location=' + cityNum),
                data3 = await res3.json();

            //传入day天气数据
            date.innerHTML = data1.date + ' ' + data1.week + ' ' + data1.update_time + '更新';
            nowTem.innerHTML = data1.tem + '°';
            weatherType.innerHTML = data1.wea;
            dayTem.innerHTML = '日间均温：' + data1.tem_day + '°';
            nightTem.innerHTML = '夜间均温：' + data1.tem_night + '°';
            win.innerHTML = '风向：' + data1.win;
            winLevel.innerHTML = '风力：' + data1.win_speed;
            winSpeed.innerHTML = '风速：' + data1.win_meter;
            airNum.innerHTML = data1.air;

            //判断空气质量
            if (data1.air <= 50) {
                airLevel.innerHTML = '优';
                airTip.innerHTML = '无健康影响。';
                airNum.style.borderColor = 'green';
            } else if (data1.air <= 100) {
                airLevel.innerHTML = '良';
                airTip.innerHTML = '少数易敏感人群应减少户外运动。';
                airNum.style.borderColor = 'rgb(255, 228, 20)';
            } else {
                airLevel.innerHTML = '污染';
                airTip.innerHTML = '可能出现轻度刺激症状，呼吸或心脏系统薄弱人群应减少户外锻炼。';
                airNum.style.borderColor = 'red';
            }

            //传入week天气数据
            function weekUp() {
                for (let j = 0, i = 0; j <= 6, i <= 24; j++) {
                    this[i++].innerHTML = data2.data[j].date;
                    this[i++].innerHTML = data2.data[j].wea;
                    this[i++].innerHTML = data2.data[j].tem_day + '°';
                    this[i++].innerHTML = data2.data[j].tem_night + '°';
                    console.log(this);
                }
            }
            weekUp.call(weekInf);

            //传入live数据
            function liveUp() {
                console.log(this);
                for (let i = 0, j = 0; i <= 29, j <= 10; j++) {
                    this[i++].innerHTML = data3.daily[j].name + ':';
                    this[i++].innerHTML = data3.daily[j].level;
                    this[i++].innerHTML = 'Tip：' + data3.daily[j].text;
                }
            }
            liveUp.call(liveLevel);

            //判断天气图标
            switch (data1.wea_img) {
                case 'bingbao':
                    document.querySelector('.weather-logo').src = './img/bingbao.png';
                    information.style.backgroundImage = 'linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)';
                    break;
                case 'lei':
                    document.querySelector('.weather-logo').src = './img/lei.png';
                    information.style.backgroundImage = 'linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)';
                    break;
                case 'qing':
                    document.querySelector('.weather-logo').src = './img/qing.png';
                    information.style.backgroundImage = 'linear-gradient(to right, #fa709a 0%, #fee140 100%)';
                    break;
                case 'shachen':
                    document.querySelector('.weather-logo').src = './img/shachen.png';
                    information.style.backgroundImage = 'linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)';
                    break;
                case 'wu':
                    document.querySelector('.weather-logo').src = './img/wu.png';
                    information.style.backgroundImage = 'linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)';
                    break;
                case 'xue':
                    document.querySelector('.weather-logo').src = './img/xue.png';
                    information.style.backgroundImage = 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)';
                    break;
                case 'yin':
                    document.querySelector('.weather-logo').src = './img/yin.png';
                    information.style.backgroundImage = 'linear-gradient(to right, #868f96 0%, #596164 100%)';
                    break;
                case 'yu':
                    document.querySelector('.weather-logo').src = './img/yu.png';
                    information.style.backgroundImage = 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)';
                    break;
                case 'yun':
                    document.querySelector('.weather-logo').src = './img/yun.png';
                    information.style.backgroundImage = 'linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)';
                    break;
            }

            //====================创建地图=========================
            // 创建地图实例
            let map = new BMapGL.Map("container");
            let point = new BMapGL.Point(cityLon, cityLat);
            // 创建点坐标
            map.centerAndZoom(point, 10);
            // 初始化地图，设置中心点坐标和地图级别
            let zoomCtrl = new BMapGL.ZoomControl();
            // 添加缩放控件
            map.addControl(zoomCtrl);

            //===================地图定位城市=======================
            map.centerAndZoom(new BMapGL.Point(cityLon, cityLat), 11);
            let bd = new BMapGL.Boundary();

            bd.get(cityName, function (rs) {
                let hole = new BMapGL.Polygon(rs.boundaries, {
                    fillColor: 'green',
                    fillOpacity: 0.1
                });
                map.addOverlay(hole);
            });
        }
    }
    inputCity.value = '';
}

//设置按钮节流
const throttle = function (fn, interval) {
    let _self = fn,
        timer,
        firstTime = true;
    return function () {
        let args = arguments;
        _me = this;
        if (firstTime) {
            _self.apply(_me, args);
            return firstTime = false;
        }
        if (timer) {
            return false;
        }
        timer = setTimeout(function () {
            clearTimeout(timer);
            timer = null;
            _self.apply(_me, args);
        }, interval || 1000)
    }
}

//按钮触发搜索
btnSearch.addEventListener('click', throttle(search, 1000));
//回车触发搜索
inputCity.onkeypress = function (event) {
    if (event.which === 13) {
        btnSearch.click();
    }
}