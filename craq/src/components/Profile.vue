<template>
    <div class="profiles">
        <div class="backimg">
            <img src="@/assets/header.jpg" alt="" class="userBack">
            <div class="circle"></div>
            <!-- userImage -->
            <label for="PROFILEIMAGE">
            <img :src="url" alt="" class="userImg">
            </label>
                <input type="file" accept=".gif,.jpg,.jpeg,.png" ref="profileImage" @change="uploadImage" id="PROFILEIMAGE" v-show="false">


            <!-- end userImage -->
            <div class="rectangular"></div>

            <div class="userInfo">
                <div class="userInfo__name">
                    {{username}}
                </div>
                <div class="userInfo__list">
                    <div class="userInfo__list__btn" @click="toggleInformation"><span>Information</span></div>
                    <div class="userInfo__list__btn" @click="toggleActivity"><span>Activity</span></div>
                    <div class="userInfo__list__btn" @click="toggleFollow"><span>Follow</span></div>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="information" v-show="setInformation">

                <div class="information__profile">
                    <div class="information__title">
                        Profile
                    </div>
                    <div class="information__content">
                        <div class="information__content-details">
                            <strong>SSAFY Years</strong> 
                            <div>
                                <select class="editInput" v-show="toggleProfile" v-model="userData.ssafy_years">
                                    <option value="1" selected="selected">1</option>
                                    <option value="2">2</option>
                                </select>
                                <span v-show="!toggleProfile">{{ userData.ssafy_years }} 기</span> &nbsp;
                            </div>
                        </div>
                        <div class="information__content-details">
                            <strong>Major</strong>
                            <div>
                                <input class="editInput" v-show="toggleProfile" v-model="userData.is_major">
                                <span v-show="!toggleProfile">{{ userData.is_major }}</span> &nbsp;
                            </div>
                        </div>
                        <div class="information__content-details">
                            <strong>SW Grade</strong>
                            <div>
                                <select class="editInput" v-show="toggleProfile" v-model="userData.grade">
                                    <option class="editOption" v-for="grade in grades" :value="grade" selected="selected">{{grade}}</option>
                                </select>
                                <span v-show="!toggleProfile">{{ userData.grade }}</span> &nbsp;
                            </div>
                        </div>
                        <div class="information__content-details">
                            <strong>Region</strong>
                            <div>
                                <select class="editInput" v-show="toggleProfile" v-model="userData.region">
                                    <option class="editOption" value="대전" selected="selected">대전</option>
                                    <option class="editOption" value="서울" >서울</option>
                                    <option class="editOption" value="구미" >구미</option>
                                    <option class="editOption" value="광주" >광주</option>
                                </select> 
                                <span v-show="!toggleProfile">{{ userData.region }}</span> &nbsp;
                            </div>
                        </div>
                        <div class="information__content-github">
                            <strong>Git URL</strong>
                            <div>
                                <input class="editGithub" v-show="toggleProfile" v-model="userData.gitUrl">
                                <a :href="userData.gitUrl" target="_blank"><span v-show="!toggleProfile">{{ userData.gitUrl }}</span> &nbsp;</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>

                <div class="information__skill">
                    <div class="information__title">
                        Skill    
                    </div>
                    <!-- <div class="information__content">
                        <div class="skill-icon" :key="skill" v-for="skill in skillIcon" v-show="toggleProfile">
                        <input type="checkbox" :id="skill.title" :value="skill" v-model="checkedSkill">
                        <label :for="skill.title"><img :src="skill.url" alt="" class="skill-icon-img"></label>
                        </div>
                        <div class="skill-icon" :key="check" v-for="check in checkedSkill" v-show="!toggleProfile">
                        <img :src="check.url" alt="" class="skill-icon-img">
                        </div>
                        </div> -->
                </div>

                <div class="separator"></div>

                <div class="information__description">
                    <div class="information__title">
                        Self-Introduction
                    </div>
                    <div class="information__content">
                        <div v-show="!toggleProfile" class="selfintroduce">{{userData.intro}} </div>
                        <textarea class="selfintroduce__form" v-model="userData.intro" v-show="toggleProfile" autofocus></textarea>
                    </div>
                </div>
                <div class="editAndSubmit" v-if="MyProfile">
                    <div class="btn btn--primary btn--lg" v-show="!toggleProfile" @click="toggleProfile = true">Edit</div>
                    <div class="btn btn--primary btn--lg" v-show="toggleProfile" @click="editProfile">Save</div>
                    <div class="btn btn--lg" v-show="toggleProfile" @click="toggleProfile = false">Cancle</div>
                </div>
            </div>

            <ProfileActivity v-if="loadedActivity&&setActivity" :userActivityData="userActivityData" :userData="userData.PK"/>
            <ProfileFollow v-if="loadedFollow&&setFollow" :followers="followers" :followings="followings"/>

            <div class="Notify" v-show="setNotify">
                Notify
                <template v-for="noty in noties" v-key="noty.id">
                    <li class="menu__item js-menu__item" role="menuitem">
                        <Noty :noty="noty" @onClose="notyClose(noty.id)" @onGo="notyGo(noty.id)" ></Noty>
                    </li>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import Noty from '@/components/Noty.vue';
