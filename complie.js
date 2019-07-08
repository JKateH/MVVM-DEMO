class Compile{
    /*vm是MVVM实例*/
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm
        if(this.el){
            //如果这个元素可以获取到才开始编译
            //1.先把这些真实的DOM移入到fragement()中
            let fragment = this.node2fragment(this.el);
            //2.编译 => 提取想要的元素节点v-model和文本节点{{}}
            this.compile(fragment)
            //3.把编译好的fragement在塞回到页面里去
            this.el.appendChild(fragment)
        }
    }

    /* 辅助方法 */
    isElementNode(node){
        return node.nodeType ===1;
    }
    isDirective(attrName){
        return attrName.includes('v-');
    }

    /* 核心方法 */
    compile(fragment){
        // console.log(fragment)
        //需要递归
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                //是元素节点,还需要继续深入的检查
                this.compileElement(node)
                //这里需要编译元素
                this.compile(node);
            }else{
                //文本节点
                //这里需要编译文本
                this.compileText(node)
            }
        })
    }
    compileElement(node){
        //带v-model v-text
        let attrs = node.attributes; //取出当前元素节点属性
        Array.from(attrs).forEach(attrs=>{
            let attrName = attrs.name;
            if(this.isDirective(attrName)){
                //取到对应的值放到节点中
                let expr = attrs.value;
                let [,type] = attrName.split('-');
                compileUtil[type](node,this.vm,expr);
            }
        })
    }
    compileText(node){
        //带{{}}
        let expr = node.textContent
        let reg = /\{\{([^}]+)\}\}/g
        if(reg.test(expr)){
            //
            compileUtil['text'](node,this.vm,expr)
        }
    }
    node2fragment(el){//需要将el中的所有内容全部放在内存里去
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;
    }

}
compileUtil={
    getValue(vm,expr){
        expr = expr.split('.')
        return expr.reduce((prev,next)=>{
            return prev[next]
        },vm.$data)
    },
    text(node,vm,expr){  //文本处理
        let updateFn = this.updater['textUpdater'];
        let val = expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            return this.getValue(vm,arguments[1])
        })
        updateFn && updateFn(node,val)
    },
    model(node,vm,expr){ //输入框处理
        let updateFn = this.updater['modelUpdater'];
        updateFn && updateFn(node,this.getValue(vm,expr))
    },
    updater:{
        //文本更新
        textUpdater(node,value){
            node.textContent = value
        },
        //输入框更新
        modelUpdater(node,value){
            node.value = value
        }
    }
}