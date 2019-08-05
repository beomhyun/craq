<template>
    <div class="main">
        <div class="content">
            <div class="codeList">
                <div :key="idx" v-for="(config, idx) in configsTop">
                    <MainText :config="config"/>
                </div>
            </div> 

            <div class="textBox">
                <div class="wellcome">
                    <p>Welcome</p>
                    <p class="username">{{welcomeText}}</p>
                </div>
            </div>

            <div class="codeList">
                <div :key="idx" v-for="(config, idx) in configsBottom">
                    <MainText :config="config"/>
                </div>
            </div>
            
        </div>
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
.content {
    display: flex;
    flex-direction: column;
    padding: var(--space-md);
    background-color: var(--color-surface-light);
}

.textBox {
    text-align: center;
}

.wellcome {
    width: 100%;
    height: 300px;
    text-align: center;

    font-size: 100px;
    color: var(--color-primary-dark) 
}

.codeList {
    display: flex;
    justify-content: space-around;
}


.username {
    color: var(--color-on-surface);
}
</style>
