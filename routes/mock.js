const router = require('koa-router')()
const glob = require('glob')
const { resolve } = require('path')
const fs = require('fs')

router.prefix('/api')
const routerMap = {};  // 存放路由映射

router.get('/list', function (ctx, next) {
  const query = ctx.query
  ctx.body = {
      errorno: 0,
      query,
      data: ['获取课程列表']
  }
})

// 注册路由
glob.sync(resolve('./api', "**/*.json")).forEach((item, i) => {
    console.log(item)
    let apiJsonPath = item && item.split('/api')[1];
    let apiPath = apiJsonPath.replace('.json', '');
    
    router.get(apiPath, (ctx, next) => {
        try {
            let jsonStr = fs.readFileSync(item).toString();
            ctx.body = {
                data: JSON.parse(jsonStr),
                state: 200,
                type: 'success' // 自定义响应体
            }
        }catch(err) {
            ctx.throw('服务器错误', 500);
        }
      });
    
    // 记录路由
    routerMap[apiJsonPath] = apiPath;

    fs.writeFile('./routerMap.json', JSON.stringify(routerMap, null , 4), err => {
        if(!err) {
            console.log('路由地图生成成功！')
        }
    });
});

// fs.writeFile('./routerMap.json', JSON.stringify(routerMap, null , 4), err => {
//     if(!err) {
//         console.log('路由地图生成成功！')
//     }
// });

module.exports = router