import swal from 'sweetalert';
import Spinner from '@/components/Spinner.vue';

//import ProfileActivity from '@/components/ProfileActivity.vue';
const ProfileActivity= () => ({
    component: import("@/components/ProfileActivity.vue"),
    loading: Spinner,
    delay: 500
})

// import ProfileFollow from '@/components/ProfileFollow.vue';
const ProfileFollow= () => ({
    component: import("@/components/ProfileFollow.vue"),
    loading: Spinner,
    delay: 500
})


export default {
    name: 'profile',
    components: {
        Noty,
        ProfileActivity,
        ProfileFollow,
    },
    data() {
        return {
            //image src
            imageFile: "default_profile.png",
            // 내 프로필인지 확인
            MyProfile : false,

            // 모든 유저 정보
            allUserInfo : [],

            // 유저 정보
            user_pk: '',
            username: '',
            userData: [],
            // 유저 정보 끝

            // 활동 모음
            userActivityData : [],

            // 팔로우 정보
            followings : [{
                PK:1
            }],
            followers : [
                {PK:1}
            ],

            // 수정 할 것인지 체크
            toggleProfile: false,

            // 프로필 필터 체크
            loadedActivity: false,
            loadedFollow: false,
            loadedFollower : false,
            loadedFollowing : false,
            setInformation : true,
            setActivity : false,
            setFollow : false,
            setNotify : false,

            // 프로필 데이터용

            // 전체 프로필 정보 목록
            Profiles: {
                ssafyGrade : '',
                Major : '',
                SwGrade : '',
                Region : '',
                GitUrl : '',
            },

            // 자기소개
            selfIntroduce: 'Edit Your Introduce',

            // 반 DropDown
            grades: [
                "IM", "A","A+", "B","C",
                ],

            // Skill DATA
            skillIcon: [
                { title: 'Java', url : require('@/assets/Java.png') },
                { title: 'Python', url : require('@/assets/Python.png') },
                { title: 'Vue', url : require('@/assets/Vue.png') },
                { title: 'CSS', url : require('@/assets/CSS.png') },
                { title: 'HTML', url : require('@/assets/HTML.png') },
                { title: 'Node', url : require('@/assets/Node.png') },
                { title: 'Django', url : require('@/assets/Django.png') },
                { title: 'Spring', url : require('@/assets/Spring.png') },
            ],
            checkedSkill : [],
            // End Skill DATA

            // 알림창
            noties: [
                {
                    id: 1,
                    type: "Noty",
                    title:"TITLE111",
                    body: "bodies here",
                    author: "user11",
                    to: {name: 'home'},
                    active: true
                },
            ],
        }
    },
    mounted() {
        this.setProfie();
        this.updateImage();
        this.updateUser();
    },
    computed: {
        url: function() {
            return `http://13.125.251.247:8080/${this.imageFile}`
        }
    },
    methods: {
        setProfie() {
            this.MyProfile = false
            this.loadedActivity = false
            this.loadedFollow = false
            
            this.loadedFollower = false
            this.loadedFollowing = false

            this.setInformation = true
            this.setActivity = false
            this.setFollow = false
        },
        updateUser() {
            this.setProfie()
            this.$axios.get('users').then(res => {
                this.allUserInfo = res.data
                this.allUserInfo.forEach((data) => {
                    if (data.USERNAME.toLowerCase() == this.$route.params.user_name.toLowerCase()) {
                        this.$axios.get('users/profile/' + data.PK).then(response => {
                            this.user_pk = data.PK
                            this.userData = response.data[0]
                            this.$axios.get('users/writing/' + data.PK).then(res => {
                                this.userActivityData = res.data.data
                                this.loadedActivity = true
                            })
                            let a = this.$axios.get('follows/' + data.PK).then(res => {
                                this.followers = res.data.data
                                this.loadedFollower = true
                            })
                            let b = this.$axios.get('followings/' + data.PK).then(res => {
                                this.followings = res.data.data
                                this.loadedFollowing = true

                            })
                            Promise.all([a, b]).then(()=>{
                                if(this.loadedFollower&&this.loadedFollowing) {
                                    this.loadedFollow = true
                                }
                            })

                            this.username = data.USERNAME

                            if(this.$session.get('username').toLowerCase() == this.$route.params.user_name.toLowerCase()) {
                                this.MyProfile = true
                            }
                        })
                    }
                })
            })

        },
        uploadImage() {
            let form = new FormData();
            let file = this.$refs.profileImage.files[0];
            form.append('image', file);
            this.$axios.post('profile/images', form).then(res=>{
                this.updateImage();
            }).catch(err=>console.log(err));
        },
        updateImage() {
            if (this.$route.params.user_pk) {
                this.$axios.get("users/profile-image/" + this.$route.params.user_pk).then(
                    res=>{
                        this.imageFile = res.data.data;
                    }
                )
            }
            if (!(this.$route.params.user_pk)){
                this.$axios.get("users/profile-image-name/" + this.$route.params.user_name).then(
                    res=>{
                        this.imageFile = res.data.data;
                    }
                )
            }
        },
        editProfile() {
            const data = {
                'User' : this.userData.User,
                'ssafy_years': this.userData.ssafy_years,
                'is_major': this.userData.is_major,
                'region': this.userData.region,
                'grade': this.userData.grade,
                'intro': this.userData.intro,
                'gitUrl': this.userData.gitUrl,
                'profile_image': this.userData.profile_image,
            }
            this.$axios.put('profile', data).then(res=>{
                console.log(res.data);
                swal({  
                        title : "수정 완료",
                        text : "프로필 수정을 완료하였습니다.",
                        icon : 'success',
                        button: false,
                        timer: 2000,
                        });
            }).catch(err => console.log(err))
            this.$axios.get("users/profile/" + this.user_pk).then(res=>{
                
            })
            this.toggleProfile = false
        },
        notyClose(id) {
            this.noties = this.noties.filter(noty=>noty.id != id);
        },
        notyGo(id) {
            let to = "/"
            for (let i = 0; i < this.noties.length; i++) {
                if (this.noties[i].id == id) {
                    this.noties[i].active = false;
                    to = this.noties[i].to
                    break;
                }
            }
            this.$router.push(to);
            this.noties.sort((a, b) => b.active-a.active);
        },
        toggleInformation() {
            if (this.setInformation == false) {
                this.setInformation = true
                this.setActivity = false
                this.setFollow = false
            }
        },
        toggleActivity() {
            if (this.setActivity == false && this.loadedActivity == true) {
                this.setInformation = false
                this.setActivity = true
                this.setFollow = false
            }
        },
        toggleFollow() {
            if (this.setFollow == false && this.loadedFollow == true) {
                this.setInformation = false
                this.setActivity = false
                this.setFollow = true
            }
        }
    },
    watch: {
        $route () {
            this.loadedFollow = false;
            this.updateImage();
            this.updateUser();
        }
    }
}
</script>

