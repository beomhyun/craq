<template>
    <div class="wrapper">
        <form class="login-form">
            <div class="text-component text-center margin-bottom-md">
                <h1>SignIn</h1>
                <p>Hello, SSAFY WORLD!</p>
            </div>

            <div class="margin-bottom-sm">
                <label class="form-label margin-bottom-xxxs" for="inputEmail1">Email</label>
                <input class="form-control width-100%" type="email" name="inputEmail1" id="inputEmail1" placeholder="email@myemail.com">
            </div>

            <div class="margin-bottom-sm">
                <div class="flex justify-between margin-bottom-xxxs">
                    <label class="form-label" for="inputPassword1">Password</label>
                    <span class="text-sm"><a href="#0">Forgot?</a></span>
                </div>

                <input class="form-control width-100%" type="password" name="inputPassword1" id="inputPassword1">
            </div>

            <div class="margin-bottom-sm">
                <button class="btn btn--primary btn--md width-100%">Login</button>
            </div>

            <div class="text-center">
                <p class="text-sm">Don't have an account? <a href="#0">Get started</a></p>
            </div>
            <Steps/>
        </form>
    </div>

</template>

<script>
import Steps from '@/components/Steps.vue';
export default {
    name: "SignForm",
    components: {
        Steps
    }
     
}

</script>


<style lang="scss" scoped>
.wrapper {
    background-color: var(--color-surface);
    width: 100%;
    height: 100%;
    padding: var(--space-xxxs) var(--space-xs);
    border-radius: var(--radius-sm);
    color: var(--color-on-surface);
}
.login-form {
    height:100%;
}
</style>
