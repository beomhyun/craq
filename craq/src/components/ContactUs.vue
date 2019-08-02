<template>
    <div class="modal" :class="{'modal__none': !show}">
        
        <div class="modal__box">
            <div class="adminInfo">
                <img :src="this.config.selcetedAdmin.img" alt="" class="adminInfo__img">
                <div class="adminInfo-text">
                    <div class="adminInfo__name">{{this.config.selcetedAdmin.name }}</div>
                    <div class="adminInfo__mail">{{this.config.selcetedAdmin.email}}</div>
                    <a :href="this.config.selcetedAdmin.github" target="_blank"><div class="adminInfo__mail">{{this.config.selcetedAdmin.github}}</div></a>
                </div>
            </div>
            <li class="menu__separator" role="separator"></li>
            <div @click="toggle" class="dropdowns" :class="{'open' : config.openDrop == true}">
                {{this.config.selcetedAdmin.name}}<p class="arrow">^</p>
                <ul class="dropdowns-menu" v-for="option in config.admins">
                    <li @mouseover="config.selcetedAdmin = option">{{option.name}}</li>
                </ul>
            </div>
            <p class="to">To : {{this.config.selcetedAdmin.email}}</p>
            <li class="menu__separator" role="separator"></li>
            <form class='formbox'>
                <input type="text" name="Title" class="formbox__title" placeholder="Title">
                <textarea type="textarea" name="Content" class="formbox__content" placeholder="Content"></textarea>
                
                <input type="submit" class="submit btn btn--sm btn--primary" value="Submit" @click="clickEvent">
            </form>
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
                selcetedAdmin: {
                        name: '김구현',
                        email : 'rngus3050@gmail.com',
                        img: 'http://edu.ssafy.com/edu/comm/imgDownload.do?userId=8x2UmXNJ4WkJQfF8VVAEHw%3D%3D',
                        github: 'https://github.com/rngus3050',
                        script: 'https://script.google.com/macros/s/AKfycbzZE7JnY10SkjQK_nwpoaGHTn9iBotPcSx7EydX/exec'
                },
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
    },
    mounted() {
    },
    computed: {
        
    }
}

</script>

<style lang="scss" scoped>

$--menu-item-padding: var(--space-xxxs) var(--space-xxs);

// dropdown test
.dropdowns {
  position: relative;
  width: 100%;
  height: 40px;
  background-color: var(--color-background);
}

.dropdowns:hover {
    cursor: pointer;
    background-color: var(--color-primary);
}

.arrow{
    display: inline;
}

.open .arrow {
    transform: rotate( 180deg );
}
.open .dropdowns-menu {
  visibility: visible;
    border-left: 1px solid var(--color-contrast-low);
    border-right: 1px solid var(--color-contrast-low);
  opacity: 1;
}
.dropdowns-menu {
  position: relative;
  text-align: center;
  width: 100%;  
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity .2s linear;
  background-color: var(--color-background);
}

.dropdowns-menu li:hover {
    cursor: pointer;
    background-color: alpha(var(--color-surface-dark), 0.8);
}


// FormBox
.formbox {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
        width: 100%;
        border: none;
    }

    &__content {
        width: 100%;
        margin-top: var(--space-xxs);
        border:none;
    }

}

.submit {
    display: inline;
    width: 50%;
}

.menu__separator {
    height: 1px;
    background-color: var(--color-contrast-low);
    margin: $--menu-item-padding;
}

.adminInfo {
    display: flex;
    justify-content: space-between;
    width: 400px;
    height: 120px;
    padding: var(--space-xxs);
    background-color: var(--color-background);
    user-select: none;

    &__img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid var(--color-contrast-high);
        background-color: var(--color-surface-dark);
    }

    &__name {
        font-size: var(--text-md);
        font-weight: 500;
    }

    &__mail {
        font-size: var(--text-xs);
    }

}

.to {
    background-color: var(--color-background);
}
.to:hover {
    user-select: none;
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
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: alpha(var(--color-black), 0.5);
        z-index: 900;
    }

    &__box {
        position: fixed;
        box-shadow: var(--shadow-md);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--color-background);
        border-radius: var(--radius-md);
        padding: var(--space-xxxs);
        text-align: center;
        z-index: 901;
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
