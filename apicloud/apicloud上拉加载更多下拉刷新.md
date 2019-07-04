```javascript
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>
    <meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
    <title>Hello APP</title>
        <style>
                #contant{
                }
                .ids{
                        text-align: center;
                        margin-bottom: 5px;
                        border-bottom: 1px #DDDDDD solid;
                }
        </style>
</head>
<body>
    <div id="contant"></div>
</body>
<!--很多人说报api is not defind 的错误是没引入api.js，所以我没引入来告诉你们，api未定义真的是因为你执行api方法之前没有进行apiready处理-->
<script type="text/javascript">
//        首先,我们声明页面逻辑处理所需要的全局变量
        var skip = 0;                //页码
        var limit = 20;                //每页条数
        var datas = new Array(); //页面数据存储的数组
// 然后，进行apiready处理，在apiready里 我进行了第一次页面数据请求和初始化事件监听        
        /**
         * api初始化
         */
    apiready = function(){
                fnInitData();
                fnInitEvent();
    };
// 数据请求我用的是上次认证考试的接口。    
    /**
     * 获取页面数据
     */
    function fnInitData(){
            //请求参数
            var ajaxValues = {
                    where:{},
                        skip:skip,
                        limit:limit,
                        order:"createdAt DESC"
            };
            // 加载loading
            api.showProgress({
                        title:"获取数据中...",
                        text: '请稍等...'
        });
                //api.ajax
            api.ajax({
                url:'https://d.apicloud.com/mcm/api/timeline',
                headers:{
                                "X-APICloud-AppId":"A6078991134970",
                                "X-APICloud-AppKey":"bb3d0326284e1306de46d29c928e9fa8632d156c.1523672167637"
                        },
                        data:{
                                values:{
                                        filter:JSON.stringify(ajaxValues)
                                }
                        },
                        dataType:"json",
                        method:"get",
        },function(ret,err){
                //取消loading
                api.hideProgress();
                if(ret){
                        //把请求到的数据遍历添加进页面数据的数组
                        if(ret.length > 0){
                                for (var i = 0,len = ret.length; i < len ; i++) {
                                        datas.push(ret[i]);
                                };
                                //调用页面渲染的方法
                                fnInitView(datas);
                        }else{
                                api.toast({msg:'没数据了，别拽了'});
                                skip-=1;
                        };
                        console.log("第"+(skip+1).toString()+"页");
                }else{
                        alert("交互失败");
                };
        });
    };
    
    /**
     * 渲染页面布局
     * 
     * @param {Array} data
     */
    function fnInitView(data){
            // 取消下拉刷新效果
            api.refreshHeaderLoadDone();
            //声明容器 并置空
            var box = document.getElementById("contant");
            box.innerHTML = "";
            //遍历页面数据的数组进行创建标签,插入容器
            for (var i = 0;i < data.length ; i++) {
                    var p = document.createElement('p');
                    p.innerHTML = '第'+ (i+1).toString() + '个' + 'id: ' + data[i].id;
                    p.className = 'ids';
                    box.appendChild(p);
            };
    };
    
    
    /**
     * 初始化页面监听事件
     */
    function fnInitEvent(){
            /**上拉加载 */
            api.addEventListener({
                    name:'scrolltobottom',
                    extra:{
                        threshold:10            
                    }
                }, function(ret, err){    
                        //页码+1，继续请求数据
                        skip+=1;
                        fnInitData();
                });
                /** 下拉刷新 */
                api.setRefreshHeaderInfo({
                    bgColor: '#ccc',
                    textColor: '#fff',
                    textDown: '下拉刷新...',
                    textUp: '松开刷新...'
                }, function(ret, err) {
                        //重置页码、页面数据，请求数据
                    skip = 0;
                    datas = new Array();
                    fnInitData();
                });
    };
</script>
</html>
```

