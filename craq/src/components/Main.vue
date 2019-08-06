<template>
    <div class="main">
        <router-link to="/code">
            <div class="content">
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <pre>내려간다</pre>
            <!-- <div class="codeList">
                <div :key="idx" v-for="(config, idx) in configsTop">
                    <MainText :config="config"/>
                </div>
            </div>  -->

            <div class="textBox">
                <div class="wellcome">
                    <p class="wellcome__title">Welcome</p>
                    <p class="wellcome__username">{{welcomeText}}</p>
                    <p class="wellcome__key">Click Anywhere to get CRAQ</p>
                </div>
            </div>

            <!-- <div class="codeList">
                <div :key="idx" v-for="(config, idx) in configsBottom">
                    <MainText :config="config"/>
                </div>
            </div> -->
            
            </div>
        </router-link>
    </div>
</template>

<script>
import MainText from '@/components/MainText.vue';

export default {
    name: "Main",
    components: {
        MainText,
    },
    data() {
        return {
            configsTop: [],
            configsBottom: [],
            welcomeText : ''
        }
    },
    mounted() {
        this.welcomeText = this.$session.get('username').toUpperCase()
        this.configsTop = [{       
                    title : 'C',
                    typing : "#include <studio.h> <br><br> int main(vold) { <br> puts('wellcome, " + this.$session.get('username') + "!'); <br>     return 0; <br> }",   
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
                {       
                    title : 'CPP',
                    typing : "#include <iostream> <br><br> int main() <br> { <br> std::cout << 'Wellcome," + this.$session.get('username') + "!'); <br>     return 0; <br> }",   
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
                {       
                    title : 'JAVA',
                    typing : "public class Foo { <br> int public static vold <br> main(String[] args) { <br> System.out.printin <br> (`Wellcome, " + this.$session.get('username') + "!'); <br>} <br> }",
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
                {       
                    title : 'Python',
                    typing : "print(`Wellcome, " + this.$session.get('username') + "!')",   
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
        ],
        this.configsBottom = [{       
                    title : 'Pascal',
                    typing : "Program Wellcome; <br><br> begin <br> writeIn('Wellcome, " + this.$session.get('username') + "!'); <br> end.",   
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
                {       
                    title : 'Arduino',
                    typing : "void setup() { <br> Serial.begin(9600); <br> Serial.printIn<br>('Wellcome," + this.$session.get('username') + "!'); <br> } <br><br> void loop() { <br> <br> } }",   
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
                {       
                    title : 'C#',
                    typing : "using System; <br> namespace Csharpv <br> { <br> class Prigram <br> { <br> static void Main(string[] args) <br> { <br> console.WriteLine(`Wellcome) " + this.$session.get('username') + "!'); <br> } } }",
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
                {       
                    title : 'Go',
                    typing : "package main <br><br> import 'fmt' <br> <br> func main() { <br> fmt.Printf ('Wellcome, " + this.$session.get('username') + "!') <br> }",   
                    playTyping: '',
                    Bool : false,
                    Idx : 0,
                    Int : '',
                },
        ]  
    }
}

</script>

<style scoped lang="scss">
@font-face {
  font-family: 'neontubes';
  src: url("https://bitbucket.org/kennethjensen/webfonts/raw/fc13c1cb430a0e9462da56fe3f421ff7af72db71/neontubes/neontubes-webfont.eot");
  src: url("https://bitbucket.org/kennethjensen/webfonts/raw/fc13c1cb430a0e9462da56fe3f421ff7af72db71/neontubes/neontubes-webfont.eot?#iefix") format("embedded-opentype"), url("https://bitbucket.org/kennethjensen/webfonts/raw/fc13c1cb430a0e9462da56fe3f421ff7af72db71/neontubes/neontubes-webfont.woff2") format("woff2"), url("https://bitbucket.org/kennethjensen/webfonts/raw/fc13c1cb430a0e9462da56fe3f421ff7af72db71/neontubes/neontubes-webfont.woff") format("woff"), url("https://bitbucket.org/kennethjensen/webfonts/raw/fc13c1cb430a0e9462da56fe3f421ff7af72db71/neontubes/neontubes-webfont.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
pre {
    font-size: var(--text-xxl);
    color: var(--color-primary);
    text-shadow: 0 0 0 transparent, 0 0 10px var(--color-primary-light), 0 0 20px alpha(var(--color-primary-darker), 0.7), 0 0 40px var(--color-primary-light), 0 0 100px var(--color-primary-light), 0 0 200px var(--color-primary-light);
    letter-spacing: .3rem;
  word-spacing: 1rem;
  padding: 1rem 0;

    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: translatey(-500%);
    animation: matrix linear 30s infinite;
}
@keyframes matrix {
  100% {
    transform: translatey(500%);
  }
}
pre:nth-child(5n+1) {
  animation-delay: 1s;
  animation-duration: 3s;
}
pre:nth-child(5n+2) {
  animation-delay: 1.33s;
  animation-duration: 5s;
}
pre:nth-child(5n+3) {
  animation-delay: -1s;
  animation-duration: 2s;
}
pre:nth-child(4n) {
  animation-delay: -2s;
  animation-duration: 4s;
}
.content {
    user-select: none;
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: var(--space-md);
    background-color: var(--color-black);
}

.textBox {
    text-align: center;
}

.wellcome {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 300px;
    font-size: 100px;
    text-align: center;
    -webkit-animation: blink 4s infinite alternate;

    &__title {
    font-family: 'neontubes';
    text-shadow: 0 0 0 transparent, 0 0 10px var(--color-primary), 0 0 20px alpha(var(--color-primary-darker), 0.5), 0 0 40px var(--color-primary), 0 0 100px var(--color-primary), 0 0 200px var(--color-primary), 0 0 300px var(--color-primary), 0 0 500px var(--color-primary), 0 0 1000px var(--color-primary);
    -webkit-animation: blink 4s infinite alternate;
    animation: blink 4s infinite alternate;
    letter-spacing: 10px;
    
    color: var(--color-primary-dark);
    }

    &__username {
        font-family: 'neontubes';
        color: var(--color-secondary-dark);
        letter-spacing: 10px;
        text-shadow: 0 0 0 transparent, 0 0 10px var(--color-secondary-lighter), 0 0 20px alpha(var(--color-secondary-darker),0.7), 0 0 40px var(--color-secondary-lighter), 0 0 100px var(--color-secondary-lighter), 0 0 200px var(--color-secondary-lighter), 0 0 300px var(--color-secondary-lighter), 0 0 500px var(--color-secondary-lighter);
        -webkit-animation: buzz 0.08s infinite alternate;
        animation: buzz 0.08s infinite alternate;
    }

    &__key {
        font-size: 20px;
        font-family: 'neontubes';
        color: var(--color-white);
        letter-spacing: 10px;
        text-shadow: 0 0 0 transparent, 0 0 10px var(--color-white), 0 0 20px var(--color-black), 0 0 40px var(--color-white), 0 0 100px var(--color-white), 0 0 200px var(--color-white), 0 0 300px var(--color-white), 0 0 500px var(--color-white);
        -webkit-animation: HIDE 1s infinite alternate;
        animation: HIDE 1s infinite alternate;
    }
}

.codeList {
    display: flex;
    justify-content: space-around;
}

@-webkit-keyframes HIDE {
    10% {
        opacity: 0.01;
    }
}

@keyframes HIDE {
    70% {
        opacity: 0.8;
    }
}

@-webkit-keyframes buzz {
  70% {
    opacity: 0.80;
  }
}
 
@keyframes buzz {
  70% {
    opacity: 0.80;
  }
}

@-webkit-keyframes blink {
  40% {
    opacity: 1;
  }
  42% {
    opacity: 0.8;
  }
  43% {
    opacity: 1;
  }
  45% {
    opacity: 0.2;
  }
  46% {
    opacity: 1;
  }
}
@keyframes blink {
  40% {
    opacity: 1;
  }
  42% {
    opacity: 0.8;
  }
  43% {
    opacity: 1;
  }
  45% {
    opacity: 0.2;
  }
  46% {
    opacity: 1;
  }
}
</style>