<style lang="scss" scoped>
$--menu-item-padding: var(--space-xxs) var(--space-sm);
$--menu-width: 22rem;

.profiles {
    display: flex;
    flex-direction: column;
}

.userBack {
    width: 100%;
    height: 280px;
}

.backimg {
    width: 100%;
    height: 400px;
    box-shadow: var(--shadow-sm);
    background-color: var(--color-surface-light);
}

.circle {
    position: relative;
    top: -150px;
    left: 50px;
    background-color: var(--color-white);
    border-radius: 50%;
    border: 10px solid alpha(var(--color-tertiary), 0.8);
    width: 250px;
    height: 250px;
    z-index: 10;
}

.rectangular {
    position: relative;
    top: -530px;
    border-top: 10px solid alpha(var(--color-tertiary), 0.8);
    border-bottom: 10px solid alpha(var(--color-tertiary), 0.8);
    background-color: var(--color-white);
    width: 100%;
    height: 50px;
    z-index: 15;
}

.userImg {
    position: relative;
    top: -390px;
    left: 60px;
    width: 230px;
    height: 230px;
    border: 10px solid var(--color-white);
    border-radius: 50%;
    z-index: 20;
    display: flex;
    flex-direction: column;
}

.userImg:hover {
    cursor: pointer;
}

