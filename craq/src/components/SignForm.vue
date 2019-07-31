<template>
    <div class="wrapper width-100%">
        <Modal :show="showModal" :body="'adjfsjflasdjkfl sdjfklasdf lasdjf klasdf jklas dfjklasd fklasdf jakl'" :btntext="'closesese'" @clicked="closeModal"/> <form class="login-form">
            <div class="text-component text-center margin-bottom-md">
                <div>
                    <h1 v-if="progress==0">Sign In</h1>
                    <h1 v-if="progress == 1 || progress == 2 || progress== 3">SignUp</h1>
                </div>
                <div v-if="progress">
                    <Steps :progress="progress"/>
                </div>
                <div v-else>
                    <p>Hello, SSAFY WORLD!</p>
                </div>

            </div>
            <div v-if="progress == 2" class="text-center">
                <h2>Verification in progress</h2>
                <Spinner/>
            </div>
            <div v-if="progress == 3">
                <h2>Welcome {{inputUsername}}!</h2>
                <h2>SignUp done...</h2>
            </div>



            <div v-if="progress == 1" class="margin-bottom-sm">
                <label class="form-label margin-bottom-xxxs" for="inputUsername">Username
                    <font-awesome-icon  v-if="!username" icon="exclamation"></font-awesome-icon>
                    <font-awesome-icon  v-else icon="check"></font-awesome-icon>


                </label>
                <input class="form-control width-100%" type="text" v-model="inputUsername" name="inputUsername" id="inputUsername" placeholder="Username">
            </div>
            <div v-if="progress == 0 || progress == 1" class="margin-bottom-sm">
                <label class="form-label margin-bottom-xxxs" for="inputEmail1">Email
                    <font-awesome-icon  v-if="!email && progress == 1" icon="exclamation"></font-awesome-icon>
                    <font-awesome-icon  v-if="email && progress == 1" icon="check"></font-awesome-icon>
                </label>
                <input class="form-control width-100%" type="email" v-model="inputEmail" name="inputEmail" id="inputEmail" placeholder="SSAFY Email">
            </div>

            <div v-if="progress == 0 || progress == 1" class="margin-bottom-sm">
                <div class="flex justify-between margin-bottom-xxxs">
                    <label class="form-label" for="inputPassword1">Password</label>
                    <span  v-if="progress == 0" class="text-sm"><a tabIndex="-1" href="#0" @click.prevent="WIP">Forgot?</a></span>
                </div>

                <input class="form-control width-100%" type="password" v-model="inputPassword1" name="inputPassword1" id="inputPassword1">
            </div>

            <div v-if="progress == 1" class="margin-bottom-sm">
                <div class="flex justify-between margin-bottom-xxxs">
                    <label class="form-label" for="inputPassword2">Password Verification
                    <font-awesome-icon  v-if="!password && progress == 1" icon="exclamation"></font-awesome-icon>
                    <font-awesome-icon  v-if="password && progress == 1" icon="check"></font-awesome-icon>
                    </label>
                </div>

                <input class="form-control width-100%" type="password" v-model="inputPassword2" name="inputPassword2" id="inputPassword2">
            </div>

            <div v-if="progress != 2" class="margin-bottom-sm">
                <button class="btn btn--primary btn--md width-100%" @click.prevent="primeButton">
                    {{progress == 0 ? 'Login' : '' }}
                    {{progress == 1 ? 'Verify' : '' }}
                    {{progress == 2 ? 'next2' : '' }}
                    {{progress == 3 ? 'confirm' : ''}}
                    {{progress == 4 ? 'check' : ''}}
                </button>
            </div>

            <div v-if="progress == 1" class="margin-bottom-sm">
                <div class="btn btn--accent btn--md width-100%" @click.prevent="goHome">
                    Cancel
                </div>
            </div>
        </form>
        <div v-if="progress==0" class="text-center">
            <p class="text-sm" style="cursor: pointer;" @click="getStarted">Don't have an account? Get started</p>
        </div>
    </div>

</template>

