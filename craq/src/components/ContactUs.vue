<template>
    <div class="modal" :class="{'modal__none': !show}">
        <div class="modal__box">
            <div class="adminInfo">
                <img :src="this.config.adminInfo.img" alt="" class="adminInfo__img">
                <div class="adminInfo-text">
                    <div class="adimnInfo__name"><h1>{{this.config.adminInfo.name }}</h1></div>
                    <div class="adimnInfo__mail"><h3>{{this.config.adminInfo.email}}</h3></div>
                    <a :href="this.config.adminInfo.github" target="_blank"><div class="adimnInfo__mail"><h6>{{this.config.adminInfo.github}}</h6></div></a>
                </div>
            </div>

            <div @click="toggle" class="dropdowns" :class="{'open' : config.openDrop == true}">
                {{this.config.adminInfo.name }}
                <ul class="dropdowns-menu" v-for="option in config.admins">
                    <li @mouseover="config.adminInfo = option">{{option.name}}</li>
                </ul>
            </div>
            <p>To : {{this.config.adminInfo.email}}</p>
            <form :action="this.config.adminInfo.script" class='formbox' method="POST">
                <input type="text" name="" id="" placeholder="Title">
                <textarea type="textarea" name="" id="" placeholder="Content"></textarea>
                
                <input type="submit" value="submit">
            </form>
            <button class="modal__btn btn btn--primary margin-bottom-sm" @click="clickEvent">close</button>
        </div>
        
        <!-- BackGround -->
        <div class="modal__background" @click="clickEvent"></div>
    </div>
</template>
<script>
export default {
    name: "Modal",
    data() {
        return {
            config: {
                openDrop: false,
                adminInfo: [
                    {
                        name: "Admin Name",
                    }
                ],
                admins: [
                    {
                        name: '김구현',
                        email : 'rngus3050@gmail.com',
                        img: 'http://edu.ssafy.com/edu/comm/imgDownload.do?userId=8x2UmXNJ4WkJQfF8VVAEHw%3D%3D',
                        github: 'https://github.com/rngus3050',
                        script: 'https://script.google.com/macros/s/AKfycbzZE7JnY10SkjQK_nwpoaGHTn9iBotPcSx7EydX/exec'
                    },
                    {
                        name: '김범현',
                        email : 'beomhyunkim@gmail.com',
                        img: 'http://edu.ssafy.com/edu/comm/imgDownload.do?userId=GTVgeGHHBCnEU9J12aCotA%3D%3D',
                        github: 'https://lab.ssafy.com/beomhyunkim'
                    },
                    {
                        name: '김상근',
                        email : 'jchrys@me.com',
                        img: 'http://edu.ssafy.com/edu/comm/imgDownload.do?userId=B7r0qnts4VUAPz6z3V4dNQ%3D%3D',
                        github: 'http://jchrys.github.io/algorithms'
                    },
                    {
                        name: '정준희',
                        email : 'jjhgcs1163@gmail.com',
                        img: '',
                        github: 'https://github.com/JeongJunHui'
                    },
                    {
                        name: '조수장',
                        email : 'whtnwkd0328@gmail.com',
                        img: '',
                        github: 'https://github.com/JeongJunHui'
                    },
                ]
            }
        }
    },
    props: [
        "show",
    ],
    methods: {
        clickEvent(e) {
            this.config.openDrop = false;
            this.$emit('close', true);
        },
        toggle() {
            this.config.openDrop = !this.config.openDrop
        },
    }
}

</script>

<style lang="scss" scoped>
// dropdown test
.dropdowns {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: var(--color-primary);
}

.open .dropdowns-menu {
  display: block;
}
.dropdowns-menu {
  position: relative;
  text-align: center;
  width: 100%;  
  display: none;
  background-color: var(--color-secondary);
}

.dropdowns-menu li:hover {
  background-color: var(--color-surface);
}

// FormBox
.formbox {
    display: flex;
    flex-direction: column;

}

.adminInfo {
    display: flex;
    justify-content: space-between;
    width: 400px;
    height: 120px;
    padding: var(--space-xxs);
    background-color: var(--color-surface);

    &__img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: var(--color-primary);
    }
}
.adminInfo-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 280px;
}
.modal {
    transition: all 2s ease;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 5s ease;
    &__none {
        display: none;
    }
    &__background {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: alpha(var(--color-black), 0.5);
        z-index: 2;
    }

    &__box {
        position: fixed;
        box-shadow: var(--shadow-md);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: alpha(var(--color-surface), 0.8);
        border-radius: var(--radius-md);
        padding: var(--space-xxs);
        text-align: center;
        z-index: 51;
    }
    &__content {
        text-align: center;
        color: var(--color-on-surface);

    }
    &__btn {
        margin: var(--space-xxs);
    }
}

textarea {
    height: 200px;
    resize: none;
}

</style>
