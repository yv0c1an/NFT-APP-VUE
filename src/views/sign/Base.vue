<template>
    <div id="sign">
        <div class="form_main">
            <div class="brand">
                <h3>欢迎使用</h3>
                <p>数字艺术品管理系统</p>
            </div>
            <div class="sign_form">
                <router-view />
            </div>
        </div>
    </div>
    <div id="copyright">
        Copyright©<a href="" target="_blank">北京XX科技有限公司</a> 京ICP备 1000000号-1
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
#sign{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../../assets/images/beams.jpeg");
    background-size: cover;
    .form_main{
        width: 650px;
        height: 430px;
        overflow: hidden;
        display: flex;
        background: #fff;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        border-radius: 10px;
    }
    .brand{
        width: 260px;
        display: flex;
        background-image: url("../../assets/images/loginbg.png");
        background-size: cover;
        color: #fff;
        display: flex;
        flex-flow: column;
        padding: 75px 0 0 35px;
        h3{
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        p{
            font-size: 18px;
        }
    }
    .sign_form{
        padding: 40px;
        display: flex;
        flex: 1;
    }
}
#copyright{
    font-size: 13px;
    text-align: center;
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    color: #666;
}
</style>
