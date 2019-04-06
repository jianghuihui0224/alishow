const express = require('express');
//创建路由对象
const router = express.Router();

const path = require('path');
const db = require('../db.js');
const moment = require('moment');


//显示管理员列表页 --- admin/user/users.html
router.get('/admin/user/users', (req, res) => {
    res.render(path.join(currentPath, 'view', 'admin/user/users.html'));
})
// 获取管理员列表数据
router.get('/admin/user/getUsers', (req, res) => {
    //1. 编写SQL语句
    const sql = 'select * from ali_admin';
    //2. 执行SQL语句
    //result是一个对象组成的数组
    db.query(sql, (err, result) => {
        //3. 处理SQL执行结果 --- 将执行结果返回给前端(users.html)
        if (err) {
            console.log(err);
            return res.send({code:201, message:"查询管理员信息失败"});
        }
        res.send({code:200, message:"查询管理员信息成功", data: result});
    })
});


// 获取添加管理员列表数据
router.get('/admin/user/adduser', (req, res) => {
    res.render(path.join(currentPath, 'view', 'admin/user/adduser.html'));
});
//添加新管理员,用到了操作字符串的第三方插件validate(基于jq使用),以及layer第三方插件,制作弹框
router.post('/admin/user/adduserDel', (req, res) => {
    let data = {
        admin_email: req.body.email,
        admin_nickname: req.body.nickname,
        admin_pwd: req.body.password,
        admin_state: req.body.state,
        admin_addtime: moment().format('YYYY-MM-DD')
    };
    const sql = 'insert into ali_admin set ?'
    db.query(sql, data, (err, result) => {
        if (err || result.affectedRows != 1) {
            return res.send({code: 201, message: '添加管理员失败'})
        }
        res.send({code: 200, message: '添加管理员成功'})
    });

});


//删除管理员
router.get('/admin/uesr/delUser', (req, res) => {
    let sql = "delete from ali_admin where admin_id=?";
    let data =  req.query.id
    // console.log(data)
    db.query(sql, data, (err, result) => {
        if (err || result.affectedRows != 1) {
            return res.send({code: 201, message: '删除管理员失败'})
        }
        res.send({code: 200, message: '删除管理员成功'})
    })
})



//导出路由模块
module.exports = router;