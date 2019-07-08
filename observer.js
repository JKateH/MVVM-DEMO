class Observer{
    constructor(data){
        this.observer(data)
    }
    observer(data){
        //对data数据将原有的属性改成get的set的形式
        console.log(typeof data)
        if(!data || typeof data !=='object'){
            return
        }
        //要将数据 一一劫持 先获取到data的key的value
        Object.keys(data).forEach((key)=>{
            this.defineReactive(data,key,data[key])
            this.observer(data[key]) //深度递归劫持
        })
    }
    //定义数据劫持
    defineReactive(obj,key,value){
        let self = this
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:false,
            get(){
                return value
            },
            set(newValue){
                if(newValue!=value){
                    self.observer(newValue) //如果是对象继续劫持
                    value = newValue
                }
            }
        })
    }
}