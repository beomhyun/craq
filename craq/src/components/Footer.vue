<template>
    <footer class="main-footer padding-y-lg">
        <div class="container max-width-lg">

            <div class="main-footer__colophon">
                <div class="main-footer__colophon-nav">
                    <span>&copy; myWebsite</span>
                    <a href="#0">Terms</a>
                    <a href="#0">Privacy</a>
                    <vueDropdown
             :config="config"
            @setSelectedOption="setNewSelectedOption($event);">
            </vueDropdown>
                </div>

            </div>
            
        </div>
    </footer>
</template>


<script>
import vueDropdown from "./vue-dropdown";
export default {
    name: "Footer",
    components: {
        vueDropdown,
    },
    data: function() {
    return {
      config: {
        options: [
          {
            value: "Edu.SSAFY"
          },
          {
            value: "Jira.SSAFY"
          },
          {
            value: "Lab.SSAFY"
          },
          {
            value: "Project.SSAFY"
          }
        ],
        placeholder: "Placeholder",
        backgroundColor: "#cde4f5",
        textColor: "black",
        borderRadius: "1.5em",
        border: "1px solid gray",
        width: 180
      }
    };
  },
  methods: {
    setNewSelectedOption(selectedOption) {
      this.config.placeholder = selectedOption.value;
    }
  }
}

</script>


<style lang="scss" scoped>
// colophon
.main-footer__colophon {
    border-top: 1px solid var(--color-contrast-low);
    padding-top: var(--space-xxxs);
    margin-top: var(--space-md);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
}

.main-footer__colophon-nav {
    font-size: var(--text-sm);
    color: var(--color-contrast-medium);
    margin-right: var(--space-sm);

    a {
        color: inherit;
        &:hover {
            color: var(--color-contrast-high);
        }
    }

}


</style>