.userInfo {
    position: relative;
    width: 30%;
    top: -525px;
    left: 300px;
    height: 100px;
    background-color: var(--color-surface-light);
    z-index: 25;
    padding: var(--space-xxs);

    &__name {
        font-size: var(--text-xl);
        font-weight: bold;
        margin: var(--space-xxs);
        cursor: default;
    }

    &__list {
        display: flex; 

        &__btn {
            color: var(--color-on-surface);
            font-size: var(--text-md);
            margin-right: var(--space-lg);
            margin-left: var(--space-xs);
        }

        &__btn:hover {
            color: var(--color-contrast-low);
            cursor: pointer;
        }
    }
}

.content {
    padding: var(--space-md) var(--space-xl);
    background-color: var(--color-background);
}

.information {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--space-md);
    background-color: var(--color-surface);

    &__notify {
        font-size: var(--text-md);
    }

    &__title {
        font-size: var(--text-lg);
        font-weight: bold;
        margin-bottom: var(--space-sm);
    }

    &__content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        &-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 48%;
            height: 34px;
            font-size: var(--text-md);
            margin-bottom: var(--space-sm);
        }

        &-github {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 34px;
            font-size: var(--text-md);
            margin-bottom: var(--space-sm);
        }
    }

    &__profile {
        width: 100%;
        background-color: var(--color-surface);
        user-select: none;

        padding: var(--space-sm);
        margin-bottom: var(--space-md);
    }

    &__skill {
        width: 100%;
        background-color: var(--color-surface);

        padding: var(--space-sm);
        margin-bottom: var(--space-md);
    }

    &__description {
        width: 100%;
        height: 300px;
        background-color: var(--color-surface);

        padding: var(--space-sm);
        margin-bottom: var(--space-md);
    }
}


.menu__item {
    text-decoration: none; // reset link style
    display: block; // fallback
    display: flex;
    align-items: center;
    padding: $--menu-item-padding;
    color: var(--color-contrast-high);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 1000px;
    &:hover {
        background-color: var(--color-contrast-lower);
    }
}

.separator {
    height: 1px;
    background-color: var(--color-contrast-low);

}

.editInput {
    width: 200px;
    text-align: end;
    border: 1px dashed var(--color-contrast-low);
    border-radius: var(--radius-sm);
}

.editGithub {
    text-align: end;
    border: 1px dashed var(--color-contrast-low);
    border-radius: var(--radius-sm);
    width: 500px;
}

.skill-icon {
    font-size: 5rem;
    color: var(--color-primary-darker);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    user-select: none;

    &-img {
        margin-right: var(--space-xxxs);
        width: 100px;
        height: 100px;
    }
}

.information__content .skill-icon input[type="checknox"] {
    display: none;
}

.selfintroduce {
    width: 100%;
    height: 200px;
    border: 1px solid var(--color-contrast-low); 
    padding: var(--space-sm);
    font-size: var(--text-lg);

    &__form {
        width: 100%;
        height: 200px;
        border: 1px solid var(--color-contrast-low); 
        resize: none;
    }
}

.editAndSubmit {
    text-align: end;
}

.btn {
    margin: var(--space-xs);
}
</style>

