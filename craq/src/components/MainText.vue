<template>
    <div class="codeBox">
        <sup>
            <div class="subBox">
                {{config.title}}
            </div>
        </sup>
        <div class="codeBox__content">
            <span class="typing-txt">{{config.typing}}</span>
            <span class="typing" v-html="config.playTyping">{{config.playTyping}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name : 'MainText',
    props: [
        'config'
    ],
    methods: {
         playTyp() {
            const typingTxt = this.config.typing.split("") // 한글자씩 자른다. 
            if(this.config.Bool==false){ // 타이핑이 진행되지 않았다면 
                this.config.Bool=true; 
                console.log('true')
            
            this.config.Int = setInterval(()=> { 
                if(this.config.Idx < typingTxt.length){ // 타이핑될 텍스트 길이만큼 반복 
                    this.config.playTyping = this.config.playTyping + typingTxt[this.config.Idx] // 한글자씩 이어준다.
                    this.config.Idx++
                } else{
                    this.config.Bool=false  
                    // clearInterval(this.config.Int); //끝나면 반복종료 
                } 
            },50); // 반복동작 
            }
        },
    },
    mounted() {
        this.playTyp()
    }
    
}
</script>

<style lang="scss" scoped>
.codeBox {
    width: 270px;
    height: 270px;
    border: 2px solid var(--color-primary-dark);

    &__content {
        margin: var(--space-sm);
    }
}

.subBox {
    width: 100px;
    text-align: center;
    font-size: var(--text-md);
    color : var(--color-white);
    background-color: var(--color-primary-dark);
}

.typing-txt{display: none;}
  

.typing {  
     display: inline-block; 
        color: var(--color-white)
    } 
</style>

