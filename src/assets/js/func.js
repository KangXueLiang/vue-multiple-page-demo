//公用方法
var Rxport = {

	//字符串补零
	addZero(num, fill){
		/*
			param:
			num    数字
			fill   补零的个数
		*/
		var len = ('' + num);
		return Array(fill + 1).join(0) + num;
	},

	//对象拼接成value=key&...方法
	obj_str(obj){
		/*
			param: 
			obj   普通对象
		*/
		return (
			Object.entries(obj).map(i => i.join('=')).join('&')
		)
	},

	//检测是否为空对象
	empty_obj(obj){
		/*
            param:
            obj 对象 (返回true表示为空对象, false为非空)
        */
        for(var i in obj){
            return false;
        }
        return true;
	},


}

export default Rxport;