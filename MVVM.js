class MVVM{
    constructor(obtions){
        //先把可用的东西挂载到实例上
        this.$el = obtions.el;
        this.$data = obtions.data;

        //如果有要编译的模版就开始编译
        if(this.$el){
            //数据劫持
            new Observer(this.$data)
            //用数据和元素进行编译
            new Compile(this.$el,this)
        }
    }
}