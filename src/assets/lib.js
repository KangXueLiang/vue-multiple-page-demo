//引入reset
import 'assets/css/reset.css';
//引入公用方法
import F from 'assets/js/func';
//引入配置项
import C from 'assets/js/conf';

//用于破解ios :active伪类不生效的问题
document.body.addEventListener('touchstart', function () {});

const Rxport = {
	F,C
};

export default Rxport;