<script>
import Steps from '@/components/SignForm/Steps.vue';
import Modal from '@/components/Modal.vue';
import Spinner from '@/components/Spinner.vue';
const SHA512 = require('crypto-js/sha512');

const baseUrl = 'http://192.168.31.58:10123'

export default {
    name: "SignForm",
    components: {
        Steps, Modal, Spinner
    },
    data() {
        return {
            "progress": 0,
            "inputUsername": "",
            "inputEmail": "",    
            "inputPassword1": "",
            "inputPassword2": "",
            username: false,
            showModal: false,
            email: false,
            password: false,
            errors: [],
        }
    },
    watch: {
        inputUsername: function(val, oldVal) {
            const checker = val;
            if (!checker) {
                this.username = false;
                return;
            } else {
                
                this.$axios.get("username-checking/" + checker).then(res=>{
                    this.username = (res.data.status == 'success');

                }).
                    catch(err=>console.log(err));
            }

        },
        inputEmail: function(val, oldVal) {
            const checker = val;
            if (!this.validEmail(val)) {
                this.email = false;
                return;
            }
            this.$axios.get("email-checking/" + checker).then(res=>{
                this.email = (res.data.status == 'success');
            }).
                catch(err=>console.log(err));

        },
        inputPassword2: function(val, oldVal) {
            const checker = val;
            this.password = (this.inputPassword1 == checker);
        },
        inputPassword1: function(val, oldVal) {
            const checker = val;
            this.password = (this.inputPassword2 == checker);

        }
    },
    methods: {
        WIP() {
            alert('WIP');
        },
        goHome() {
            this.progress = 0;
            this.inputEmail = '';
            this.inputUsername ='';
            this.inputPassword1 = '';
            this.inputPassword2 = '';
        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        closeModal() {
            console.log('clicked');
            this.showModal = false;
        },
        signUp() {
            const apiUrl = baseUrl + "/users";
            let headers = {
                "accept": "application/json",
                "Content-Type" : "application/json "
            }
            let data = {
                email: this.inputEmail,
                username: this.inputUsername,
                password: SHA512(this.inputPassword1).toString()
            }
            return this.$axios.post(apiUrl, data, {headers:headers});
        },
        login() {
            const apiUrl = baseUrl + '/login';
            const headers = {
                "Content-Type": "application/json"
            };
            const data = {
                "email": this.inputEmail,
                "password": SHA512(this.inputPassword1).toString()
            }
            this.$axios.post(apiUrl, data, {headers: headers}).then(res=> {
                if (res.data.status == "fail") {
                    return alert('check email or password');
                } 
                this.$session.start();
                this.$session.set('jwt', res.data.data);
                this.$router.go('/');

            }).catch(err => console.log(err));

        },
        verify() {
            if (!this.password || !this.username || !this.email) return alert('check form');
            this.progress = 2 
            setTimeout(() => {
            this.signUp().then(res=> {
                console.log(res.data);
                if(res.data.status === "success") {
                this.progress = 3; 
                    this.inputPassword2 = '';
                } else {
                    this.progress = 1;
                }
            }).catch(err=>console.log(res));

            }, 2000

            );
        },
        confirm() {
            this.inputUsername = "";
            this.Email= "";
            this.inputPassword1= "";
            this.inputPssword2= "";
            this.progress = 0;
        },
        getStarted() {
            this.progress = 1;
        },
        primeButton() {
            if (this.progress == 0) {
                this.login()
            }
            else if (this.progress == 1) {
                this.verify();
            } else if (this.progress == 2) {
                return;

            } else if (this.progress == 3) {
                this.confirm();

            } else if (this.progress == 4) {
                // change password


            } else {
                //error //TODO
            }
            return 'hi';
        }

    }

}

</script>


<style lang="scss" scoped>
.wrapper {
    background-color: var(--color-surface);
    width: 100%;
    height: 100%;
    padding: var(--space-xl) var(--space-lg);
    border-radius: var(--radius-sm);
    color: var(--color-on-surface);
}
@-webkit-keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

.pulse {
    -webkit-animation-name: pulse;
    animation-name: pulse;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

.noShow {
    display: none;
}

</style>
